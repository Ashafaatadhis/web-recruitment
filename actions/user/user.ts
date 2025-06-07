"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { User, UserRole } from "@/lib/types/models/user";

import { CreateUserInput } from "@/lib/types/user";
import { UserEditFormSchema } from "@/schemas/user-form";
import { hash } from "bcrypt";

import { and, count, eq, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type GetAllUserParams = {
  page?: number;
  limit?: number;
  role?: UserRole | "all"; // "all" artinya tanpa filter role
  search?: string; // pencarian nama atau email
};

export async function getAllUser({
  limit = 10,
  page = 1,
  role = "all",
  search = "",
}: GetAllUserParams = {}) {
  const offset = (page - 1) * limit;

  // Filter kondisi
  const filters = [];

  if (role !== "all") {
    filters.push(eq(users.role, role));
  }

  if (search.trim()) {
    filters.push(
      or(like(users.name, `%${search}%`), like(users.email, `%${search}%`))
    );
  }

  const data = await db
    .select()
    .from(users)
    .where(and(...filters))
    .limit(limit)
    .offset(offset);

  const total = await db
    .select({ count: count() })
    .from(users)
    .where(and(...filters));

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

export async function updateUser(id: string, data: UserEditFormSchema) {
  await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      username: data.username,
      role: data.role,
    })
    .where(eq(users.id, id));

  revalidatePath("/dashboard/users");
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}
