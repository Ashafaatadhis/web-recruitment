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
import { Eye, Pencil, Trash } from "lucide-react";

import { deleteUser } from "@/actions/user/user";
import Link from "next/link";
import type { User } from "@/lib/types/models/user";

interface Props {
  users: User[];
  page: number;
  limit: number;
}

export default function User({ users, page, limit }: Props) {
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
          {users.length > 0 ? (
            users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-center flex items-center justify-center gap-2">
                  {/* Tombol View */}
                  <Link
                    href={`/dashboard/users/${user.id}`}
                    aria-label={`Lihat detail user ${user.username}`}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center justify-center"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>

                  {/* Tombol Edit */}
                  <Link
                    href={`/dashboard/users/${user.id}/edit`}
                    aria-label={`Edit user ${user.username}`}
                    className="text-yellow-600 hover:text-yellow-800 inline-flex items-center justify-center"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>

                  {/* Tombol Delete */}
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setOpen(true);
                    }}
                    aria-label={`Delete user ${user.username}`}
                    className="text-red-600 hover:text-red-800 inline-flex items-center justify-center"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
