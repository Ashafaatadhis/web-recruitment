"use server";

import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AdapterAccountType } from "next-auth/adapters";

type RegisterData = {
  email: string;
  password: string;
  name: string;
  username: string;
};

const action = async (data: RegisterData) => {
  try {
    // Cek apakah user dengan email ini sudah ada
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
      with: {
        accounts: true, // Changed from account to accounts (plural)
      },
    });

    if (existingUser) {
      // Cek apakah sudah ada provider 'credentials'
      const hasCredentialsProvider = existingUser.accounts.some(
        (account) => account.provider === "credentials"
      );

      if (hasCredentialsProvider) {
        return {
          status: false,
          error: "Email already registered with password",
        };
      }

      // Kalau belum ada credentials → tambahkan akun credentials
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Update password, username, dan name untuk user yang sudah ada
      await db
        .update(users)
        .set({
          password: hashedPassword,
          username: data.username,
          name: data.name,
        })
        .where(eq(users.id, existingUser.id));

      // Tambahkan akun credentials
      await db.insert(accounts).values({
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

      return {
        status: true,
        message: "Account linked to existing Google login",
      };
    }

    // Kalau belum ada user sama sekali → buat user baru
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // Create new user
    const [createdUser] = await db
      .insert(users)
      .values({
        email: data.email,
        name: data.name,
        username: data.username,
        password: hashedPassword,
      })
      .returning();

    if (!createdUser) {
      return {
        status: false,
        error: "Failed to create user",
      };
    }

    // Tambahkan akun credentials untuk user yang baru dibuat
    await db.insert(accounts).values({
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

    return {
      status: true,
      message: "Registration successful",
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
