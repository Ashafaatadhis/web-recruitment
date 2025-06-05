import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import JobRichTextViewer from "@/components/job-rich-text-viewer";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    requirements: string | null;
    location: string | null;
    jobType: string | null;
    status: string;
    postedById: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  };
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{job.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {job.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {job.location}
            </div>
          )}
          {job.jobType && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="mr-1 h-4 w-4" />
              {job.jobType}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {job.description && <JobRichTextViewer serialized={job.description} />}
        <div className="flex flex-wrap gap-2 mt-4">
          {job.jobType && <Badge variant="outline">{job.jobType}</Badge>}
          {job.location && <Badge variant="outline">{job.location}</Badge>}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/browse-jobs/${job.id}`} passHref>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
