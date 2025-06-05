import { LimitSelector } from "@/components/limit-selector";

import { getAllUser } from "@/actions/user/user";
import User from "./_components/user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string };
}) {
  const page = parseInt(searchParams?.page || "1", 10);
  const limit = parseInt(searchParams?.limit || "10", 10);
  const { users, totalPages, total } = await getAllUser({ page, limit });

  return (
    <div className="container mx-auto py-6">
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
      <LimitSelector />

      <div className="rounded-md border">
        <User
          totalPages={totalPages}
          total={total[0].count}
          users={users}
          page={page}
          limit={limit}
        />
      </div>
    </div>
  );
}
