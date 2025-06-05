export interface CreateUserInput {
  name: string;
  email: string;
  username: string;
  password: string;
  role: "applicant" | "recruiter" | "admin";
}
