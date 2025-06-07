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

type UserFilterBarProps = {
  initialRole?: string;
  initialSearch?: string;
  onApply: (filters: { role: string; search: string }) => void;
};

export function UserFilterBar({
  initialRole = "all",
  initialSearch = "",
  onApply,
}: UserFilterBarProps) {
  const [role, setRole] = useState(initialRole);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    onApply({ role, search });
  }, [role, search, onApply]);

  return (
    <div className="flex items-center gap-4 mb-6 flex-wrap">
      {/* Role filter */}
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="applicant">Applicant</SelectItem>
          <SelectItem value="recruiter">Recruiter</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      {/* Search input */}
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name"
        className="border px-2 py-1 rounded flex-grow min-w-[200px]"
      />
    </div>
  );
}
