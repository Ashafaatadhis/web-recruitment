import { getMyApplications } from "@/actions/application";
import { applicationStatus } from "@/lib/types/models/application";
import MyApplicationList from "./_components/my-application-list";
import { Pagination } from "@/components/pagination";
import ApplicationsFilterWrapper from "../_components/applications-filter-wrapper";
import { LimitSelector } from "@/components/limit-selector";

export default async function MyApplicationsPage(props: {
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
  const { applications, total, totalPages } = await getMyApplications({
    limit,
    page,
    search,
    status,
  });

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">My Applications</h1>
      </div>

      <ApplicationsFilterWrapper route="/dashboard/applications/my" />
      <LimitSelector />

      <div className="rounded-md border">
        <MyApplicationList
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
