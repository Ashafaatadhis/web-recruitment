import { AbilityBuilder, AbilityClass, PureAbility } from "@casl/ability";

// Define your action types
export type Actions =
  | "manage"
  | "create"
  | "read"
  | "update"
  | "delete"
  | "view";

// Define your subject types
export type Subjects =
  | "User"
  | "Job"
  | "Application"
  | "Profile"
  | "My_Application"
  | "Verification"
  | "Candidate"
  | "all";

// Define the ability type
export type AppAbility = PureAbility<[Actions, Subjects]>;
const AppAbility = PureAbility as AbilityClass<AppAbility>;

// Define permissions by role
const rolePermissions: Record<
  string,
  Array<{ action: Actions | Actions[]; subject: Subjects }>
> = {
  admin: [
    { action: ["view", "read", "create", "delete", "update"], subject: "Job" },
    { action: ["view"], subject: "User" },
  ],
  recruiter: [
    { action: ["view", "read"], subject: "Job" },
    { action: ["view", "read", "update"], subject: "Application" },
    { action: ["view", "read", "update"], subject: "Candidate" },
  ],
  applicant: [
    { action: ["view", "create", "read", "update"], subject: "My_Application" },
    { action: ["view", "read", "update"], subject: "Profile" },
  ],
};

// Define function to create abilities based on user role
export function defineAbilityFor(role: string) {
  const { can, build } = new AbilityBuilder(AppAbility);

  // Get permissions for the role
  const permissions = rolePermissions[role] || [];

  // Apply all permissions for the role
  permissions.forEach((permission) => {
    can(permission.action, permission.subject);
  });

  return build();
}
