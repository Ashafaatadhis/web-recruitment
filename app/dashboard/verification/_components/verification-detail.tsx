"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { X, Check, ExternalLink } from "lucide-react";

type VerificationRequest = {
  id: string;
  recruiterUserId: string;
  documentUrl: string;
  submissionNotes: string | null;
  status: string;
  submittedAt: Date;
  reviewedAt: Date | null;
  recruiterUser: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

interface VerificationDetailProps {
  request: VerificationRequest;
  onApprove: (notes?: string) => void;
  onReject: (notes?: string) => void;
  onClose: () => void;
  readOnly?: boolean;
}

export function VerificationDetail({
  request,
  onApprove,
  onReject,
  onClose,
  readOnly = false,
}: VerificationDetailProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(adminNotes);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await onReject(adminNotes);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={request.recruiterUser.image || undefined} />
            <AvatarFallback>
              {request.recruiterUser.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{request.recruiterUser.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {request.recruiterUser.email}
            </p>
          </div>
        </div>
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-1">Submission Date</h3>
          <p className="text-sm">
            {format(new Date(request.submittedAt), "PPP pp")}
          </p>
        </div>

        {request.reviewedAt && (
          <div>
            <h3 className="text-sm font-medium mb-1">Review Date</h3>
            <p className="text-sm">
              {format(new Date(request.reviewedAt), "PPP pp")}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-1">Verification Document</h3>
          <a
            href={request.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            View Document <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>

        {request.submissionNotes && (
          <div>
            <h3 className="text-sm font-medium mb-1">Submission Notes</h3>
            <p className="text-sm whitespace-pre-wrap">
              {request.submissionNotes}
            </p>
          </div>
        )}

        {!readOnly && (
          <div>
            <h3 className="text-sm font-medium mb-1">Admin Review Notes</h3>
            <Textarea
              placeholder="Add your review notes here..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>

        {!readOnly && (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={handleApprove} disabled={isSubmitting}>
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
