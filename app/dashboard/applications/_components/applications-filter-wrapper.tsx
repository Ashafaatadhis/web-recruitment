"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ApplicationsFilter } from "./application-filter";

export default function ApplicationsFilterWrapper({
  route,
}: {
  route: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    status: searchParams?.get("status") || "all",
    search: searchParams?.get("search") || "",
  });

  const handleApply = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);

      const params = new URLSearchParams();

      if (newFilters.status && newFilters.status !== "all") {
        params.set("status", newFilters.status);
      }
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      params.set("page", "1"); // reset ke halaman 1 kalau filter baru

      router.push(`${route}?${params.toString()}`);
    },
    [router] // pastikan router masuk dependency
  );

  return (
    <ApplicationsFilter
      initialStatus={filters.status}
      initialSearch={filters.search}
      onApply={handleApply}
    />
  );
}
