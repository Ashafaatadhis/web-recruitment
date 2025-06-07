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
export const userRoleEnum = pgEnum("user_role", [
  "applicant",
  "recruiter",
  "admin",
]);

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
  role: userRoleEnum("role").default("applicant").notNull(),
  isRecruiterVerified: boolean("is_recruiter_verified")
    .default(false)
    .notNull(), // New field for recruiter verification
  // Add a field to store the verification token
  verificationToken: text("verification_token"), // New field for storing the verification token
  // Applicant specific fields (can be null if user is not an applicant)
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  location: text("location"), // Add this line
  // resumeUrl: text("resume_url"),
  // coverLetter: text("cover_letter"), // Or this could be per application
  linkedInProfile: text("linkedin_profile"),
  portfolioUrl: text("portfolio_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()), // Added $onUpdate
  lastVerificationRequest: timestamp("last_verification_request"),
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
export const jobStatusEnum = pgEnum("job_status_enum", [
  "draft",
  "open",
  "closed",
]);
export const jobTypeEnum = pgEnum("job_type_enum", [
  "full-time",
  "part-time",
  "contract",
]);

// New tables for the recruitment system (and modified ones)

export const jobs = pgTable("job", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  location: text("location"),
  jobType: jobTypeEnum("job_type"),
  // status: text("status").default("draft").notNull(), // e.g., 'draft', 'open', 'closed'
  status: jobStatusEnum("status").default("draft").notNull(),
  postedById: text("posted_by_id").references(() => users.id, {
    onDelete: "set null",
  }), // HR user who posted it
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// The 'applicants' table is removed. Applicant data is now in the 'users' table.

// Add this near other enum definitions (at the top with other imports)
export const applicationStatusEnum = pgEnum("application_status", [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Hired",
]);

// Then modify the applications table definition
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
    status: applicationStatusEnum("status").default("Applied").notNull(), // e.g., 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Hired'
    // Specific application details, if resume/cover letter are per application
    resumeUrl: text("resume_url"),
    coverLetter: text("cover_letter"),
    hrNotes: text("hr_notes"), // Internal notes by HR
    createdAt: timestamp("created_at").defaultNow().notNull(),
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
// First add this enum definition at the top with other imports
import { pgEnum } from "drizzle-orm/pg-core";

// Add enum definition
export const verificationStatusEnum = pgEnum("verification_status", [
  "none",
  "pending",
  "approved",
  "rejected",
]);

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
    status: verificationStatusEnum("status").default("pending").notNull(), // 'pending', 'approved', 'rejected'
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

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  postedBy: one(users, {
    fields: [jobs.postedById],
    references: [users.id],
    relationName: "postedJobs",
  }),
  applications: many(applications),
  questions: many(applicationQuestions), // Add this line
}));

// applicantsRelations is removed

export const applicationsRelations = relations(
  applications,
  ({ one, many }) => ({
    job: one(jobs, {
      fields: [applications.jobId],
      references: [jobs.id],
    }),
    applicant: one(users, {
      fields: [applications.applicantUserId],
      references: [users.id],
      relationName: "userApplications",
    }),
    applicantUser: one(users, {
      // Add this duplicate relation with different name
      fields: [applications.applicantUserId],
      references: [users.id],
      relationName: "applicantUserRelation",
    }),
    statusHistory: many(applicationStatusHistories),
    answers: many(applicationAnswers),
  })
);

// Then update usersRelationsExtended to include both relations
export const usersRelationsExtended = relations(users, ({ many }) => ({
  accounts: many(accounts),
  postedJobs: many(jobs, { relationName: "postedJobs" }),
  applications: many(applications, { relationName: "userApplications" }),
  skills: many(skills),
  experiences: many(experiences), // Add this line

  applicantApplications: many(applications, {
    relationName: "applicantUserRelation",
  }), // Add this
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

// Table for storing questions for each job
export const applicationQuestions = pgTable("application_question", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  jobId: text("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  order: integer("order").default(0), // Optional: for ordering questions
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table for storing answers for each application/question
export const applicationAnswers = pgTable("application_answer", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  applicationId: text("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => applicationQuestions.id, { onDelete: "cascade" }),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Add relations for the new tables
export const applicationQuestionsRelations = relations(
  applicationQuestions,
  ({ one, many }) => ({
    job: one(jobs, {
      fields: [applicationQuestions.jobId],
      references: [jobs.id],
    }),
    answers: many(applicationAnswers),
  })
);

export const applicationAnswersRelations = relations(
  applicationAnswers,
  ({ one }) => ({
    application: one(applications, {
      fields: [applicationAnswers.applicationId],
      references: [applications.id],
    }),
    question: one(applicationQuestions, {
      fields: [applicationAnswers.questionId],
      references: [applicationQuestions.id],
    }),
  })
);

export const skills = pgTable("skill", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  userId: text("user_id") // Add this field
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
}));

export const experiences = pgTable("experience", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  company: text("company").notNull(),
  position: text("position").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isCurrent: boolean("is_current").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const experiencesRelations = relations(experiences, ({ one }) => ({
  user: one(users, {
    fields: [experiences.userId],
    references: [users.id],
  }),
}));
