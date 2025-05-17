"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { generateNumericCode, sendVerificationEmail } from "@/lib/utils/email";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

export const resendVerificationAction = async (userId: string) => {
  try {
    const COOLDOWN_SECONDS = parseInt(
      process.env.VERIFICATION_COOLDOWN || "30"
    );

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return { status: false, error: "User not found." };
    }

    // Get current time before any async operations
    const currentTime = new Date();

    // Check if cooldown period is active using currentTime
    if (
      user.lastVerificationRequest &&
      user.lastVerificationRequest.getTime() + COOLDOWN_SECONDS * 1000 >
        currentTime.getTime()
    ) {
      const remainingTime = Math.ceil(
        (user.lastVerificationRequest.getTime() +
          COOLDOWN_SECONDS * 1000 -
          currentTime.getTime()) /
          1000
      );
      return {
        status: false,
        error: `Please wait ${remainingTime} seconds before requesting a new code`,
        cooldown: remainingTime,
      };
    }

    // Generate and send new code
    const verificationCode = await generateNumericCode(6);

    await db
      .update(users)
      .set({
        verificationToken: verificationCode,
        lastVerificationRequest: currentTime,
      })
      .where(eq(users.id, user.id));

    if (!user.email) throw new Error("User email is required");

    // Don't await the email sending
    sendVerificationEmail(user.email, verificationCode, user.id).catch(
      (error) => console.error("Email sending failed:", error)
    );

    return { status: true, message: "Verification code resent successfully." };
  } catch (error) {
    console.error("Error resending verification:", error);
    return { status: false, error: "Failed to resend verification code." };
  }
};

export const verifyTokenAction = async (hexToken: string, jwtToken: string) => {
  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET!);

    if (!decoded || typeof decoded === "string") {
      return { status: false, error: "Invalid or expired token." };
    }

    // Find user by ID from JWT payload
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      return { status: false, error: "User not found." };
    }

    // Verify hexToken matches user's verificationToken
    if (user.verificationToken !== hexToken) {
      return { status: false, error: "Invalid verification token." };
    }

    // If all checks pass, verify the email
    await db
      .update(users)
      .set({ emailVerified: new Date(), verificationToken: null })
      .where(eq(users.id, user.id));

    return { status: true, message: "Email verified successfully." };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Special case for expired token
      const decoded = jwt.decode(jwtToken);
      if (!decoded || typeof decoded === "string") {
        return {
          status: false,
          error: "Invalid token",
          expired: false,
        };
      }

      return {
        status: false,
        error: "Token expired",
        expired: true,
        userId: decoded.id,
      };
    }
    console.error("Error during verification:", error);
    return {
      status: false,
      error: "An error occurred during verification.",
      expired: false,
    };
  }
};
