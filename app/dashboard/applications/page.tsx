import { getApplicationsWithRelations } from "@/actions/application";
import ApplicationsList from "./_components/application-list";
import { jobType } from "@/lib/types/models/job";
import { applicationStatus } from "@/lib/types/models/application";
import { LimitSelector } from "@/components/limit-selector";
import { Pagination } from "@/components/pagination";
import ApplicationsFilterWrapper from "./_components/applications-filter-wrapper";

export default async function ApplicationsPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    status?: applicationStatus | "all";
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const page = parseInt(searchParams?.page || "1", 10);
  const limit = parseInt(searchParams?.limit || "10", 10);
  const status = searchParams?.status || "all";
  const search = searchParams?.search || "";

  const { applications, total, totalPages } =
    await getApplicationsWithRelations({
      limit,
      page,
      status,
      search,
    });

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Job Applications</h1>
      </div>

      <ApplicationsFilterWrapper />
      <LimitSelector />

      <div className="rounded-md border">
        <ApplicationsList
          limit={limit}
          page={page}
          applications={applications}
        />
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        limit={limit}
        basePath="/dashboard/applications"
      />
    </div>
  );
}
