import { z } from "zod";

export const userCreateFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["applicant", "recruiter", "admin"]),
});

export type UserCreateFormSchema = z.infer<typeof userCreateFormSchema>;

export const userEditFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(1, { message: "Username is required" }),
  role: z.enum(["applicant", "recruiter", "admin"]),
});

export type UserEditFormSchema = z.infer<typeof userEditFormSchema>;
