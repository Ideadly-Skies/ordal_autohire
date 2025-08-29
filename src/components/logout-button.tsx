"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton({
  variant = "ghost",
}: {
  variant?: "ghost" | "destructive";
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Button
      variant={variant}
      className="flex items-center gap-2 cursor-pointer"
      onClick={handleLogout}
      size="sm"
    >
      <LogOut size={10} />
      <span>Logout</span>
    </Button>
  );
}
