import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { auth } from "@/auth";

import JobRichTextViewer from "@/components/job-rich-text-viewer";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, params.id),
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Link
        href="/browse-jobs"
        className="flex items-center text-muted-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to jobs
      </Link>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <div className="flex flex-wrap gap-3 mt-3">
                {job.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {job.location}
                  </div>
                )}
                {job.jobType && (
                  <div className="flex items-center text-muted-foreground">
                    <Briefcase className="mr-1 h-4 w-4" />
                    {job.jobType}
                  </div>
                )}
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  Posted {format(new Date(job.createdAt), "PPP")}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {job.jobType && <Badge>{job.jobType}</Badge>}
              <Badge variant="outline">{job.status}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {job.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <JobRichTextViewer serialized={job.description} />
            </div>
          )}

          {job.requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <JobRichTextViewer serialized={job.requirements} />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div>
            {job.updatedAt && (
              <p className="text-sm text-muted-foreground">
                Last updated: {format(new Date(job.updatedAt), "PPP")}
              </p>
            )}
          </div>

          {session?.user && session.user.role === "applicant" && (
            <Link href={`/apply/${job.id}`} passHref>
              <Button>Apply Now</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
