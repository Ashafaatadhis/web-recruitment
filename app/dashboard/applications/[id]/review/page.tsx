import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import Link from "next/link";

import { ApplicationForm } from "./_components/application-form";

import { getApplicationDetails } from "@/actions/application";

export default async function ApplicationReviewPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const application = await getApplicationDetails(params.id);

  if (!application) {
    notFound();
  }

  // TypeScript now knows application is defined after this point
  const { id, status, hrNotes, applicantUser, job } = application;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ApplicationForm id={id} status={status} hrNotes={hrNotes ?? ""} />
        </CardContent>
      </Card>

      {/* Applicant Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Applicant Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p>{applicantUser?.name || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{applicantUser?.email || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{applicantUser?.phoneNumber || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Applied Position</p>
            <p>{job?.title || "Not specified"}</p>
          </div>
          {application?.resumeUrl && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Resume</p>
              <Button asChild variant="link" className="p-0">
                <Link href={application.resumeUrl} target="_blank">
                  View Resume
                </Link>
              </Button>
            </div>
          )}
          {application?.coverLetter && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground font-medium mb-2">
                Cover Letter
              </p>
              <div className="whitespace-pre-wrap rounded-md border border-muted p-4 text-sm">
                {application.coverLetter}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {application.answers && application.answers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Application Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {application.answers.map((qa, idx) => (
              <div
                key={idx}
                className="border-b last:border-b-0 pb-4 last:pb-0"
              >
                <p className="text-sm font-medium">{qa.question.question}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                  {qa.answer || "Not answered"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
