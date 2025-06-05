"use server";

import { applicationStatusEnum } from "@/lib/db/schema";
import { updateApplicationStatus } from "../../../action";
import { auth } from "@/auth";

export async function updateStatus(
  id: string,
  status: (typeof applicationStatusEnum.enumValues)[number],
  notes: string
) {
  const session = await auth();
  const changedById = session?.user?.id;

  if (!changedById) {
    throw new Error("User not authenticated");
  }

  await updateApplicationStatus(id, status, notes, changedById);
}
