import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUniqueCandidates } from "@/actions/candidate";

export default async function CandidatesPage() {
  const candidates = await getUniqueCandidates();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Candidate Pool</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          {candidates.length > 0 ? (
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="border rounded-lg p-4">
                  <h4 className="font-medium">{candidate.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {candidate.email}
                  </p>
                  <Button asChild variant="link" size="sm" className="mt-2 p-0">
                    <Link href={`/dashboard/candidates/${candidate.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No candidates found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
