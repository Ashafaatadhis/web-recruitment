// app/dashboard/applications/apply/[jobId]/page.tsx

import { notFound } from "next/navigation";
import ApplyJobClient from "./_components/apply-job-page";
import { getJobById } from "@/actions/job";
import { checkIfUserAppliedToJob } from "@/actions/application";
import AlreadyApplied from "./_components/already-applied";

export default async function Page(props: {
  params: Promise<{ jobId: string }>;
}) {
  const params = await props.params;
  const job = await getJobById(params.jobId);
  const application = await checkIfUserAppliedToJob(params.jobId);
  console.log("Application:", application);
  if (!job) notFound();

  if (application) {
    return <AlreadyApplied job={job} application={application} />;
  }

  return <ApplyJobClient job={job} />;
}
