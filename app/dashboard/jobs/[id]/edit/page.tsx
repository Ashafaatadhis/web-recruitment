import { getJobById } from "@/app/(landing)/browse-jobs/[id]/action";
import EditJobForm from "./_components/edit-job-form";
import { notFound } from "next/navigation";

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const jobData = await getJobById(params.id);
  if (!jobData) {
    return notFound();
  }

  return <EditJobForm job={jobData} />;
}
