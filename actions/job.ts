"use server";

import { db } from "@/lib/db";
import { applicationQuestions, jobs } from "@/lib/db/schema";
import { UpdateJobInput } from "@/lib/types/job";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateJob(jobId: string, data: UpdateJobInput) {
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

  // Revalidate path setelah semua transaksi sukses
  revalidatePath("/dashboard/jobs");
}
