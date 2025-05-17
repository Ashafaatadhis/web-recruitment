"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { fetchVerificationRequests, updateVerificationStatus } from "./actions";
import { VerificationDetail } from "./verification-detail";
import {
  VerificationRequest,
  VerificationStatus,
} from "@/types/verification-types";

export function VerificationClient() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<VerificationRequest | null>(null);
  const [activeTab, setActiveTab] = useState<VerificationStatus>("pending");

  useEffect(() => {
    loadRequests();
  }, [activeTab]);

  const loadRequests = async () => {
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
  };

  const handleStatusUpdate = async (
    id: string,
    status: VerificationStatus,
    notes?: string
  ) => {
    try {
      await updateVerificationStatus(id, status, notes);
      toast.success(
        `Request ${
          status === "approved" ? "approved" : "rejected"
        } successfully`
      );
      loadRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to update verification status:", error);
      toast.error("Failed to update verification status");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="pending"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as VerificationStatus)}
      >
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="space-y-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card
                    key={request.id}
                    className={`cursor-pointer hover:border-primary transition-colors ${
                      selectedRequest?.id === request.id ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={request.recruiterUser.image || undefined}
                        />
                        <AvatarFallback>
                          {request.recruiterUser.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {request.recruiterUser.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {request.recruiterUser.email}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Submitted{" "}
                          {format(new Date(request.submittedAt), "PPP")}
                        </p>
                        // In the TabsList section:
                        <TabsList>
                          <TabsTrigger value={"pending"}>Pending</TabsTrigger>
                          <TabsTrigger value={"approved"}>Approved</TabsTrigger>
                          <TabsTrigger value={"rejected"}>Rejected</TabsTrigger>
                        </TabsList>
                        // In the Badge component:
                        <Badge
                          variant={
                            request.status === "pending"
                              ? "outline"
                              : request.status === "approved"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                {selectedRequest ? (
                  <VerificationDetail
                    request={selectedRequest}
                    onApprove={(notes) =>
                      handleStatusUpdate(selectedRequest.id, "approved", notes)
                    }
                    onReject={(notes) =>
                      handleStatusUpdate(selectedRequest.id, "rejected", notes)
                    }
                    onClose={() => setSelectedRequest(null)}
                    readOnly={activeTab !== "pending"}
                  />
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <p className="text-muted-foreground mb-2">
                        Select a request to view details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
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
