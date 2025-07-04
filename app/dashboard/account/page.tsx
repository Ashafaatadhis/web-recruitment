import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProfileClient } from "./_components/profile-client";
import { AccountInfo } from "./_components/account-info";
import { auth } from "@/auth";

import { getUserById } from "@/actions/user/user";
import { unauthorized } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }
  const user = await getUserById(session.user.id);
  if (!user) {
    return unauthorized();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>

          {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProfileClient user={user} />
            </CardContent>
          </Card>

          <AccountInfo user={session?.user} />
        </TabsContent>

        {/* <TabsContent value="documents" className="space-y-4">
          <MyDocuments user={session?.user!} />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
