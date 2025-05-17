"use server";

import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { and, eq, like, or } from "drizzle-orm";

interface FetchJobsParams {
  searchQuery?: string;
  location?: string;
  jobType?: string;
}

export async function fetchJobs({
  searchQuery = "",
  location = "",
  jobType = "",
}: FetchJobsParams) {
  try {
    const conditions: (
      | ReturnType<typeof eq>
      | ReturnType<typeof or>
      | ReturnType<typeof like>
    )[] = [eq(jobs.status, "published")];

    if (searchQuery?.trim()) {
      conditions.push(
        or(
          like(jobs.title, `%${searchQuery}%`),
          like(jobs.description, `%${searchQuery}%`)
        )
      );
    }

    if (location) {
      conditions.push(eq(jobs.location, location));
    }

    if (jobType) {
      conditions.push(eq(jobs.jobType, jobType));
    }

    const query = db
      .select()
      .from(jobs)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0]) // 👈 ini penting!
      .orderBy(jobs.createdAt);

    const results = await query;
    return results;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}
