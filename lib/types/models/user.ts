import { userRoleEnum, users } from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;

export type UserRole = (typeof userRoleEnum.enumValues)[number];
