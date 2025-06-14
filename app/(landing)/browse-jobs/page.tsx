// app/(jobs)/browse/page.tsx
import { fetchJobs, getAllJobs } from "@/actions/job";
import BrowseJobs from "./_components/browse-jobs";
import { jobType } from "@/lib/types/models/job";

export default async function BrowseJobsPage(props: {
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
    status: "open",
    search,
  });

  return (
    <BrowseJobs
      total={total[0].count}
      jobs={jobs}
      page={page}
      totalPages={totalPages}
      limit={limit}
    />
  );
}
