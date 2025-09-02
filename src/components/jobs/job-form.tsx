"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  Tag,
} from "lucide-react";
import Link from "next/link";

import { addDoc, collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Job } from "../../../types/jobs";
import { FormSection } from "./form-section";
import { FormField } from "./form-field";
import { DynamicInputList } from "./dynamic-input-list";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";

interface JobFormProps {
  initialData?: Job;
  isEditing?: boolean;
}

export function JobForm({ initialData, isEditing = false }: JobFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const [formData, setFormData] = useState<Job>({
    id: initialData?.id,
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
    tags: initialData?.tags || [""], // Add tags field
    created_at: initialData?.created_at || new Date().toISOString(),
    applicants: initialData?.applicants || 0,
    status: initialData?.status || "open",
  });

  // Fetch company name from jobposters collection
  useEffect(() => {
    const fetchCompanyName = async () => {
      if (!user?.id) return;

      try {
        const jobposterRef = doc(db, "jobposters", user.id);
        const jobposterSnap = await getDoc(jobposterRef);

        if (jobposterSnap.exists()) {
          const jobposterData = jobposterSnap.data();
          const fetchedCompanyName = jobposterData.company_name || "";
          setCompanyName(fetchedCompanyName);

          // Set company name in form data if not editing or if company field is empty
          if (!isEditing || !formData.company) {
            setFormData((prev) => ({
              ...prev,
              company: fetchedCompanyName,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching company name:", error);
        toast.error("Failed to fetch company information");
      }
    };

    fetchCompanyName();
  }, [user?.id, isEditing]);

  // Update the validateForm function to remove company validation:
  const validateForm = () => {
    const requiredFields = {
      title: "Job Title",
      location: "Location",
      experience: "Years of Experience",
      salary_min: "Minimum Salary",
      salary_max: "Maximum Salary",
      description: "Job Description",
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (
        !formData[field as keyof Job] ||
        formData[field as keyof Job] === ""
      ) {
        toast.error(`${label} is required`);
        return false;
      }
    }

    // Validate salary range
    const minSalary = parseInt(formData.salary_min);
    const maxSalary = parseInt(formData.salary_max);

    if (isNaN(minSalary) || isNaN(maxSalary)) {
      toast.error("Salary values must be valid numbers");
      return false;
    }

    if (minSalary >= maxSalary) {
      toast.error("Maximum salary must be greater than minimum salary");
      return false;
    }

    // Validate requirements and offers
    const validRequirements = formData.requirements.filter(
      (req) => req.trim() !== ""
    );
    const validOffers = formData.offers.filter((offer) => offer.trim() !== "");

    if (validRequirements.length === 0) {
      toast.error("At least one requirement is needed");
      return false;
    }

    if (validOffers.length === 0) {
      toast.error("At least one benefit/offer is needed");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to post a job");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      isEditing ? "Updating job..." : "Creating job..."
    );

    const cleanedData = {
      title: formData.title || "",
      company: formData.company || companyName, // Use fetched company name as fallback
      location: formData.location || "",
      work_mode: formData.work_mode || "Remote",
      type: formData.type || "Full-time",
      salary_min: formData.salary_min || "0",
      salary_max: formData.salary_max || "0",
      experience: formData.experience || "",
      description: formData.description || "",
      requirements: formData.requirements.filter((req) => req.trim() !== ""),
      offers: formData.offers.filter((offer) => offer.trim() !== ""),
      tags: formData.tags.filter((tag) => tag.trim() !== ""), // Add tags to cleaned data
      created_at: formData.created_at || new Date().toISOString(),
      applicants: formData.applicants || 0,
      poster_id: user?.id || "",
      status: formData.status || "open",
    };

    try {
      if (isEditing && formData.id) {
        const jobRef = doc(db, "jobs", formData.id);
        await updateDoc(jobRef, cleanedData);

        toast.success(`Job "${formData.title}" updated successfully!`, {
          id: loadingToast,
        });
        console.log("Job updated successfully with ID:", formData.id);
      } else {
        const docRef = await addDoc(collection(db, "jobs"), cleanedData);

        toast.success(`Job "${formData.title}" posted successfully!`, {
          id: loadingToast,
        });
        console.log("New job created with ID:", docRef.id);
      }

      setTimeout(() => {
        router.push("/dashboard/employer/jobs");
      }, 1500);
    } catch (error) {
      console.error("Error saving job:", error);

      toast.error(
        isEditing
          ? "Failed to update job. Please try again."
          : "Failed to create job. Please try again.",
        { id: loadingToast }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof Job,
    value: string | string[] | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Functions for requirements
  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
    toast.success("New requirement field added");
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length <= 1) {
      toast.error("At least one requirement is needed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
    toast.success("Requirement removed");
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, i) =>
        i === index ? value : req
      ),
    }));
  };

  // Functions for offers
  const addOffer = () => {
    setFormData((prev) => ({
      ...prev,
      offers: [...prev.offers, ""],
    }));
    toast.success("New benefit field added");
  };

  const removeOffer = (index: number) => {
    if (formData.offers.length <= 1) {
      toast.error("At least one benefit/offer is needed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      offers: prev.offers.filter((_, i) => i !== index),
    }));
    toast.success("Benefit removed");
  };

  const updateOffer = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      offers: prev.offers.map((offer, i) => (i === index ? value : offer)),
    }));
  };

  // Functions for tags
  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }));
    toast.success("New tag field added");
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
    toast.success("Tag removed");
  };

  const updateTag = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === index ? value : tag)),
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
                disabled={isSubmitting}
              />
            </FormField>
            <FormField label="Location" required>
              <Input
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g. San Francisco, CA"
                required
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Work Mode">
              <Select
                value={formData.work_mode}
                onValueChange={(value) => handleChange("work_mode", value)}
                disabled={isSubmitting}
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
            <FormField label="Employment Type">
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
                disabled={isSubmitting}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Years of Experience" required>
              <Input
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                placeholder="e.g. 3+ years"
                required
                disabled={isSubmitting}
              />
            </FormField>
            <FormField label="Minimum Salary" required>
              <Input
                value={formData.salary_min}
                onChange={(e) => handleChange("salary_min", e.target.value)}
                placeholder="e.g. 80,000"
                required
                disabled={isSubmitting}
              />
            </FormField>
            <FormField label="Maximum Salary" required>
              <Input
                value={formData.salary_max}
                onChange={(e) => handleChange("salary_max", e.target.value)}
                placeholder="e.g. 120,000"
                required
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField label="Job Status" required>
              <Select
                value={formData.status}
                onValueChange={(value: "open" | "closed") =>
                  handleChange("status", value)
                }
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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

        <FormSection title="Tags" icon={Tag}>
          <FormField label="Tags (separate with commas)">
            <Input
              value={formData.tags.join(", ")}
              onChange={(e) => {
                const tagsString = e.target.value;
                const tagsArray = tagsString
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag !== "");
                handleChange("tags", tagsArray);
              }}
              placeholder="e.g. React, JavaScript, Frontend, Remote, Full-time"
              disabled={isSubmitting}
            />
          </FormField>
          <div className="text-sm text-muted-foreground">
            Enter tags separated by commas. Example: React, JavaScript, Frontend
          </div>

          {/* Preview tags */}
          {formData.tags.length > 0 && formData.tags[0] !== "" && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map(
                (tag, index) =>
                  tag.trim() && (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  )
              )}
            </div>
          )}
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
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Posting..."
              : isEditing
              ? "Update Job"
              : "Post Job"}
          </Button>
          <Link href="/dashboard/employer/jobs">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
