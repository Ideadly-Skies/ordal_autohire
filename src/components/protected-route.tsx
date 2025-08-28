// filepath: /Users/krisnuartha/DATA/BOOTCAMP/hacktiv8/FERN/phase-3/Ordal-AutoHire/src/components/protected-route.tsx
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: ("jobseeker" | "employer")[];
};

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isRedirecting) {
      if (!user) {
        setIsRedirecting(true);
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(user.accountType)) {
        setIsRedirecting(true);
        router.push(
          user.accountType === "employer"
            ? "/dashboard/employer"
            : "/dashboard/user"
        );
      }
    }
  }, [user, isLoading, router, allowedRoles, isRedirecting]);

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="w-full h-screen p-8 space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  // Don't render if user doesn't have required role
  if (allowedRoles && !allowedRoles.includes(user.accountType)) {
    return null;
  }

  return <>{children}</>;
}
