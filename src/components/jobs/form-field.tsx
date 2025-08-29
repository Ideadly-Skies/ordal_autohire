import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface FormFieldProps {
  label: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({
  label,
  icon: Icon,
  children,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );
}
