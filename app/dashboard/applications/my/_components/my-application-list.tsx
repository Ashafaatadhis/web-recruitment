"use client";

import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApplicationWithRelations } from "@/lib/types/models/application";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MyApplicationList({
  applications,
  page,
  limit,
}: {
  applications: ApplicationWithRelations[];
  page: number;
  limit: number;
}) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead className="text-center w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app, index) => (
            <TableRow key={app.id}>
              <TableCell>{(page - 1) * limit + index + 1}</TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/candidates/${app.applicantUser?.id}`}
                  className="hover:underline"
                >
                  {app.applicantUser?.name || "Anonymous"}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/jobs/${app.job?.id}`}
                  className="hover:underline"
                >
                  {app.job?.title || "Job Deleted"}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{app.status}</Badge>
              </TableCell>
              <TableCell>{format(new Date(app.createdAt), "PP")}</TableCell>
              <TableCell className="flex justify-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/dashboard/applications/my/${app.id}`}
                      className="text-primary" // langsung warna biru misalnya
                      aria-label="View details"
                    >
                      <Eye size={20} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Details</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
