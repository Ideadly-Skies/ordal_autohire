"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  Building,
  CheckCircle,
  Star,
} from "lucide-react";
import Link from "next/link";

import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Job } from "../../../types/jobs";
import { FormSection } from "./form-section";
import { FormField } from "./form-field";
import { DynamicInputList } from "./dynamic-input-list";
import { useAuth } from "@/context/auth-context";

interface JobFormProps {
  initialData?: Job;
  isEditing?: boolean;
}

export function JobForm({ initialData, isEditing = false }: JobFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<Job>({
    id: initialData?.id, // Add this line to preserve the job ID
    title: initialData?.title || "",
    company: initialData?.company || "",
    location: initialData?.location || "",
    work_mode: initialData?.work_mode || "Remote",
    type: initialData?.type || "Full-time",
    salary_min: initialData?.salary_min || "",
    salary_max: initialData?.salary_max || "",
    experience: initialData?.experience || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || [""],
    offers: initialData?.offers || [""],
    created_at: initialData?.created_at || new Date().toISOString(),
    applicants: initialData?.applicants || 0,
    status: initialData?.status || "open", // Default to "open"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedData = {
      title: formData.title || "",
      company: formData.company || "",
      location: formData.location || "",
      work_mode: formData.work_mode || "Remote",
      type: formData.type || "Full-time",
      salary_min: formData.salary_min || "0",
      salary_max: formData.salary_max || "0",
      experience: formData.experience || "",
      description: formData.description || "",
      requirements: formData.requirements.filter((req) => req.trim() !== ""),
      offers: formData.offers.filter((offer) => offer.trim() !== ""),
      created_at: formData.created_at || new Date().toISOString(),
      applicants: formData.applicants || 0,
      poster_id: user?.id || "",
      status: formData.status || "open", // Automatically set to "open" for new jobs
    };

    try {
      if (isEditing && formData.id) {
        const jobRef = doc(db, "jobs", formData.id);
        // Remove the id from the data being updated (Firebase doesn't allow updating the document ID)
        await updateDoc(jobRef, cleanedData);
        console.log("Job updated successfully with ID:", formData.id);
      } else {
        const docRef = await addDoc(collection(db, "jobs"), cleanedData);
        console.log("New job created with ID:", docRef.id);
      }
      router.push("/dashboard/employer/jobs"); // Updated path
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Error saving job. Please try again.");
    }
  };

  const handleChange = (
    field: keyof Job,
    value: string | string[] | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, i) =>
        i === index ? value : req
      ),
    }));
  };

  const addOffer = () => {
    setFormData((prev) => ({
      ...prev,
      offers: [...prev.offers, ""],
    }));
  };

  const removeOffer = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      offers: prev.offers.filter((_, i) => i !== index),
    }));
  };

  const updateOffer = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      offers: prev.offers.map((offer, i) => (i === index ? value : offer)),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/employer/jobs">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSection title="Basic Information" icon={Building}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Job Title" required>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </FormField>
            <FormField label="Company Name" required>
              <Input
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="e.g. TechCorp Inc."
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Location" required>
              <Input
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g. San Francisco, CA"
                required
              />
            </FormField>
            <FormField label="Work Mode">
              <Select
                value={formData.work_mode}
                onValueChange={(value) => handleChange("work_mode", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent className="w-[--radix-select-trigger-width]">
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Employment Type">
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent className="w-[--radix-select-trigger-width]">
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Years of Experience" required>
              <Input
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                placeholder="e.g. 3+ years"
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Minimum Salary" required>
              <Input
                value={formData.salary_min}
                onChange={(e) => handleChange("salary_min", e.target.value)}
                placeholder="e.g. 80,000"
                required
              />
            </FormField>
            <FormField label="Maximum Salary" required>
              <Input
                value={formData.salary_max}
                onChange={(e) => handleChange("salary_max", e.target.value)}
                placeholder="e.g. 120,000"
                required
              />
            </FormField>
            <FormField label="Job Status" required>
              <Select
                value={formData.status}
                onValueChange={(value: "open" | "closed") =>
                  handleChange("status", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select job status" />
                </SelectTrigger>
                <SelectContent className="w-[--radix-select-trigger-width]">
                  <SelectItem value="open">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Open
                    </div>
                  </SelectItem>
                  <SelectItem value="closed">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Closed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="Job Description" required>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the role, responsibilities, and key details..."
              rows={4}
              required
            />
          </FormField>
        </FormSection>

        <FormSection title="Requirements" icon={CheckCircle}>
          <DynamicInputList
            items={formData.requirements}
            onAdd={addRequirement}
            onRemove={removeRequirement}
            onChange={updateRequirement}
            placeholder="e.g. Bachelor's degree in Computer Science"
            addButtonText="Add Requirement"
          />
        </FormSection>

        <FormSection title="What We Offer" icon={Star}>
          <DynamicInputList
            items={formData.offers}
            onAdd={addOffer}
            onRemove={removeOffer}
            onChange={updateOffer}
            placeholder="e.g. Competitive salary package"
            addButtonText="Add Benefit"
          />
        </FormSection>

        {isEditing && (
          <FormSection title="Meta Information" icon={Users}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Posting Date</Label>
                <Input
                  value={new Date(formData.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Number of Applicants</Label>
                <Input
                  value={formData.applicants?.toString() || "0"}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Current Status</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      formData.status === "open" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium capitalize">
                    {formData.status}
                  </span>
                </div>
              </div>
            </div>
          </FormSection>
        )}

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            {isEditing ? "Update Job" : "Post Job"}
          </Button>
          <Link href="/dashboard/employer/jobs">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
