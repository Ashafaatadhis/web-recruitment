import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";
import Link from "next/link";
import { getMyApplications } from "@/actions/application";

export default async function MyApplicationsPage() {
  const applications = await getMyApplications();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      {applications.length === 0 ? (
        <p className="text-muted-foreground">
          You have not applied to any jobs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <Link key={app.id} href={`/dashboard/applications/my/${app.id}`}>
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle>{app.job?.title || "Job Title"}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge>{app.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {app.job?.location}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Applied on {format(new Date(app.createdAt), "PP")}
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-semibold">Type: </span>
                    {app.job?.jobType}
                  </div>
                  {app.hrNotes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-700">
                        HR Notes:
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {app.hrNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
