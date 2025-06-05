CREATE TABLE "application_answer" (
	"id" text PRIMARY KEY NOT NULL,
	"application_id" text NOT NULL,
	"question_id" text NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_question" (
	"id" text PRIMARY KEY NOT NULL,
	"job_id" text NOT NULL,
	"question" text NOT NULL,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application_answer" ADD CONSTRAINT "application_answer_application_id_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_answer" ADD CONSTRAINT "application_answer_question_id_application_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."application_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_question" ADD CONSTRAINT "application_question_job_id_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job"("id") ON DELETE cascade ON UPDATE no action;