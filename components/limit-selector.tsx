"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function LimitSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil limit sekarang dari URL, default 10
  const currentLimit = searchParams?.get("limit") || "10";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLimit = e.target.value;
    // reset ke page 1 tiap ganti limit
    const newSearchParams = new URLSearchParams(searchParams?.toString());

    newSearchParams.set("limit", newLimit);
    newSearchParams.set("page", "1");

    router.push(`?${newSearchParams.toString()}`);
  }

  return (
    <div className="mb-4">
      <label htmlFor="limit" className="mr-2 font-semibold">
        Items per page:
      </label>
      <select
        id="limit"
        value={currentLimit}
        onChange={onChange}
        className="border rounded px-2 py-1"
      >
        {[5, 10, 20, 50].map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
}
