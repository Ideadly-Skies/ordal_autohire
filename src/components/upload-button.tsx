"use client";

import { Button } from "@/components/ui/button";
import { UploadModal } from "./upload-modal";
import { useState } from "react";
import { ArrowRight, UploadIcon } from "lucide-react";

export function UploadButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="default"
        asChild
        className="rounded-full px-10 cursor-pointer"
      >
        <span className="text-nowrap">
          Start now for free <ArrowRight />
        </span>
      </Button>

      <UploadModal open={open} onOpenChange={setOpen} />
    </>
  );
}
