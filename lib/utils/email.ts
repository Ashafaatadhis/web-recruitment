import nodemailer from "nodemailer";
import { generateJWT } from "./jwt";

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
  const verificationLink = `${process.env.BASE_URL}/verify-token?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // misal: smtp.gmail.com
    port: Number(process.env.SMTP_PORT), // biasanya 465 (SSL) atau 587 (TLS)
    secure: Number(process.env.SMTP_PORT) === 465, // true kalau pakai 465 (SSL)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Anime Recruit" <${process.env.SMTP_USER}>`, // format from yang valid
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="text-align: center; color: #333;">Email Verification</h2>
        <p style="text-align: center; color: #555;">Use this code to verify your email address:</p>
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
        <p style="text-align: center; color: #555;">Or click the link below:</p>
        <p style="text-align: center;">
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: bold; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Verify Email</a>
        </p>
        <p style="text-align: center; color: #aaa;">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  };

  // optional: verify SMTP connection before sending
  try {
    await transporter.verify();
    console.log("✅ SMTP server is ready to send email.");

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", email);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error; // agar bisa ditangkap dan di-log juga dari `registerUser`
  }
};
