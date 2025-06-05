"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { User } from "next-auth";

export function AccountInfo({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          View details about your account status and membership.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Account ID</p>
            <p className="text-sm text-muted-foreground">{user.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Account Type</p>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Account Status</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-sm font-medium">Member Since</p>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
