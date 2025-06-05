"use server";

import { db } from "@/lib/db";
import {
  applicationAnswers,
  applications,
  applicationStatusHistories,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { applicationStatusEnum } from "@/lib/db/schema";
import { JobWithApplications } from "@/lib/types/models/job";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { CreateApplicationInput } from "@/lib/types/job";

export async function getApplicationsWithJobs(): Promise<
  JobWithApplications[]
> {
  const allJobs = await db.query.jobs.findMany({
    with: {
      applications: {
        with: {
          applicantUser: true,
        },
      },
    },
    orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
  });

  return allJobs;
}

export async function getApplicationDetails(id: string) {
  return await db.query.applications.findFirst({
    where: (app) => eq(app.id, id),
    with: {
      job: true,
      applicantUser: true,
      answers: {
        with: {
          question: true,
        },
      },
    },
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  status: (typeof applicationStatusEnum.enumValues)[number],
  notes: string
) {
  const session = await auth();
  const changedById = session?.user.id;
  await db
    .update(applications)
    .set({
      status,
      hrNotes: notes,
      updatedAt: new Date(),
    })
    .where(eq(applications.id, applicationId));

  await db.insert(applicationStatusHistories).values({
    applicationId,
    status,
    notes,
    changedAt: new Date(),
    changedById, // Add this field
  });
  revalidatePath(`/dashboard/applications/${applicationId}/review`);
}

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

export async function getMyApplicationDetails(id: string) {
  return await db.query.applications.findFirst({
    where: (app) => eq(app.id, id),
    with: {
      job: true,
      statusHistory: {
        orderBy: (history, { desc }) => [desc(history.changedAt)],
      },
    },
  });
}

export async function getMyApplications() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  return db.query.applications.findMany({
    where: eq(applications.applicantUserId, userId),
    with: {
      job: {
        columns: {
          title: true,
          location: true,
          jobType: true,
        },
        with: {
          postedBy: {
            columns: { name: true },
          },
        },
      },
    },
    orderBy: (apps, { desc }) => desc(apps.createdAt),
  });
}
