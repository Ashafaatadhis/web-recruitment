import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getCandidateDetails(id: string) {
  return await db.query.users.findFirst({
    where: (user) => eq(user.id, id),
    with: {
      applications: {
        with: {
          job: true,
        },
      },
      skills: true,
      experiences: true, // Add this line
    },
  });
}

export async function getUniqueCandidates() {
  const allApplications = await db.query.applications.findMany({
    with: {
      applicantUser: true,
    },
  });

  return [
    ...new Map(
      allApplications.map((app) => [app.applicantUser?.id, app.applicantUser])
    ).values(),
  ].filter(Boolean);
}
