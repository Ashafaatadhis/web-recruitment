import { AbilityBuilder, AbilityClass, PureAbility } from "@casl/ability";

// Define your action types
export type Actions =
  | "manage"
  | "view"
  | "create"
  | "read"
  | "update"
  | "delete";

// Define your subject types
// Update Subjects type to include Verification
export type Subjects =
  | "User"
  | "Job"
  | "Application"
  | "Profile"
  | "Verification"
  | "Recruiter Verification"
  | "Browse_Jobs"
  | "Application_My"
  | "all";
export type AppAbility = PureAbility<[Actions, Subjects]>;
const AppAbility = PureAbility as AbilityClass<AppAbility>;
// Add permissions for recruiter role
const rolePermissions: Record<
  string,
  Array<{ action: Actions | Actions[]; subject: Subjects }>
> = {
  admin: [{ action: "manage", subject: "all" }],
  recruiter: [
    { action: ["view", "create", "read", "update", "delete"], subject: "Job" },
    { action: ["view", "read", "update"], subject: "Application" },
    { action: ["view", "read"], subject: "User" },
    { action: "manage", subject: "Recruiter Verification" }, // Added verification management
  ],
  applicant: [
    { action: ["view", "read"], subject: "Job" },
    { action: ["view", "create", "read", "update"], subject: "Application_My" },
    { action: ["view"], subject: "Browse_Jobs" },
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
