CREATE TYPE "public"."job_status_enum" AS ENUM('draft', 'open', 'closed');--> statement-breakpoint
ALTER TABLE "job" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."job_status_enum";--> statement-breakpoint
ALTER TABLE "job" ALTER COLUMN "status" SET DATA TYPE "public"."job_status_enum" USING "status"::"public"."job_status_enum";