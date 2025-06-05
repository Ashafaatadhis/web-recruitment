"use server";

import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { applicationAnswers } from "@/lib/db/schema";

type CreateApplicationInput = {
  jobId: string;

  answers: { questionId: string; answer: string }[];
};

export async function createApplication(input: CreateApplicationInput) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check for existing application
  const existing = await db.query.applications.findFirst({
    where: (app) =>
      eq(app.jobId, input.jobId) && eq(app.applicantUserId, userId),
  });
  if (existing) {
    throw new Error("You have already applied for this job.");
  }

  // Create application
  const [application] = await db
    .insert(applications)
    .values({
      jobId: input.jobId,
      applicantUserId: userId,
    })
    .returning({ id: applications.id });
  console.log("TAITAIIATI", input.answers);
  // Save answers
  if (input.answers?.length > 0) {
    await db.insert(applicationAnswers).values(
      input.answers.map((answer) => ({
        applicationId: application.id,
        questionId: answer.questionId,
        answer: answer.answer,
      }))
    );
  }
}
