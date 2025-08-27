import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ReusableCardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  imageSlot?: ReactNode;
}

export function ReusableCard({
  children,
  className,
  gradient = false,
  imageSlot,
}: ReusableCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden",
        gradient &&
          "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900",
        className
      )}
    >
      {imageSlot && <div className="relative overflow-hidden">{imageSlot}</div>}
      <div className="p-6">{children}</div>
    </div>
  );
}
