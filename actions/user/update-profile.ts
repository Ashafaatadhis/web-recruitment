"use server";

import { db } from "@/lib/db"; // Import your database connection
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type UpdateUser = {
  id: string;
  name?: string;
  image: string | null;
};

export async function updateUserProfile(userData: UpdateUser) {
  try {
    // Assuming you have a 'users' table and a 'User' type defined
    const { id, name, image } = userData;

    await db.update(users).set({ name, image }).where(eq(users.id, id));

    return { status: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      status: false,
      message: "Failed to update profile.",
      error: error,
    };
  }
}
