import { LimitSelector } from "@/components/limit-selector";

import { getAllUser } from "@/actions/user/user";
import User from "./_components/user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Pagination } from "@/components/pagination";

import { UserRole } from "@/lib/types/models/user";
import UsersFilterWrapper from "./_components/users-filter-wrapper";

export default async function UsersPage(
  props: {
    searchParams?: Promise<{
      page?: string;
      limit?: string;
      role?: UserRole | "all";
      search?: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page || "1", 10);
  const limit = parseInt(searchParams?.limit || "10", 10);
  const role = searchParams?.role || "all";
  const search = searchParams?.search || "";
  const { users, totalPages, total } = await getAllUser({
    page,
    limit,
    role,
    search,
  });

  return (
    <div className="container mx-auto py-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-muted-foreground">
            View, edit, and manage user accounts in the system
          </p>
        </div>
        <Button asChild>
          <Link href={"/dashboard/users/create"} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New User
          </Link>
        </Button>
      </div>
      {/* Render client component filter */}
      <UsersFilterWrapper />

      <LimitSelector />

      <div className="rounded-md border">
        <User users={users} page={page} limit={limit} />
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={total[0].count}
        limit={limit}
        basePath="/dashboard/users"
      />
    </div>
  );
}
