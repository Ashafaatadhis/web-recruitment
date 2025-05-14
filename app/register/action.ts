"use server";

import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { AdapterAccountType } from "next-auth/adapters";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";

type RegisterData = {
  email: string;
  password: string;
  name: string;
  username: string;
};

const generateNumericCode = (length: number) => {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10); // Generate a random digit
  }
  return code;
};

const generateJWT = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

const sendVerificationEmail = async (
  email: string,
  code: string,
  userId: string
) => {
  const token = generateJWT(userId);
  const verificationLink = `http://localhost:3000/verify-token?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="text-align: center; color: #333;">Email Verification</h2>
        <p style="text-align: center; color: #555;">Please use the following code to verify your email address:</p>
        <div style="text-align: center; margin: 20px 0;">
          ${code
            .split("")
            .map(
              (digit) => `
            <span style="display: inline-block; width: 30px; height: 30px; line-height: 30px; font-size: 16px; font-weight: bold; color: #fff; background-color: #007bff; border-radius: 5px; margin: 0 3px;">${digit}</span>
          `
            )
            .join("")}
        </div>
        <p style="text-align: center; color: #555;">Or click the link below to verify your email:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: bold; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Verify Email</a>
        <p style="text-align: center; color: #555;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Use false for port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail(mailOptions);
};

const action = async (data: RegisterData) => {
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
        const verificationCode = generateNumericCode(6);

        // Store the verification code in the database
        await trx
          .update(users)
          .set({ verificationToken: verificationCode })
          .where(eq(users.id, existingUser.id));

        // Send the verification email
        await sendVerificationEmail(
          data.email,
          verificationCode,
          existingUser.id
        );

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
      const verificationCode = generateNumericCode(6);

      // Store the verification code in the database
      await trx
        .update(users)
        .set({ verificationToken: verificationCode })
        .where(eq(users.id, createdUser.id));

      // Send the verification email
      await sendVerificationEmail(data.email, verificationCode, createdUser.id);
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

export default action;
