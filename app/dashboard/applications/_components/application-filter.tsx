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
import { APPLICATION_STATUS_VALUES } from "@/lib/constants";

type ApplicationFilterProps = {
  initialStatus?: string;
  initialSearch?: string;
  onApply: (filters: { status: string; search: string }) => void;
};

export function ApplicationsFilter({
  initialStatus = "all",
  initialSearch = "",
  onApply,
}: ApplicationFilterProps) {
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    onApply({ status, search });
  }, [status, search, onApply]);

  return (
    <div className="flex items-center gap-4 mb-6 flex-wrap">
      {/* Role filter */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {APPLICATION_STATUS_VALUES.map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search input */}
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by job title or name applicant"
        className="border px-2 py-1 rounded flex-grow min-w-[200px]"
      />
    </div>
  );
}
