"use server";

import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { and, eq, ilike } from "drizzle-orm";

type FetchJobsParams = {
  searchQuery?: string;
  location?: string;
  jobType?: string;
};

export async function fetchJobs(params: FetchJobsParams) {
  const { searchQuery, location, jobType } = params;

  // Build dynamic where clause
  const whereClauses = [];

  if (searchQuery && searchQuery.trim() !== "") {
    whereClauses.push(ilike(jobs.title, `%${searchQuery}%`));
  }

  if (location && location.trim() !== "") {
    whereClauses.push(ilike(jobs.location, `%${location}%`));
  }

  if (jobType && jobType.trim() !== "") {
    whereClauses.push(eq(jobs.jobType, jobType));
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
