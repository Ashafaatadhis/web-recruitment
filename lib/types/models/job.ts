import {
  applicationQuestions,
  applications,
  jobs,
  jobStatusEnum,
  jobTypeEnum,
} from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { User } from "./user";

export type Job = InferSelectModel<typeof jobs>;
export type Application = InferSelectModel<typeof applications>;

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

export type jobStatus = (typeof jobStatusEnum.enumValues)[number];
export type jobType = (typeof jobTypeEnum.enumValues)[number];
