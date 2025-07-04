"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { JobsFilter } from "./jobs-filter";

export default function JobsFilterWrapper({ url }: { url?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "all",
    search: searchParams.get("search") || "",
  });
  const handleApply = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);

      const params = new URLSearchParams();

      if (newFilters.type && newFilters.type !== "all") {
        params.set("type", newFilters.type);
      }
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      params.set("page", "1"); // reset ke halaman 1 kalau filter baru

      router.push(`${url}?${params.toString()}`);
    },
    [router, url] // tambahkan 'url' di sini
  );

  return (
    <JobsFilter
      initialType={filters.type}
      initialSearch={filters.search}
      onApply={handleApply}
    />
  );
}
