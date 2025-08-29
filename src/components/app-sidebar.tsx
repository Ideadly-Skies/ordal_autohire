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
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Ordal-Autohire</span>
                  <span className="truncate text-xs">{dashboardTitle}</span>
                </div>
              </a>
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
