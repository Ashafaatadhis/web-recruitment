import { jobStatusEnum } from "../db/schema";
import { jobStatus, jobType } from "./models/job";

export type JobQuestion = {
  question: string;
  id: string;
};

export type JobWithQuestions = {
  id: string;
  title: string;
  questions: JobQuestion[];
};

export type CreateApplicationInput = {
  jobId: string;
  answers: { questionId: string; answer: string }[];
};

export type JobInput = {
  title: string;
  description: string;
  requirements: string;
  location?: string;
  jobType: jobType;
  status: jobStatus;
  questions?: { question: string }[];
};

export type FetchJobsParams = {
  searchQuery?: string;
  location?: string;
  jobType?: jobType | "all";
};

export type GetAllJobParams = {
  page?: number;
  limit?: number;
  type?: jobType | "all";
  status?: jobStatus | "all";
  search?: string;
};
