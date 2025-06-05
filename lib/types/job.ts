import { jobStatusEnum } from "../db/schema";

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

export type UpdateJobInput = {
  title: string;
  description: string;
  requirements: string;
  location?: string;
  jobType: string;
  status: (typeof jobStatusEnum.enumValues)[number]; // ambil dari enum schema langsung
  questions?: { question: string }[];
};
