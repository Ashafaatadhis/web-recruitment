import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { jobType } from "@/lib/types/models/job";

interface JobFiltersProps {
  onLocationChange: (location: string) => void;
  onJobTypeChange: (jobType: jobType | "all") => void;
}

export function JobFilters({
  onLocationChange,
  onJobTypeChange,
}: JobFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select
            onValueChange={(value) =>
              onLocationChange(value === "any" ? "" : value)
            }
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="Any location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any location</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Jakarta">Jakarta</SelectItem>
              <SelectItem value="Bandung">Bandung</SelectItem>
              <SelectItem value="Surabaya">Surabaya</SelectItem>
              <SelectItem value="Yogyakarta">Yogyakarta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-type">Job Type</Label>
          <Select
            onValueChange={(value) =>
              onJobTypeChange(
                value === "any"
                  ? "all"
                  : value.toLowerCase().replace("-", "") === "fulltime"
                  ? "full-time"
                  : value.toLowerCase().replace("-", "") === "parttime"
                  ? "part-time"
                  : (value.toLowerCase() as jobType)
              )
            }
          >
            <SelectTrigger id="job-type">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any type</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
