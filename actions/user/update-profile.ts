"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type UpdateUser = {
  id: string;
  name?: string;
  image: string | null;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: string;
  linkedinProfile?: string;
  portfolioUrl?: string;
};
export async function updateUserProfile(userData: UpdateUser) {
  try {
    const {
      id,
      name,
      image,
      firstName,
      lastName,
      phoneNumber,
      location,
      linkedinProfile,
      portfolioUrl,
    } = userData;

    // Buat objek field yang akan diupdate
    const updateFields: Record<string, any> = {
      name,
      firstName,
      lastName,
      phoneNumber,
      location,
      linkedInProfile: linkedinProfile,
      portfolioUrl,
    };

    // Hanya tambahkan image jika ada
    if (image) {
      updateFields.image = image;
    }

    await db.update(users).set(updateFields).where(eq(users.id, id));

    revalidatePath(`/dashboard/account`);

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
