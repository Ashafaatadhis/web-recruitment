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
    // Start a transaction
    await db.transaction(async (trx) => {
      // Check if a user with this email already exists
      const existingUser = await trx.query.users.findFirst({
        where: eq(users.email, data.email),
        with: {
          accounts: true,
        },
      });

      if (existingUser) {
        const hasCredentialsProvider = existingUser.accounts.some(
          (account) => account.provider === "credentials"
        );

        if (hasCredentialsProvider) {
          throw new Error("Email already registered with password");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

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
          refresh_token: null,
          access_token: null,
          expires_at: null,
          token_type: null,
          scope: null,
          id_token: null,
          session_state: null,
        });

        // Generate a numeric verification code
        const verificationCode = await generateNumericCode(6);

        // Store the verification code in the database
        await trx
          .update(users)
          .set({ verificationToken: verificationCode })
          .where(eq(users.id, existingUser.id));

        // Send the verification email without waiting
        // sendVerificationEmail(
        //   data.email,
        //   verificationCode,
        //   existingUser.id
        // ).catch((error) => console.error("Email sending failed:", error));
        try {
          await sendVerificationEmail(
            data.email,
            verificationCode,
            existingUser.id
          );
        } catch (error) {
          console.error("Email sending failed:", error);
        }

        return {
          status: true,
          message: "Account linked to existing Google login",
        };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
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

      await trx.insert(accounts).values({
        userId: createdUser.id,
        type: "credentials" as AdapterAccountType,
        provider: "credentials",
        providerAccountId: createdUser.id,
        refresh_token: null,
        access_token: null,
        expires_at: null,
        token_type: null,
        scope: null,
        id_token: null,
        session_state: null,
      });

      // Generate a numeric verification code
      const verificationCode = await generateNumericCode(6);

      // Store the verification code in the database
      await trx
        .update(users)
        .set({ verificationToken: verificationCode })
        .where(eq(users.id, createdUser.id));

      // Send the verification email without waiting
      sendVerificationEmail(data.email, verificationCode, createdUser.id).catch(
        (error) => console.error("Email sending failed:", error)
      );
    });

    return {
      status: true,
      message:
        "Registration successful. Please check your email for a verification code.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      status: false,
      error:
        "Registration failed: " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
};

export default registerUser;
