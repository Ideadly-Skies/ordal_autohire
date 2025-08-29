import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface DynamicInputListProps {
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  placeholder: string;
  addButtonText: string;
}

export function DynamicInputList({
  items,
  onAdd,
  onRemove,
  onChange,
  placeholder,
  addButtonText,
}: DynamicInputListProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <div className="flex-1">
            <Input
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={placeholder}
            />
          </div>
          {items.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="gap-2 bg-transparent"
      >
        <Plus className="h-4 w-4" />
        {addButtonText}
      </Button>
    </div>
  );
}
