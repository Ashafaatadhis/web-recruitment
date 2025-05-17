"use server";

import { db } from "@/lib/db";
import { recruiterVerificationSubmissions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";
import { VerificationStatusResponse } from "@/types/verification-types";

interface VerificationSubmission {
  userId: string;
  documentUrl: string;
  notes?: string;
}

export async function submitVerification({
  userId,
  documentUrl,
  notes,
}: VerificationSubmission) {
  try {
    // Check if user exists and is a recruiter
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.role !== "recruiter") {
      return {
        success: false,
        message: "Only recruiters can submit verification",
      };
    }

    // Check if user already has a pending or approved verification
    const existingSubmission =
      await db.query.recruiterVerificationSubmissions.findFirst({
        where: eq(recruiterVerificationSubmissions.recruiterUserId, userId),
        orderBy: (submissions) => submissions.submittedAt,
      });

    if (
      existingSubmission &&
      (existingSubmission.status === "pending" ||
        existingSubmission.status === "approved")
    ) {
      return {
        success: false,
        message:
          existingSubmission.status === "pending"
            ? "You already have a pending verification request"
            : "Your account is already verified",
      };
    }

    // Create new verification submission
    await db.insert(recruiterVerificationSubmissions).values({
      recruiterUserId: userId,
      documentUrl,
      submissionNotes: notes || null,
      status: "pending",
      submittedAt: new Date(),
    });

    revalidatePath("/dashboard/account");
    return { success: true };
  } catch (error) {
    console.error("Error submitting verification:", error);
    return { success: false, message: "Failed to submit verification" };
  }
}

export async function getVerificationStatus(
  userId: string
): Promise<VerificationStatusResponse> {
  try {
    // Check if user is verified
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        isRecruiterVerified: true,
      },
    });

    if (user?.isRecruiterVerified) {
      return { status: "approved" };
    }

    // Get the latest verification submission
    const submission =
      await db.query.recruiterVerificationSubmissions.findFirst({
        where: eq(recruiterVerificationSubmissions.recruiterUserId, userId),
        orderBy: (submissions) => submissions.submittedAt,
      });

    if (!submission) {
      return { status: "none" };
    }

    return {
      status: submission.status,
      documentUrl: submission.documentUrl,
      submissionNotes: submission.submissionNotes,
      adminReviewNotes: submission.adminReviewNotes,
      submittedAt: submission.submittedAt,
      reviewedAt: submission.reviewedAt,
    };
  } catch (error) {
    console.error("Error getting verification status:", error);
    return { status: "none" };
  }
}
