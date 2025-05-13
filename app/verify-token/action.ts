"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

export const verifyTokenAction = async (hexToken: string, jwtToken: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.verificationToken, hexToken),
    });

    if (!user) {
      return { status: false, error: "Invalid or expired OTP." };
    }

    // Decode and verify the JWT token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET!);

    // Check if the JWT token is expired
    if (!decoded || typeof decoded === "string") {
      return { status: false, error: "Invalid or expired token." };
    }

    // If both tokens are valid, verify the email
    await db
      .update(users)
      .set({ emailVerified: new Date(), verificationToken: null })
      .where(eq(users.id, user.id));

    return { status: true, message: "Email verified successfully." };
  } catch (error) {
    console.error("Error during verification:", error);
    return { status: false, error: "An error occurred during verification." };
  }
};
