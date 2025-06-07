// components/job-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { DeleteJobButton } from "../_components/delete-job-button";
import CanWrapper from "@/components/can";
import { Job } from "@/lib/types/models/job";
import { Eye, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function JobTable({
  jobs,
  page,
  limit,
}: {
  jobs: Job[];
  page: number;
  limit: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-center w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job, index) => (
          <TableRow key={job.id}>
            <TableCell>{(page - 1) * limit + index + 1}</TableCell>

            <TableCell>{job.title}</TableCell>
            <TableCell className="capitalize">{job.jobType}</TableCell>
            <TableCell>{job.location}</TableCell>
            <TableCell>
              <Badge
                variant={
                  job.status === "draft"
                    ? "secondary"
                    : job.status === "open"
                    ? "default"
                    : "destructive"
                }
              >
                {job.status}
              </Badge>
            </TableCell>
            <TableCell>{format(new Date(job.createdAt), "PP")}</TableCell>
            <TableCell className="flex justify-center gap-2">
              <CanWrapper I="read" a="Job">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center justify-center"
                      aria-label="View Job"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>View Job</TooltipContent>
                </Tooltip>
              </CanWrapper>

              <CanWrapper I="update" a="Job">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/dashboard/jobs/${job.id}/edit`}
                      className="text-yellow-600 hover:text-yellow-800 inline-flex items-center justify-center"
                      aria-label="Edit Job"
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Edit Job</TooltipContent>
                </Tooltip>
              </CanWrapper>

              <CanWrapper I="delete" a="Job">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DeleteJobButton jobId={job.id} />
                  </TooltipTrigger>
                  <TooltipContent>Delete Job</TooltipContent>
                </Tooltip>
              </CanWrapper>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
