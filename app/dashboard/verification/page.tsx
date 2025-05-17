import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { VerificationClient } from "./_components/verification-client";

export default async function VerificationPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Recruiter Verification Requests</h1>
        <p className="text-muted-foreground">
          Review and approve recruiter verification submissions
        </p>
      </div>

      <VerificationClient />
    </div>
  );
}
