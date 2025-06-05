import { db } from "@/lib/db";
import { applications, applicationStatusHistories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { applicationStatusEnum } from "@/lib/db/schema";

export async function getApplicationsWithJobs() {
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
  notes: string,
  changedById: string // Add this parameter
) {
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
}
