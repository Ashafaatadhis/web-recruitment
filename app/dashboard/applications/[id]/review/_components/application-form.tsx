"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { applicationStatusEnum } from "@/lib/db/schema";
import Link from "next/link";

export function ApplicationForm({
  id,
  status,
  hrNotes,
  updateStatusAction, // Add this prop
}: {
  id: string;
  status: string;
  hrNotes?: string;
  updateStatusAction: (
    id: string,
    status: (typeof applicationStatusEnum.enumValues)[number],
    notes: string
  ) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newStatus = formData.get(
          "status"
        ) as (typeof applicationStatusEnum.enumValues)[number];
        const notes = formData.get("notes") as string;

        startTransition(async () => {
          try {
            await updateStatusAction(id, newStatus, notes);
            toast.success("Application status updated successfully");
          } catch (error) {
            toast.error("Failed to update application status");
            console.error("Update error:", error);
          } finally {
            router.refresh();
          }
        });
      }}
    >
      <div>
        <h3 className="font-medium mb-2">Application Status</h3>
        <Select name="status" defaultValue={status}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={status} />
          </SelectTrigger>
          <SelectContent>
            {applicationStatusEnum.enumValues.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-2">Review Notes</h3>
        <Textarea
          name="notes"
          placeholder="Add your evaluation notes..."
          defaultValue={hrNotes || ""}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/dashboard/applications">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
