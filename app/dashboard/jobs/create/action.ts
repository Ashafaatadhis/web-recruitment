"use server";

import { db } from "@/lib/db";
import { jobs, applicationQuestions } from "@/lib/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

type CreateJobInput = {
  title: string;
  description: any;
  requirements: any;
  location?: string;
  jobType: string;
  status: string;
  questions?: { question: string }[];
};

export async function createJob(data: CreateJobInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Insert job
  const [job] = await db
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
    await db.insert(applicationQuestions).values(
      data.questions.map((q, idx) => ({
        jobId: job.id,
        question: q.question,
        order: idx,
      }))
    );
  }

  // Optionally revalidate the jobs list page
  revalidatePath("/dashboard/jobs");
}
