import ProfileContent from "@/components/profile-content";
import ProfileSidebar from "@/components/profile-sidebar";
import { ProfileTabs } from "@/components/profile-tabs";
import { ProtectedRoute } from "@/components/protected-route";

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className=" rounded-lg shadow-sm border p-6">
              <ProfileTabs>
                <ProfileContent />
              </ProfileTabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
