"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JobWithApplications } from "@/lib/types/models/job";

export default function ApplicationsList({
  applications,
}: {
  applications: JobWithApplications[];
}) {
  if (applications.length === 0) {
    return <p className="text-muted-foreground">No applications found.</p>;
  }

  return (
    <div className="space-y-6">
      {applications.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{job.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{job.jobType}</Badge>
                  <Badge variant="outline">{job.status}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {job.location}
                  </span>
                </div>
              </div>
              <Button asChild size="sm">
                <Link href={`/dashboard/jobs/${job.id}`}>View Job</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="applicants">
                <AccordionTrigger className="font-medium hover:no-underline">
                  Applicants ({job.applications.length})
                </AccordionTrigger>
                <AccordionContent>
                  {job.applications.length > 0 ? (
                    <div className="space-y-4 mt-2">
                      {job.applications.map((app) => (
                        <div key={app.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                <Link
                                  href={`/dashboard/candidates/${app.applicantUser?.id}`}
                                  className="hover:underline"
                                >
                                  {app.applicantUser?.name || "Anonymous"}
                                </Link>
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Applied on{" "}
                                {new Date(app.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary">{app.status}</Badge>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button
                              asChild
                              variant="link"
                              size="sm"
                              className="p-0"
                            >
                              <Link href={`/dashboard/applications/${app.id}`}>
                                View Details
                              </Link>
                            </Button>
                            <Button
                              asChild
                              variant="link"
                              size="sm"
                              className="p-0"
                            >
                              <Link
                                href={`/dashboard/applications/${app.id}/review`}
                              >
                                Review Application
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground pt-2">
                      No applicants yet
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
