// For union type approach (what you're suggesting):
export type VerificationStatus = "pending" | "approved" | "rejected" | "none";

// Then update the VerificationRequest type:
export type VerificationRequest = {
  id: string;
  recruiterUserId: string;
  documentUrl: string;
  submissionNotes: string | null;
  status: VerificationStatus;
  submittedAt: Date;
  reviewedAt: Date | null;
  recruiterUser: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

export type VerificationStatusResponse = {
  status: VerificationStatus;
  documentUrl?: string;
  submissionNotes?: string | null;
  adminReviewNotes?: string | null;
  submittedAt?: Date;
  reviewedAt?: Date | null;
};
