import nodemailer from "nodemailer";
import { generateJWT } from "./jwt";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const generateNumericCode = async (length: number) => {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};
export const sendVerificationEmail = async (
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
