import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import JobRichTextViewer from "@/components/job-rich-text-viewer";
import { getJobById } from "@/actions/job";

export default async function JobDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const job = await getJobById(params.id);

  if (!job) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-2xl font-semibold">Job not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{job.title}</CardTitle>
          <div className="flex gap-2 items-center mt-2">
            <Badge
              variant={
                job.status === "draft"
                  ? "secondary"
                  : job.status === "open"
                  ? "default"
                  : "destructive"
              }
            >
              {job.status}
            </Badge>
            <span className="text-sm text-muted-foreground">{job.jobType}</span>
            <span className="text-sm text-muted-foreground">
              {job.location}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Posted by {job.postedBy?.name || "Unknown"} on{" "}
            {format(new Date(job.createdAt), "PP")}
          </div>
        </CardHeader>
        <CardContent>
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
          <Button variant="default" asChild className="mt-4">
            <Link href={`/dashboard/applications/apply/${job.id}`}>
              Apply Now
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
