import {
  LucideIcon,
  LayoutDashboard,
  Users,
  Briefcase,
  Shield,
  Settings,
  BarChart,
  FileText,
  Search,
  HelpCircle,
  LifeBuoy,
} from "lucide-react";
import { Actions, Subjects } from "@/lib/casl/ability";

// Define navigation types
export type NavLink = {
  url: string;
  title: string;
  icon: LucideIcon;
  permission?: {
    action: Actions | Actions[];
    subject: Subjects;
  };
};

// Define a single navigation structure with permissions
export const navigationItems = {
  main: [
    { url: "/dashboard", title: "Dashboard", icon: LayoutDashboard },
    {
      url: "/dashboard/users",
      title: "Manage Users",
      icon: Users,
      permission: { action: "view", subject: "User" },
    },
    {
      url: "/dashboard/jobs",
      title: "Jobs",
      icon: Briefcase,
      permission: { action: "view", subject: "Job" },
    },

    {
      url: "/dashboard/applications",
      title: "Applications",
      icon: FileText,
      permission: { action: "view", subject: "Application" }, // recruiter
    },
    {
      url: "/dashboard/applications/my",
      title: "My Applications",
      icon: FileText,
      permission: { action: "view", subject: "My_Application" }, // applicant
    },

    {
      url: "/dashboard/candidates",
      title: "Candidates",
      icon: Users,
      permission: { action: "view", subject: "User" },
    },
    {
      url: "/dashboard/verification",
      title: "Verification",
      icon: Shield,
      permission: { action: "view", subject: "Verification" },
    },
  ],
  secondary: [
    { url: "/dashboard/settings", title: "Settings", icon: Settings },
    {
      url: "/dashboard/analytics",
      title: "Analytics",
      icon: BarChart,
      permission: { action: "view", subject: "all" },
    },
    { url: "/dashboard/help", title: "Help", icon: HelpCircle },
  ],
};

// Common links for all roles
export const commonNavigation = {
  secondary: [
    { url: "/dashboard/help", title: "Help & Support", icon: LifeBuoy },
  ],
};

// file: navigation.ts
export const hiddenProtectedRoutes: NavLink[] = [
  {
    url: "/dashboard/applications/apply",
    title: "Apply Job (Hidden)",
    icon: FileText, // dummy icon
    permission: { action: "view", subject: "My_Application" },
  },
  {
    url: "/dashboard/jobs/:id",
    title: "Detail Job (Hidden)",
    icon: FileText, // dummy icon
    permission: { action: "read", subject: "Job" },
  },
  {
    url: "/dashboard/jobs/create",
    title: "Detail Job (Hidden)",
    icon: FileText, // dummy icon
    permission: { action: "create", subject: "Job" },
  },
  {
    url: "/dashboard/jobs/:id/edit",
    title: "Detail Job (Hidden)",
    icon: FileText, // dummy icon
    permission: { action: "update", subject: "Job" },
  },
];
