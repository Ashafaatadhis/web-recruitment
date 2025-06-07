import { applicationStatusEnum } from "@/lib/db/schema";
import { Application, Job } from "./job";
import { User } from "./user";

export type ApplicationWithRelations = Application & {
  job: Job;
  applicantUser: User | null;
};

export type applicationStatus =
  (typeof applicationStatusEnum.enumValues)[number];
