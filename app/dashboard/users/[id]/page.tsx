import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getUserById } from "@/actions/user/user";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage(props: Props) {
  const params = await props.params;
  const user = await getUserById(params.id);
  if (!user) return notFound();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {/* Foto profil */}
            {user.image ? (
              <Image
                src={user.image}
                alt="User Profile"
                width={64}
                height={64}
                className="rounded-full aspect-square border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div>
              <CardTitle>{user.name || user.username}</CardTitle>
              <div className="flex gap-2 mt-1 text-sm">
                <Badge variant="outline">{user.role}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            {/* Data utama */}
            <div className="font-medium">Username:</div>
            <div>{user.username}</div>

            <div className="font-medium">Email:</div>
            <div>{user.email}</div>

            <div className="font-medium">Email Verified:</div>
            <div>
              {user.emailVerified
                ? new Date(user.emailVerified).toLocaleString()
                : "-"}
            </div>

            {/* Info pribadi */}
            <div className="font-medium">First Name:</div>
            <div>{user.firstName || "-"}</div>

            <div className="font-medium">Last Name:</div>
            <div>{user.lastName || "-"}</div>

            <div className="font-medium">Nomor HP:</div>
            <div>{user.phoneNumber || "-"}</div>

            <div className="font-medium">Lokasi:</div>
            <div>{user.location || "-"}</div>

            <div className="font-medium">LinkedIn:</div>
            <div>
              {user.linkedInProfile ? (
                <a
                  href={user.linkedInProfile}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {user.linkedInProfile}
                </a>
              ) : (
                "-"
              )}
            </div>

            <div className="font-medium">Portfolio:</div>
            <div>
              {user.portfolioUrl ? (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {user.portfolioUrl}
                </a>
              ) : (
                "-"
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/users">Kembali</Link>
            </Button>
            {/* Tombol edit bisa ditambahkan di sini */}
            {/* <Button>Edit</Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
