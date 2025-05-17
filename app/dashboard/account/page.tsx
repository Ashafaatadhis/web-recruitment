import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { ProfileClient } from "./_components/profile-client";
import { AccountInfo } from "./_components/account-info";
import { auth } from "@/auth";
import { VerificationSubmission } from "./_components/verification-submission";

import CanWrapper from "@/components/can";

export default async function AccountPage() {
  const session = await auth();

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
          <TabsTrigger value="security">Security</TabsTrigger>
          <CanWrapper I="manage" a="Recruiter Verification">
            <TabsTrigger value="verification">
              Recruiter Verification
            </TabsTrigger>
          </CanWrapper>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
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
              <ProfileClient />
            </CardContent>
          </Card>

          <AccountInfo />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password or enable two-factor authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Password management is not available for accounts that sign in
                with Google.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Change password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <CanWrapper I="manage" a="Recruiter Verification">
          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recruiter Verification</CardTitle>
                <CardDescription>
                  Submit verification documents to become a verified recruiter.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VerificationSubmission userId={session?.user?.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </CanWrapper>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Manage your notification preferences and account settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Preference settings will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
