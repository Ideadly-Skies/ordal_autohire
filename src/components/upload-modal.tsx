"use client";

import { useState, useRef } from "react";
import { AlertCircleIcon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { doc, updateDoc } from "firebase/firestore";

import toast from "react-hot-toast";
import { db } from "@/config/firebase";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean, uploaded?: boolean) => void;
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [skillsMode, setSkillsMode] = useState<"add" | "replace">("add");
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const ACCEPTED_FILE_TYPES = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "text/plain": [".txt"],
  };

  const isValidFileType = (file: File) => {
    return Object.keys(ACCEPTED_FILE_TYPES).includes(file.type);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      if (!isValidFileType(droppedFile)) {
        setErr(
          "File type not accepted. Please upload PDF, DOCX, or TXT files only."
        );
        return;
      }

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.files = dataTransfer.files;
      }

      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!isValidFileType(selectedFile)) {
        setErr(
          "File type not accepted. Please upload PDF, DOCX, or TXT files only."
        );
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setErr(null);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = (uploaded: boolean = false) => {
    setFile(null);
    setPreviewUrl(null);
    setErr(null);
    setSkillsMode("add");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onOpenChange(false, uploaded);
  };

  const updateUserUploadStatus = async () => {
    if (!user?.id) {
      console.error("No user ID available");
      return false;
    }

    try {
      const userRef = doc(db, "jobseekers", user.id);
      await updateDoc(userRef, {
        upload_cv: true,
        cv_uploaded_at: new Date(),
        updated_at: new Date(),
      });

      console.log("Successfully updated upload_cv to true");
      return true;
    } catch (error) {
      console.error("Error updating upload_cv status:", error);
      toast.error("Failed to update profile status");
      return false;
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setBusy(true);
    setErr(null);

    try {
      const fd = new FormData();
      fd.append("userId", user?.id || "");
      fd.append("file", file);
      fd.append("skillsMode", skillsMode);

      const res = await fetch("/api/resume/ingest", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Upload failed (${res.status})`);
      }

      // Update Firestore upload status
      const updateSuccess = await updateUserUploadStatus();

      if (updateSuccess) {
        toast.success("CV uploaded and parsed successfully!");
        handleClose(true);
        router.push("/dashboard/jobseeker");
      }
    } catch (e) {
      if (e instanceof Error) {
        setErr(e.message || "Something went wrong.");
      } else {
        setErr("Something went wrong.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleClose(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Your ATS CV</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="relative">
            {busy && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl z-50">
                <Spinner variant="circle" color="white" />
                <span className="text-white ml-2 font-medium">
                  Analyzing your CV...
                </span>
              </div>
            )}

            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              className="border-input data-[dragging=true]:bg-accent/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={handleFileSelect}
                className="sr-only"
                required
              />

              {previewUrl ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="font-medium">{file?.name}</p>
                    <p className="text-sm text-gray-500">
                      {file && typeof file.size === "number"
                        ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                        : "Unknown size"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                  <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border">
                    <UploadIcon className="size-4 opacity-60" />
                  </div>
                  <p className="mb-1.5 text-sm font-medium">
                    Drop your CV here
                  </p>
                  <p className="text-muted-foreground text-xs">
                    PDF, DOCX, TXT accepted
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    <UploadIcon className="-ms-1 size-4 opacity-60" />
                    Select CV
                  </Button>
                </div>
              )}
            </div>

            {previewUrl && (
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                  onClick={removeFile}
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills-behavior">Skills behavior</Label>
            <Select
              value={skillsMode}
              onValueChange={(value) =>
                setSkillsMode(value as "add" | "replace")
              }
            >
              <SelectTrigger className="w-full" id="skills-behavior">
                <SelectValue placeholder="Select skills behavior" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add to existing</SelectItem>
                <SelectItem value="replace">Replace existing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button disabled={busy || !file} className="w-full" type="submit">
            {busy ? "Parsing…" : "Upload & Parse"}
          </Button>

          {err && (
            <div
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{err}</span>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
