"use server";

import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getJobById(id: string) {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
    with: {
      postedBy: {
        columns: { name: true },
      },
      questions: {
        columns: { question: true, id: true },
      },
    },
  });
  return job;
}
