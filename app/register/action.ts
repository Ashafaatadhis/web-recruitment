"use server";

import bcrypt from "bcryptjs"; // Change this import
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function action({
  email,
  password,
  name,
  username,
}: {
  email: string;
  password: string;
  name: string;
  username: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      username,
    });

    return { status: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { status: false, error: "Registration failed" };
  }
}
