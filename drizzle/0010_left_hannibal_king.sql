ALTER TABLE "user_skill" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_skill" CASCADE;--> statement-breakpoint
ALTER TABLE "skill" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "skill" ADD CONSTRAINT "skill_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;