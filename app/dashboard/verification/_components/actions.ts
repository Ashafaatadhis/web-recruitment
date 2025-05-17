"use server";

import { db } from "@/lib/db";
import { recruiterVerificationSubmissions, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { VerificationStatus } from "@/types/verification-types";

export async function fetchVerificationRequests(status: VerificationStatus) {
  try {
    const requests = await db.query.recruiterVerificationSubmissions.findMany({
      where: eq(recruiterVerificationSubmissions.status, status),
      with: {
        recruiterUser: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: (submissions) => submissions.submittedAt,
    });

    return requests;
  } catch (error) {
    console.error("Error fetching verification requests:", error);
    throw new Error("Failed to fetch verification requests");
  }
}

export async function updateVerificationStatus(
  submissionId: string,
  status: VerificationStatus,
  adminReviewNotes?: string
) {
  const session = await auth();

  // Check if user is authenticated and has admin role
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    // Start a transaction
    return await db.transaction(async (tx) => {
      // Get the submission
      const submission =
        await tx.query.recruiterVerificationSubmissions.findFirst({
          where: eq(recruiterVerificationSubmissions.id, submissionId),
        });

      if (!submission) {
        throw new Error("Verification submission not found");
      }

      // Update the submission status
      await tx
        .update(recruiterVerificationSubmissions)
        .set({
          status,
          adminReviewerId: session.user.id,
          adminReviewNotes: adminReviewNotes || null,
          reviewedAt: new Date(),
        })
        .where(eq(recruiterVerificationSubmissions.id, submissionId));

      // If approved, update the user's isRecruiterVerified status
      if (status === "approved") {
        await tx
          .update(users)
          .set({
            isRecruiterVerified: true,
          })
          .where(eq(users.id, submission.recruiterUserId));
      }

      revalidatePath("/dashboard/admin/verification");
      return { success: true };
    });
  } catch (error) {
    console.error("Error updating verification status:", error);
    throw new Error("Failed to update verification status");
  }
}
