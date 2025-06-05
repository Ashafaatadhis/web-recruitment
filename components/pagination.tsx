"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  basePath?: string;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  limit,
  basePath = "",
}: PaginationProps) {
  function getPageNumbers() {
    const delta = 1; // jangkauan halaman sebelum & sesudah current page

    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | null = null;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l !== null) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center space-y-3 mt-6">
      {/* Info data */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {startItem}–{endItem} dari {totalItems} data
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-4">
        {/* Prev button */}
        <Link
          href={`${basePath}?page=${page - 1}&limit=${limit}`}
          className={`flex items-center justify-center rounded-md border border-gray-300 p-2 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none ${
            page === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
          aria-disabled={page === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        {/* Page numbers kotak-kotak */}
        <div className="flex space-x-2">
          {pageNumbers.map((num, idx) =>
            typeof num === "string" ? (
              <span
                key={idx}
                className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-gray-500 select-none"
              >
                {num}
              </span>
            ) : (
              <Link
                key={idx}
                href={`${basePath}?page=${num}&limit=${limit}`}
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium ${
                  num === page
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                aria-current={num === page ? "page" : undefined}
              >
                {num}
              </Link>
            )
          )}
        </div>

        {/* Next button */}
        <Link
          href={`${basePath}?page=${page + 1}&limit=${limit}`}
          className={`flex items-center justify-center rounded-md border border-gray-300 p-2 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none ${
            page === totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
          aria-disabled={page === totalPages}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
