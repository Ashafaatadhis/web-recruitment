import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  fetchVerificationRequestsById,
  updateVerificationStatus,
} from "../_components/actions";
import { Textarea } from "@/components/ui/textarea";
import { VerificationStatus } from "@/types/verification-types";

export default async function VerificationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const [request] = await fetchVerificationRequestsById(params.id);

  if (!request) {
    redirect("/dashboard/verification");
  }

  const isPending = request.status === "pending";

  const handleSubmit = async (formData: FormData) => {
    "use server";
    const status = formData.get("status") as VerificationStatus;
    const notes = formData.get("notes") as string;
    await updateVerificationStatus(params.id, status, notes);
    redirect("/dashboard/verification");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Verification Details</h1>
          <p className="text-muted-foreground">
            View detailed information about this verification submission
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/verification">Back to List</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.recruiterUser.image || undefined} />
              <AvatarFallback>
                {request.recruiterUser.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{request.recruiterUser.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {request.recruiterUser.email}
              </p>
            </div>
          </div>
          <Badge
            variant={
              request.status === "pending"
                ? "secondary"
                : request.status === "approved"
                ? "default"
                : "destructive"
            }
          >
            {request.status}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Submitted At</p>
              <p className="text-sm">
                {format(new Date(request.submittedAt), "PPp")}
              </p>
            </div>

            {request.reviewedAt && (
              <div>
                <p className="text-sm font-medium">Reviewed At</p>
                <p className="text-sm">
                  {format(new Date(request.reviewedAt), "PPp")}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium">Document</p>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link
                href={request.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Verification Document
              </Link>
            </Button>
          </div>

          {request.submissionNotes && (
            <div>
              <p className="text-sm font-medium">Applicant Notes</p>
              <p className="text-sm whitespace-pre-wrap">
                {request.submissionNotes}
              </p>
            </div>
          )}

          {isPending && (
            <form action={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Admin Notes</p>
                <Textarea
                  name="notes"
                  placeholder="Add review notes..."
                  className="resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="submit"
                  variant="destructive"
                  name="status"
                  value="rejected"
                >
                  Reject
                </Button>
                <Button type="submit" name="status" value="approved">
                  Approve
                </Button>
              </div>
            </form>
          )}

          {request.adminReviewNotes && (
            <div>
              <p className="text-sm font-medium">Admin Review Notes</p>
              <p className="text-sm whitespace-pre-wrap">
                {request.adminReviewNotes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
