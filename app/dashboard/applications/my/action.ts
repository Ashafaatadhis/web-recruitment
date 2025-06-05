"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
