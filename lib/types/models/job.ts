import {
  applicationQuestions,
  applications,
  jobs,
  users,
} from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Job = InferSelectModel<typeof jobs>;
export type Application = InferSelectModel<typeof applications>;
export type User = InferSelectModel<typeof users>;
type Question = InferSelectModel<typeof applicationQuestions>;

export type JobWithApplications = Job & {
  applications: (Application & {
    applicantUser: User | null;
  })[];
};

export type JobWithRelations = Job & {
  postedBy: Pick<User, "name"> | null;
  questions: Pick<Question, "id" | "question">[];
};
