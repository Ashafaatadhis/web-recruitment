"use server";

import { db } from "@/lib/db";
import { jobs, applicationQuestions } from "@/lib/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import { and, eq } from "drizzle-orm";

type UpdateJobInput = {
  title: string;
  description: any;
  requirements: any;
  location?: string;
  jobType: string;
  status: "open" | "closed" | "draft";
  questions?: { question: string }[];
};

export async function updateJob(jobId: string, data: UpdateJobInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Cek dulu apakah job dengan id ini milik user yang login
  const existingJob = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.postedById, session.user.id)))
    .limit(1)
    .execute();

  if (existingJob.length === 0)
    throw new Error("Job not found or unauthorized");

  // Update job
  await db
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

  // Hapus dulu semua pertanyaan lama untuk job ini
  await db
    .delete(applicationQuestions)
    .where(eq(applicationQuestions.jobId, jobId))
    .execute();

  console.log("questions", data.questions);
  // Insert pertanyaan baru jika ada
  if (data.questions && data.questions.length > 0) {
    await db.insert(applicationQuestions).values(
      data.questions.map((q, idx) => ({
        jobId: jobId,
        question: q.question,
        order: idx,
      }))
    );
  }

  // Revalidate halaman daftar job
  revalidatePath("/dashboard/jobs");
}
