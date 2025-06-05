import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAllJobs } from "./action";
import { format } from "date-fns";
import Link from "next/link";
import { deleteJob } from "./action"; // Make sure you have this action
import { DeleteJobButton } from "./_components/delete-job-button";
import CanWrapper from "@/components/can";

export default async function JobsPage() {
  const jobs = await getAllJobs();

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        <CanWrapper I="create" a="Job">
          <Button asChild>
            <Link href={"/dashboard/jobs/create"} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Job
            </Link>
          </Button>
        </CanWrapper>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input placeholder="Search jobs..." className="md:col-span-2" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="jakarta">Jakarta</SelectItem>
            <SelectItem value="bandung">Bandung</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {/* Updated from company to postedBy */}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Type:</span>
                  <span className="text-sm font-medium capitalize">
                    {job.jobType?.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Location:</span>
                  <span className="text-sm font-medium">{job.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
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
                </div>
                <div className="flex gap-2 mt-4">
                  <CanWrapper I="read" a="Job">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/jobs/${job.id}`}>View</Link>
                    </Button>
                  </CanWrapper>
                  <CanWrapper I="update" a="Job">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/dashboard/jobs/${job.id}/edit`}>Edit</Link>
                    </Button>
                  </CanWrapper>
                  <CanWrapper I="delete" a="Job">
                    <DeleteJobButton jobId={job.id} />
                  </CanWrapper>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Created {format(new Date(job.createdAt), "PP")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
