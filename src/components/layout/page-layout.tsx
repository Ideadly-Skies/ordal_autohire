import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function PageLayout({
  children,
  className,
  maxWidth = "2xl",
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div
        className={cn(
          "mx-auto px-4 py-8 lg:px-6 lg:py-12",
          maxWidthClasses[maxWidth]
        )}
      >
        <div className="grid gap-6 lg:gap-8">{children}</div>
      </div>
    </div>
  );
}
