import { ProtectedRoute } from "@/components/protected-route";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/ui/site-header";

export default function JobSeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["employer"]}>
      <section>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </section>
    </ProtectedRoute>
  );
}
