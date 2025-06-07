import { applicationStatus } from "./models/application";

export type GetAllApplicationParams = {
  page?: number;
  limit?: number;
  status?: applicationStatus | "all";
  search?: string;
};
