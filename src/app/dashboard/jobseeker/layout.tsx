"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { UploadModal } from "@/components/upload-modal";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function JobSeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadModalClose = (open: boolean, uploaded?: boolean) => {
    setShowUploadModal(open);
    if (!open && uploaded) {
      // Only reload if CV was actually uploaded
      window.location.reload();
    }
  };

  // Check if user has uploaded CV
  const hasUploadedCV = user?.upload_cv === true;

  const CVUploadInstructions = () => (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="h-10 w-10 text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Complete Your Profile
        </h2>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Upload your CV and let our AI extract your skills, experience, and
          qualifications to unlock your full dashboard.
        </p>

        <Button
          onClick={() => setShowUploadModal(true)}
          className="gap-2 mb-4"
          size="lg"
        >
          <Upload className="h-5 w-5" />
          Upload & Parse CV
        </Button>

        <p className="text-sm text-gray-500">
          Supported formats: PDF, DOCX, TXT
        </p>
      </div>

      {/* Upload Modal */}
      {user?.id && (
        <UploadModal
          open={showUploadModal}
          onOpenChange={handleUploadModalClose}
        />
      )}
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["jobseeker"]}>
      <section>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            {hasUploadedCV ? (
              <div className="flex flex-1 flex-col p-4">{children}</div>
            ) : (
              <CVUploadInstructions />
            )}
          </SidebarInset>
        </SidebarProvider>
      </section>
    </ProtectedRoute>
  );
}
