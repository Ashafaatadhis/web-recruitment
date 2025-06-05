import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { getApplicationDetails } from "../../action";
import Link from "next/link";

import { ApplicationForm } from "./_components/application-form";
import { updateStatus } from "./_components/action";

export default async function ApplicationReviewPage({
  params,
}: {
  params: { id: string };
}) {
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
          <ApplicationForm
            id={id}
            status={status}
            hrNotes={hrNotes ?? ""}
            updateStatusAction={updateStatus}
          />
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
          {applicantUser?.resumeUrl && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Resume</p>
              <Button asChild variant="link" className="p-0">
                <Link href={applicantUser.resumeUrl} target="_blank">
                  View Resume
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
