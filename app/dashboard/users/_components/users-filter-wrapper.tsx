"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { UserFilterBar } from "./user-filter-bar";

export default function UsersFilterWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    role: searchParams.get("role") || "all",
    search: searchParams.get("search") || "",
  });

  const handleApply = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);

      const params = new URLSearchParams();

      if (newFilters.role && newFilters.role !== "all") {
        params.set("role", newFilters.role);
      }
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      params.set("page", "1"); // reset ke halaman 1 kalau filter baru

      router.push(`/dashboard/users?${params.toString()}`);
    },
    [router] // pastikan router masuk dependency
  );

  return (
    <UserFilterBar
      initialRole={filters.role}
      initialSearch={filters.search}
      onApply={handleApply}
    />
  );
}
