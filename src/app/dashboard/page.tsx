import ProfileContent from "@/components/profile-content";
import ProfileSidebar from "@/components/profile-sidebar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen ">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-4 lg:gap-6">
        <ProfileSidebar />
        <ProfileContent />
      </div>
    </div>
  );
}
