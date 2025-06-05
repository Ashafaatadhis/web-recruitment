import { getApplicationsWithJobs } from "@/actions/application";
import ApplicationsList from "./_components/application-list";

export default async function ApplicationsPage() {
  const applications = await getApplicationsWithJobs();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Applications</h1>
      </div>
      <ApplicationsList applications={applications} />
    </div>
  );
}
