"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { CreateUserInput } from "@/lib/types/user";
import { hash } from "bcrypt";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllUser({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
} = {}) {
  const offset = (page - 1) * limit;

  const data = await db.select().from(users).limit(limit).offset(offset);

  const total = await db.select({ count: count() }).from(users);

  return {
    users: data,
    total,
    page,
    totalPages: Math.ceil(Number(total[0].count) / limit),
  };
}

export async function deleteUser(id: string) {
  // Pastikan id valid
  if (!id) throw new Error("User ID is required");

  // Delete user by id
  await db.delete(users).where(eq(users.id, id));

  revalidatePath("/dashboard/users");
}

export async function createUser(data: CreateUserInput) {
  const hashedPassword = await hash(data.password, 10);

  await db.insert(users).values({
    name: data.name,
    email: data.email,
    username: data.username,
    password: hashedPassword,
    role: data.role,
    emailVerified: new Date(),
  });

  revalidatePath("/dashboard/users"); // pastikan data terbaru
}
