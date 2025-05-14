CREATE TABLE "application_status_history" (
	"id" text PRIMARY KEY NOT NULL,
	"application_id" text NOT NULL,
	"status" text NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"changed_by_id" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "application" (
	"id" text PRIMARY KEY NOT NULL,
	"job_id" text NOT NULL,
	"applicant_user_id" text NOT NULL,
	"application_date" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'Applied' NOT NULL,
	"hr_notes" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_job_applicant_user_application" UNIQUE("job_id","applicant_user_id")
);
--> statement-breakpoint
CREATE TABLE "job" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"requirements" text,
	"location" text,
	"job_type" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"posted_by_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recruiter_verification_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"recruiter_user_id" text NOT NULL,
	"document_url" text NOT NULL,
	"submission_notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"admin_reviewer_id" text,
	"admin_review_notes" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'applicant' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_recruiter_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "resume_url" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "cover_letter" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "linkedin_profile" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "portfolio_url" text;--> statement-breakpoint
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_application_id_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_changed_by_id_user_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_job_id_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_applicant_user_id_user_id_fk" FOREIGN KEY ("applicant_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job" ADD CONSTRAINT "job_posted_by_id_user_id_fk" FOREIGN KEY ("posted_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruiter_verification_submission" ADD CONSTRAINT "recruiter_verification_submission_recruiter_user_id_user_id_fk" FOREIGN KEY ("recruiter_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruiter_verification_submission" ADD CONSTRAINT "recruiter_verification_submission_admin_reviewer_id_user_id_fk" FOREIGN KEY ("admin_reviewer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;