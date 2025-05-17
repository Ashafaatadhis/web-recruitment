"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Upload,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  submitVerification,
  getVerificationStatus,
} from "./verification-actions";
import { VerificationStatusResponse } from "@/types/verification-types";

// Add schema definition
const formSchema = z.object({
  file: z
    .custom<File>()
    .refine((file) => file instanceof File, "File is required")
    .refine((file) => file && file.type === "application/pdf", "Must be PDF")
    .refine((file) => file && file.size <= 5 * 1024 * 1024, "Max size 5MB"),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface VerificationSubmissionProps {
  userId?: string;
}

export function VerificationSubmission({
  userId,
}: VerificationSubmissionProps) {
  const [notes, setNotes] = useState("");

  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatusResponse>({ status: "none" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadVerificationStatus();
    }
  }, [userId]);

  const loadVerificationStatus = async () => {
    setIsLoading(true);
    try {
      const status = await getVerificationStatus(userId as string);
      setVerificationStatus(status);
    } catch (error) {
      console.error("Failed to load verification status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  // Replace handleSubmit function
  const onSubmit = async (data: FormValues) => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", data.file);

      // ... rest of existing upload logic remains the same
      // Update submitVerification call:
      // Upload file
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }
      const uploadData = await uploadResponse.json();

      const result = await submitVerification({
        userId,
        documentUrl: uploadData.url,
        notes: data.notes || "",
      });

      if (result.success) {
        toast.success("Verification request submitted successfully");
        loadVerificationStatus();
      } else {
        toast.error(result.message || "Failed to submit verification request");
      }
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error("Failed to submit verification request");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (verificationStatus.status === "approved") {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">
          Verification Approved
        </AlertTitle>
        <AlertDescription className="text-green-700">
          Your recruiter account has been verified. You can now post jobs and
          access all recruiter features.
        </AlertDescription>
      </Alert>
    );
  }

  if (verificationStatus.status === "pending") {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Pending</AlertTitle>
          <AlertDescription>
            Your verification request has been submitted and is currently under
            review. We'll notify you once the review is complete.
          </AlertDescription>
        </Alert>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Submitted Document:</span>
            <a
              href={verificationStatus.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View Document
            </a>
          </div>

          {verificationStatus.submissionNotes && (
            <div className="mt-2">
              <Label className="text-sm font-medium">Your Notes:</Label>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                {verificationStatus.submissionNotes}
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            Submitted on{" "}
            {new Date(
              verificationStatus.submittedAt as Date
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus.status === "rejected") {
    return (
      <div className="space-y-4">
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">
            Verification Rejected
          </AlertTitle>
          <AlertDescription className="text-red-700">
            Your verification request has been rejected. Please review the
            feedback below and submit a new request.
          </AlertDescription>
        </Alert>

        {verificationStatus.adminReviewNotes && (
          <div className="mt-2">
            <Label className="text-sm font-medium">Admin Feedback:</Label>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
              {verificationStatus.adminReviewNotes}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="document">Upload Verification Document (PDF)</Label>
            <Input
              id="document"
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (!selectedFile) return;

                if (selectedFile.type !== "application/pdf") {
                  toast.error("Please upload a PDF file");
                  // Clear the input
                  e.target.value = "";
                  form.resetField("file");

                  return;
                }

                if (selectedFile.size > 5 * 1024 * 1024) {
                  toast.error("File size should be less than 5MB");
                  e.target.value = "";
                  form.resetField("file");

                  return;
                }

                // Set the file to react-hook-form state
                form.setValue("file", selectedFile, { shouldValidate: true });
              }}
              disabled={isSubmitting}
            />
            {form.formState.errors.file && (
              <p className="text-sm text-red-500">
                {form.formState.errors.file.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Please upload a document that verifies your identity and company
              affiliation (max 5MB).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Provide any additional information about your verification request..."
              {...register("notes")}
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit New Verification Request
              </>
            )}
          </Button>
        </form>
      </div>
    );
  }

  // Default: No verification request submitted yet
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        <p>
          To become a verified recruiter, please submit a document that verifies
          your identity and company affiliation. This helps us maintain a
          trusted platform for all users.
        </p>
        <p className="mt-2">
          Verified recruiters receive a verification badge and gain access to
          additional features.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, (e) => {
          console.log(e, "taikk");
        })}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="document">Upload Verification Document (PDF)</Label>
          <Input
            id="document"
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (!selectedFile) return;

              if (selectedFile.type !== "application/pdf") {
                toast.error("Please upload a PDF file");
                // Clear the input
                e.target.value = "";
                form.resetField("file");

                return;
              }

              if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                e.target.value = "";
                form.resetField("file");

                return;
              }

              // Set the file to react-hook-form state
              form.setValue("file", selectedFile, { shouldValidate: true });
            }}
            disabled={isSubmitting}
          />
          {form.formState.errors.file && (
            <p className="text-sm text-red-500">
              {form.formState.errors.file.message}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Please upload a document that verifies your identity and company
            affiliation (max 5MB).
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Provide any additional information about your verification request..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSubmitting}
            rows={4}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Submit Verification Request
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
