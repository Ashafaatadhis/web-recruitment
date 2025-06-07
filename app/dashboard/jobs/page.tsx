import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import Link from "next/link";

import CanWrapper from "@/components/can";
import { getAllJobs } from "@/actions/job";
import { JobTable } from "./_components/job-table";
import { jobType } from "@/lib/types/models/job";
import JobsFilterWrapper from "./_components/jobs-filter-wrapper";
import { LimitSelector } from "@/components/limit-selector";
import { Pagination } from "@/components/pagination";

export default async function JobsPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    type?: jobType | "all";
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page || "1", 10);
  const limit = parseInt(searchParams?.limit || "10", 10);
  const type = searchParams?.type || "all";
  const search = searchParams?.search || "";

  const { jobs, total, totalPages } = await getAllJobs({
    page,
    limit,
    type,
    search,
  });

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        <CanWrapper I="create" a="Job">
          <Button asChild>
            <Link href={"/dashboard/jobs/create"} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Job
            </Link>
          </Button>
        </CanWrapper>
      </div>

      {/* Render client component filter */}
      <JobsFilterWrapper />

      <LimitSelector />

      <div className="rounded-md border">
        <JobTable page={page} limit={limit} jobs={jobs} />
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={total[0].count}
        limit={limit}
        basePath="/dashboard/jobs"
      />
    </div>
  );
}
