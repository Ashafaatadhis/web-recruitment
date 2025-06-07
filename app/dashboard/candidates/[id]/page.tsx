import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getCandidateDetails } from "@/actions/candidate";

export default async function CandidateDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const candidate = await getCandidateDetails(params.id);

  if (!candidate) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{candidate.name}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{candidate.role || "Candidate"}</Badge>
                <span className="text-sm text-muted-foreground">
                  {candidate.email}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Contact Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {candidate.phoneNumber || "Not provided"}
                </p>
                <p>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  {candidate.location || "Not specified"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Professional Links</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">LinkedIn:</span>{" "}
                  {candidate.linkedInProfile ? (
                    <Link href={candidate.linkedInProfile} target="_blank">
                      View Profile
                    </Link>
                  ) : (
                    "Not provided"
                  )}
                </p>
                <p>
                  <span className="text-muted-foreground">Portfolio:</span>{" "}
                  {candidate.portfolioUrl ? (
                    <Link href={candidate.portfolioUrl} target="_blank">
                      View Portfolio
                    </Link>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Skills & Experience</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills?.length ? (
                    candidate.skills.map((userSkill) => (
                      <Badge key={userSkill.id} variant="secondary">
                        {userSkill.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No skills listed</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Experience
                </h4>
                {candidate.experiences?.length ? (
                  <div className="space-y-4">
                    {candidate.experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="border-l-2 pl-4 border-primary"
                      >
                        <h5 className="font-medium">
                          {exp.position} at {exp.company}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {new Date(exp.startDate).toLocaleDateString()} -
                          {exp.isCurrent
                            ? "Present"
                            : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString()
                            : ""}
                        </p>
                        {exp.description && (
                          <p className="mt-2 text-sm whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No experience listed</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applications History</CardTitle>
        </CardHeader>
        <CardContent>
          {candidate.applications?.length ? (
            <div className="space-y-4">
              {candidate.applications.map((app) => (
                <div key={app.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{app.job?.title}</h4>
                    </div>
                    <Badge variant="outline">{app.status}</Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="text-muted-foreground">
                      Applied on{" "}
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No applications found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
