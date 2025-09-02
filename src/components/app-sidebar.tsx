"use client";

import * as React from "react";
import { Command } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { NavDashboard } from "@/components/nav-projects";
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
import {
  jobseekerMenu,
  employerMenu,
  secondaryMenu,
} from "@/config/sidebar-menu";
import { Logo } from "./logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const dashboardMenu =
    user?.accountType === "employer" ? employerMenu : jobseekerMenu;
  const dashboardTitle =
    user?.accountType === "employer"
      ? "Employer Dashboard"
      : "Joobseeker Dashboard";

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavDashboard dashboardMenu={dashboardMenu} />
        <NavSecondary items={secondaryMenu} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user?.personal_info.name || "",
            email: user?.personal_info.email || "",
            avatar: "https://github.com/shadcn.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
