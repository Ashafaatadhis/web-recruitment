import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getMyApplicationDetails } from "@/actions/application";

export default async function MyApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await getMyApplicationDetails(params.id);

  if (!application) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      {/* Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{application.job?.title}</CardTitle>
          <div className="flex gap-2 items-center mt-2">
            <Badge variant="outline">{application.status}</Badge>
            <span className="text-sm text-muted-foreground">
              Applied on {format(new Date(application.createdAt), "PP")}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Job Type</p>
              <p>{application.job?.jobType || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p>{application.job?.location || "Not specified"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status History */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {application.statusHistory?.length ? (
            <div className="space-y-2">
              {application.statusHistory.map((history) => (
                <div key={history.id} className="border-l-2 pl-4 py-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{history.status}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(history.changedAt), "PPpp")}
                    </span>
                  </div>
                  {history.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {history.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No status history available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
