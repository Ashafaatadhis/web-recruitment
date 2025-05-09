// /app/login/action.ts

"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

type TFormData = {
  email: string;
  password: string;
};

const action = async (formData: TFormData) => {
  try {
    const { password, email } = formData;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.password) {
      return {
        message: "User not found",
        status: false,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        message: "Password is incorrect",
        status: false,
      };
    }

    await signIn("credentials", {
      email: user.email,
      name: user.name,
      id: user.id,
      redirect: true,
      redirectTo: "/",
    });

    return {
      message: "Login successful",
      status: true,
    };
  } catch (error) {
    return {
      message: "Login failed",
      status: false,
    };
  }
};

export default action;
