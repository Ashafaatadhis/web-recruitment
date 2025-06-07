// app/dashboard/applications/apply/[jobId]/page.tsx

import { notFound } from "next/navigation";
import ApplyJobClient from "./_components/apply-job-page";
import { getJobById } from "@/actions/job";

export default async function Page(props: { params: Promise<{ jobId: string }> }) {
  const params = await props.params;
  const job = await getJobById(params.jobId);
  if (!job) notFound();

  return <ApplyJobClient job={job} />;
}
