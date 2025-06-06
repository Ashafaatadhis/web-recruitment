import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";
import { getApplicationDetails } from "@/actions/application";

export default async function ApplicationDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const application = await getApplicationDetails(params.id);

  if (!application) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{application.job?.title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{application.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  Applied on {format(new Date(application.createdAt), "PP")}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p>
                  {`${application.applicantUser?.firstName || ""} ${
                    application.applicantUser?.lastName || ""
                  }`.trim() || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{application.applicantUser?.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>
                  {application.applicantUser?.phoneNumber || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LinkedIn</p>
                <p>
                  {application.applicantUser?.linkedInProfile || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Portfolio</p>
                <p>
                  {application.applicantUser?.portfolioUrl || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
