"use server";

import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { AdapterAccountType } from "next-auth/adapters";
import { generateNumericCode, sendVerificationEmail } from "@/lib/utils/email";

type RegisterData = {
  email: string;
  password: string;
  name: string;
  username: string;
};

export const registerUser = async (data: RegisterData) => {
  try {
    await db.transaction(async (trx) => {
      const existingUser = await trx.query.users.findFirst({
        where: eq(users.email, data.email),
        with: { accounts: true },
      });

      const hashedPassword = await bcrypt.hash(data.password, 10);

      let userId: string;

      if (existingUser) {
        const hasCredentialsProvider = existingUser.accounts.some(
          (acc) => acc.provider === "credentials"
        );

        if (hasCredentialsProvider) {
          throw new Error("Email already registered with password");
        }

        await trx
          .update(users)
          .set({
            password: hashedPassword,
            username: data.username,
            name: data.name,
          })
          .where(eq(users.id, existingUser.id));

        await trx.insert(accounts).values({
          userId: existingUser.id,
          type: "credentials" as AdapterAccountType,
          provider: "credentials",
          providerAccountId: existingUser.id,
        });

        userId = existingUser.id;
      } else {
        const [createdUser] = await trx
          .insert(users)
          .values({
            email: data.email,
            name: data.name,
            username: data.username,
            password: hashedPassword,
          })
          .returning();

        if (!createdUser) {
          throw new Error("Failed to create user");
        }

        userId = createdUser.id;

        await trx.insert(accounts).values({
          userId: createdUser.id,
          type: "credentials" as AdapterAccountType,
          provider: "credentials",
          providerAccountId: createdUser.id,
        });
      }

      // Generate and save verification code
      const verificationCode = await generateNumericCode(6);
      await trx
        .update(users)
        .set({ verificationToken: verificationCode })
        .where(eq(users.id, userId));

      // Send email (always await!)
      try {
        await sendVerificationEmail(data.email, verificationCode, userId);
        console.log("✅ Email sent to", data.email);
      } catch (err) {
        console.error("❌ Email sending failed:", err);
        throw new Error("Email sending failed");
      }
    });

    return {
      status: true,
      message:
        "Registration successful. Please check your email for a verification code.",
    };
  } catch (error) {
    console.error("❌ Registration error:", error);
    return {
      status: false,
      error:
        "Registration failed: " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
};

export default registerUser;
