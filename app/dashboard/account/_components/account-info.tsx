"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) return null;

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
            <p className="text-sm text-muted-foreground">{session.user.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Account Type</p>
            <p className="text-sm text-muted-foreground">
              {session.user.role || "Standard"}
            </p>
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
