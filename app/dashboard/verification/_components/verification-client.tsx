"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { fetchVerificationRequests } from "./actions";

import {
  VerificationRequest,
  VerificationStatus,
} from "@/types/verification-types";

import Link from "next/link";

export function VerificationClient() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<VerificationStatus>("pending");
  // Remove useRouter import and handler
  // import { useRouter } from "next/navigation";
  // const router = useRouter();

  // Update the card component in the map function
  {
    requests.map((request) => (
      <Link
        key={request.id}
        href={`/dashboard/verification/${request.id}`}
        className="hover:shadow-lg transition-shadow"
      >
        <Card className="cursor-pointer">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={request.recruiterUser.image || undefined} />
              <AvatarFallback>
                {request.recruiterUser.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-lg">
                {request.recruiterUser.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {request.recruiterUser.email}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <Badge
                variant={
                  request.status === "pending"
                    ? "secondary"
                    : request.status === "approved"
                    ? "default"
                    : "destructive"
                }
              >
                {request.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(request.submittedAt), "dd MMM yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    ));
  }
  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchVerificationRequests(activeTab);
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch verification requests:", error);
      toast.error("Failed to load verification requests");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Remove selectedRequest state
  // const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as VerificationStatus)}
      >
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request) => (
                <Link
                  key={request.id}
                  href={`/dashboard/verification/${request.id}`}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={request.recruiterUser.image || undefined}
                        />
                        <AvatarFallback>
                          {request.recruiterUser.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {request.recruiterUser.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {request.recruiterUser.email}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge
                          variant={
                            request.status === "pending"
                              ? "secondary"
                              : request.status === "approved"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {request.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(request.submittedAt), "dd MMM yyyy")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-2">
                  No {activeTab} verification requests found
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
