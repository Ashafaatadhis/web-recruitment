import { relations } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  unique, // Make sure 'unique' is imported
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(), // Ensure email is unique for login
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  username: text("username").unique(),
  password: text("password"),
  role: text("role").default("applicant").notNull(), // 'applicant', 'recruiter', 'admin'
  isRecruiterVerified: boolean("is_recruiter_verified")
    .default(false)
    .notNull(), // New field for recruiter verification
  // Add a field to store the verification token
  verificationToken: text("verification_token"), // New field for storing the verification token
  // Applicant specific fields (can be null if user is not an applicant)
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"), // Or this could be per application
  linkedInProfile: text("linkedin_profile"),
  portfolioUrl: text("portfolio_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()), // Added $onUpdate
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

// New tables for the recruitment system (and modified ones)

export const jobs = pgTable("job", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  location: text("location"),
  jobType: text("job_type"), // e.g., 'Full-time', 'Part-time', 'Contract'
  status: text("status").default("draft").notNull(), // e.g., 'draft', 'open', 'closed'
  postedById: text("posted_by_id").references(() => users.id, {
    onDelete: "set null",
  }), // HR user who posted it
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// The 'applicants' table is removed. Applicant data is now in the 'users' table.

export const applications = pgTable(
  "application",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    jobId: text("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    applicantUserId: text("applicant_user_id") // Renamed from applicantId
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // References users table
    applicationDate: timestamp("application_date").defaultNow().notNull(),
    status: text("status").default("Applied").notNull(), // e.g., 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Hired'
    // Specific application details, if resume/cover letter are per application
    // resumeUrl: text("resume_url"),
    // coverLetter: text("cover_letter"),
    hrNotes: text("hr_notes"), // Internal notes by HR
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (application) => [
    // Ensures an applicant (user) can apply to a job only once
    unique("unique_job_applicant_user_application").on(
      application.jobId,
      application.applicantUserId
    ),
  ]
);

export const applicationStatusHistories = pgTable(
  "application_status_history",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    applicationId: text("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    status: text("status").notNull(), // The status it was changed to
    changedAt: timestamp("changed_at").defaultNow().notNull(),
    changedById: text("changed_by_id").references(() => users.id, {
      onDelete: "set null",
    }), // HR user who made the change
    notes: text("notes"), // Optional notes for this status change (e.g., interview feedback summary)
  }
);

// New table for recruiter verification submissions
export const recruiterVerificationSubmissions = pgTable(
  "recruiter_verification_submission",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    recruiterUserId: text("recruiter_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // User with 'recruiter' role
    documentUrl: text("document_url").notNull(), // URL of the uploaded verification document
    submissionNotes: text("submission_notes"), // Optional notes from the recruiter
    status: text("status").default("pending").notNull(), // 'pending', 'approved', 'rejected'
    adminReviewerId: text("admin_reviewer_id").references(() => users.id, {
      onDelete: "set null",
    }), // User with 'admin' role who reviewed
    adminReviewNotes: text("admin_review_notes"), // Optional notes from the admin
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    reviewedAt: timestamp("reviewed_at", { mode: "date" }),
  }
);

// Relations for the tables

// Original userRelations might need to be merged or replaced by usersRelationsExtended
// export const userRelations = relations(users, ({ many }) => ({
//   accounts: many(accounts),
// }));
// Using usersRelationsExtended instead

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const usersRelationsExtended = relations(users, ({ many }) => ({
  accounts: many(accounts),
  postedJobs: many(jobs, { relationName: "postedJobs" }),
  submittedApplications: many(applications, {
    relationName: "submittedApplications",
  }), // User's applications
  statusChangesMade: many(applicationStatusHistories, {
    relationName: "statusChangesMade",
  }),
  recruiterVerificationSubmissions: many(recruiterVerificationSubmissions, {
    relationName: "recruiterSubmissions",
  }), // Recruiter's submissions
  reviewedRecruiterSubmissions: many(recruiterVerificationSubmissions, {
    relationName: "adminReviewedSubmissions",
  }), // Admin's reviews
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  postedBy: one(users, {
    fields: [jobs.postedById],
    references: [users.id],
    relationName: "postedJobs",
  }),
  applications: many(applications),
}));

// applicantsRelations is removed

export const applicationsRelations = relations(
  applications,
  ({ one, many }) => ({
    job: one(jobs, {
      fields: [applications.jobId],
      references: [jobs.id],
    }),
    applicantUser: one(users, {
      // Renamed from applicant to applicantUser
      fields: [applications.applicantUserId], // Updated field name
      references: [users.id],
      relationName: "submittedApplications",
    }),
    statusHistory: many(applicationStatusHistories),
  })
);

export const applicationStatusHistoriesRelations = relations(
  applicationStatusHistories,
  ({ one }) => ({
    application: one(applications, {
      fields: [applicationStatusHistories.applicationId],
      references: [applications.id],
    }),
    changedBy: one(users, {
      fields: [applicationStatusHistories.changedById],
      references: [users.id],
      relationName: "statusChangesMade",
    }),
  })
);

// Relations for the new recruiter verification table
export const recruiterVerificationSubmissionsRelations = relations(
  recruiterVerificationSubmissions,
  ({ one }) => ({
    recruiterUser: one(users, {
      fields: [recruiterVerificationSubmissions.recruiterUserId],
      references: [users.id],
      relationName: "recruiterSubmissions",
    }),
    adminReviewer: one(users, {
      fields: [recruiterVerificationSubmissions.adminReviewerId],
      references: [users.id],
      relationName: "adminReviewedSubmissions",
    }),
  })
);
