"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { applicationQuestions, jobs } from "@/lib/db/schema";
import { FetchJobsParams, GetAllJobParams, JobInput } from "@/lib/types/job";
import { JobWithRelations } from "@/lib/types/models/job";

import { and, count, desc, eq, ilike, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateJob(jobId: string, data: JobInput) {
  await db.transaction(async (tx) => {
    // Update job data
    await tx
      .update(jobs)
      .set({
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        location: data.location,
        jobType: data.jobType,
        status: data.status,
      })
      .where(eq(jobs.id, jobId))
      .execute();

    // Hapus semua pertanyaan lama
    await tx
      .delete(applicationQuestions)
      .where(eq(applicationQuestions.jobId, jobId))
      .execute();

    // Insert pertanyaan baru jika ada
    if (data.questions && data.questions.length > 0) {
      await tx.insert(applicationQuestions).values(
        data.questions.map((q, idx) => ({
          jobId: jobId,
          question: q.question,
          order: idx,
        }))
      );
    }
  });

  revalidatePath("/dashboard/jobs");
}
export async function createJob(data: JobInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.transaction(async (tx) => {
    // Insert job
    const [job] = await tx
      .insert(jobs)
      .values({
        title: data.title,
        description: JSON.stringify(data.description),
        requirements: JSON.stringify(data.requirements),
        location: data.location,
        jobType: data.jobType,
        status: data.status,
        postedById: session.user.id,
      })
      .returning();

    // Insert questions if any
    if (data.questions && data.questions.length > 0) {
      await tx.insert(applicationQuestions).values(
        data.questions.map((q, idx) => ({
          jobId: job.id,
          question: q.question,
          order: idx,
        }))
      );
    }
  });

  // Revalidate after transaction succeeds
  revalidatePath("/dashboard/jobs");
}

export async function deleteJob(jobId: string) {
  await db.delete(jobs).where(eq(jobs.id, jobId));
  revalidatePath("/dashboard/jobs");
}

export async function getAllJobs({
  limit = 10,
  page = 1,
  type = "all",
  status = "all",
  search = "",
}: GetAllJobParams = {}) {
  const offset = (page - 1) * limit;

  // Filter kondisi
  const filters = [];

  if (type !== "all") {
    filters.push(eq(jobs.jobType, type));
  }

  if (status !== "all") {
    filters.push(eq(jobs.status, status));
  }

  if (search.trim()) {
    filters.push(
      or(ilike(jobs.title, `%${search}%`), ilike(jobs.location, `%${search}%`))
    );
  }

  const data = await db
    .select()
    .from(jobs)
    .where(and(...filters))
    .orderBy(desc(jobs.createdAt))
    .limit(limit)
    .offset(offset);

  const total = await db
    .select({ count: count() })
    .from(jobs)
    .where(and(...filters));

  return {
    jobs: data,
    total,
    page,
    totalPages: Math.ceil(Number(total[0].count) / limit),
  };
}

export async function fetchJobs(params: FetchJobsParams) {
  const { searchQuery, location, jobType } = params;
  const resolvedJobType = jobType || "all";

  const whereClauses = [];

  if (searchQuery && searchQuery.trim() !== "") {
    whereClauses.push(ilike(jobs.title, `%${searchQuery}%`));
  }

  if (location && location.trim() !== "") {
    whereClauses.push(ilike(jobs.location, `%${location}%`));
  }

  if (resolvedJobType !== "all") {
    whereClauses.push(eq(jobs.jobType, resolvedJobType));
  }

  // Only show jobs with status 'open'
  whereClauses.push(eq(jobs.status, "open"));

  const results = await db
    .select()
    .from(jobs)
    .where(whereClauses.length > 0 ? and(...whereClauses) : undefined)
    .orderBy(jobs.createdAt);

  return results;
}

export async function getJobById(
  id: string
): Promise<JobWithRelations | undefined> {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
    with: {
      postedBy: { columns: { name: true } },
      questions: { columns: { question: true, id: true } },
    },
  });

  return job;
}
