"use client";

import { useState, startTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import { Pagination } from "@/components/pagination";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import { deleteUser } from "@/actions/user/user";

export type User = InferSelectModel<typeof users>;

interface Props {
  users: User[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function User({ users, page, limit, total, totalPages }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  async function handleDelete() {
    if (!selectedUser) return;

    // jalankan server action dengan startTransition untuk UX smooth
    startTransition(() => {
      deleteUser(selectedUser.id).then(() => {
        setOpen(false);
      });
    });
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-center w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{(page - 1) * limit + index + 1}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-center">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setOpen(true);
                  }}
                  aria-label={`Delete user ${user.username}`}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="inline-block w-5 h-5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        limit={limit}
        basePath="/dashboard/users"
      />

      {/* Dialog konfirmasi delete */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus User</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus user &quot;
              {selectedUser?.username}&quot;? Tindakan ini tidak bisa
              dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
