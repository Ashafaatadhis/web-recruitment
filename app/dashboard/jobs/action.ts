"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function deleteJob(jobId: string) {
  // First check if the job belongs to the user

  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const job = await db.query.jobs.findFirst({
    where: (jobs, { and, eq }) =>
      and(eq(jobs.id, jobId), eq(jobs.postedById, session.user.id)),
  });

  if (!job) {
    throw new Error("Job not found or you don't have permission to delete it");
  }

  await db.delete(jobs).where(eq(jobs.id, jobId));
}

export async function getAllJobs() {
  try {
    const allJobs = await db.query.jobs.findMany({
      orderBy: (jobs) => jobs.createdAt,
    });

    return allJobs;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    throw new Error("Failed to retrieve job listings");
  }
}
