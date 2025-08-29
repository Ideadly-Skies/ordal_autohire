"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Spinner } from "@/components/ui/kibo-ui/spinner";

export default function DashboardIndexPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.accountType === "jobseeker") {
        router.replace("/dashboard/jobseeker");
      } else if (user.accountType === "employer") {
        router.replace("/dashboard/employer");
      } else {
        router.replace("/"); // fallback
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Spinner />
    </div>
  );
}
