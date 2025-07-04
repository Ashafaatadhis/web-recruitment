"use client";

import { useAbility } from "@/lib/casl/AbilityContext";
import { navigationItems } from "@/config/navigation";
import * as React from "react";

import type { User } from "next-auth"; // Import User type for the prop

import { NavMain } from "@/components/nav-main";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Subjects } from "@/lib/casl/ability";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

// In AppSidebar component
export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const ability = useAbility();

  // Filter navigation items based on permissions
  // In the filter functions, we need to properly type the action parameter
  const filteredMainNav = navigationItems.main.filter((item) => {
    if (!item.permission) return true;

    const actions = Array.isArray(item.permission.action)
      ? item.permission.action
      : [item.permission.action];

    const hasViewAction = actions.includes("view");

    const canView = ability.can("view", item.permission.subject as Subjects);

    return hasViewAction && canView;
  });

  const filteredSecondaryNav = navigationItems.secondary.filter((item) => {
    if (!item.permission) return true;

    const actions = Array.isArray(item.permission.action)
      ? item.permission.action
      : [item.permission.action];

    if (!actions.includes("view")) return false;

    return ability.can("view", item.permission.subject as Subjects);
  });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                {/* <Command className="size-4" /> */}
                <Image
                  src="/logo.png"
                  width={32}
                  height={32}
                  alt="Inthernals Logo"
                />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate">Inthernals</span>
                  {/* <span className="truncate text-xs">Enterprise</span> */}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredMainNav} />
        <NavSecondary items={filteredSecondaryNav} className="mt-auto" />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
