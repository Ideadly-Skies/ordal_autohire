import { ProtectedRoute } from "@/components/protected-route";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function JobSeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["jobseeker"]}>
      <section>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </section>
    </ProtectedRoute>
  );
}
