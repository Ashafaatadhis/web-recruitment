"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from "./job-card";
import JobsFilterWrapper from "@/app/dashboard/jobs/_components/jobs-filter-wrapper";
import { Job } from "@/lib/types/models/job";
import { Pagination } from "@/components/pagination";
import { LimitSelector } from "@/components/limit-selector";

type Props = {
  jobs: Job[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
};

export default function BrowseJobs({
  jobs,
  page,
  totalPages,
  total,
  limit,
}: Props) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Jobs</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1">
          <JobsFilterWrapper url="/browse-jobs" />
          <LimitSelector />
        </div>

        <div className="md:col-span-3">
          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-2">No jobs found.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Optional reset handler if you plan to pass it later
                    window.location.reload();
                  }}
                >
                  Reload Page
                </Button>
              </CardContent>
            </Card>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={total}
            limit={limit}
            basePath="/dashboard/jobs"
          />
        </div>
      </div>
    </div>
  );
}
