"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { JOB_TYPE_VALUES } from "@/lib/constants";

type JobFilterProps = {
  initialType?: string;
  initialSearch?: string;
  onApply: (filters: { type: string; search: string }) => void;
};

export function JobsFilter({
  initialType = "all",
  initialSearch = "",
  onApply,
}: JobFilterProps) {
  const [type, setType] = useState(initialType);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    onApply({ type, search });
  }, [type, search, onApply]);

  return (
    <div className="flex items-center gap-4 mb-6 flex-wrap">
      {/* Role filter */}
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {JOB_TYPE_VALUES.map((type) => (
            <SelectItem key={type} value={type}>
              {type.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search input */}
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title or location"
        className="border px-2 py-1 rounded flex-grow min-w-[200px]"
      />
    </div>
  );
}
