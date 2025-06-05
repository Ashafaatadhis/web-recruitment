// app/dashboard/applications/apply/[jobId]/page.tsx
import { getJobById } from "@/app/(landing)/browse-jobs/[id]/action";

import { notFound } from "next/navigation";
import ApplyJobClient from "./_components/apply-job-page";

export default async function Page({ params }: { params: { jobId: string } }) {
  const job = await getJobById(params.jobId);
  if (!job) notFound();

  return <ApplyJobClient job={job} />;
}
