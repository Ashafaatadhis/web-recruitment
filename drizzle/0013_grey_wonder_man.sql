CREATE TYPE "public"."job_type_enum" AS ENUM('full-time', 'part-time', 'contract');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('applicant', 'recruiter', 'admin');--> statement-breakpoint
ALTER TABLE "job" ALTER COLUMN "job_type" SET DATA TYPE "public"."job_type_enum" USING "job_type"::"public"."job_type_enum";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'applicant'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "resume_url" text;--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "cover_letter" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "resume_url";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "cover_letter";