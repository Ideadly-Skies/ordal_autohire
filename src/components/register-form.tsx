"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";

// Job Seeker Schema
const jobSeekerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  accountType: z.literal("jobseeker"),
});

// Employer Schema
const employerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  accountType: z.literal("employer"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  employeeCount: z.string().min(1, "Please select employee count"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  contactEmail: z.string().email("Please enter a valid email address"),
  aboutCompany: z
    .string()
    .min(10, "Description must be at least 10 characters"),
});

type JobSeekerData = z.infer<typeof jobSeekerSchema>;
type EmployerData = z.infer<typeof employerSchema>;
type FormData = JobSeekerData | EmployerData;

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Consulting",
  "Marketing",
  "Food & Beverage",
  "Transportation",
  "Energy",
  "Entertainment",
  "Non-profit",
  "Other",
];

const employeeCounts = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

export function RegisterForm() {
  const router = useRouter();
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<
    "jobseeker" | "employer" | null
  >("jobseeker"); // Default to jobseeker instead of null
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(
      accountType === "jobseeker" ? jobSeekerSchema : employerSchema
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      accountType: "jobseeker", // Default to jobseeker
    },
  });

  const validateStep = async (step: number) => {
    if (!accountType) return false;

    let fieldsToValidate: string[] = [];

    if (accountType === "jobseeker") {
      fieldsToValidate = ["name", "email", "password"];
    } else {
      switch (step) {
        case 1:
          fieldsToValidate = ["name", "email", "password"];
          break;
        case 2:
          fieldsToValidate = ["companyName", "industry", "employeeCount"];
          break;
        case 3:
          fieldsToValidate = ["location", "website", "contactEmail"];
          break;
        case 4:
          fieldsToValidate = ["aboutCompany"];
          break;
      }
    }

    return await form.trigger(fieldsToValidate as any);
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    const maxSteps = accountType === "jobseeker" ? 1 : 4;
    if (isValid && currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAccountTypeChange = (type: "jobseeker" | "employer") => {
    setAccountType(type);
    form.setValue("accountType", type);
    setCurrentStep(1);

    if (type === "jobseeker") {
      form.reset({
        name: "",
        email: "",
        password: "",
        accountType: "jobseeker",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        accountType: "employer",
        companyName: "",
        industry: "",
        employeeCount: "",
        location: "",
        website: "",
        contactEmail: "",
        aboutCompany: "",
      });
    }
    toast.success(`Switched to ${type} registration`);
  };

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      let result;

      if (values.accountType === "employer") {
        // Pass company data for employers
        result = await authRegister(
          values.name,
          values.email,
          values.password,
          values.accountType,
          {
            companyName: (values as EmployerData).companyName,
            industry: (values as EmployerData).industry,
            employeeCount: (values as EmployerData).employeeCount,
            location: (values as EmployerData).location,
            website: (values as EmployerData).website,
            contactEmail: (values as EmployerData).contactEmail,
            aboutCompany: (values as EmployerData).aboutCompany,
          }
        );
      } else {
        // Job seeker registration without company data
        result = await authRegister(
          values.name,
          values.email,
          values.password,
          values.accountType
        );
      }

      if (!result.success) {
        toast.error(result?.message || "Registration failed", {
          id: loadingToast,
        });
        return;
      }

      toast.success("Account created successfully!", { id: loadingToast });

      // Redirect based on account type
      if (values.accountType === "employer") {
        router.push("/dashboard/employer");
      } else {
        router.push("/dashboard/jobseeker");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getStepTitle = () => {
    if (accountType === "jobseeker") {
      return "Create an account";
    }

    const employerTitles = {
      1: "Create an account",
      2: "Company Information",
      3: "Contact Details",
      4: "About Your Company",
    };
    return employerTitles[currentStep as keyof typeof employerTitles];
  };

  const getStepSubtitle = () => {
    if (accountType === "jobseeker") {
      return "Enter your details below to create your account";
    }

    const employerSubtitles = {
      1: "Enter your details below to create your account",
      2: "Enter your company details below to get started",
      3: "Provide your contact information and website",
      4: "Tell us more about your company",
    };
    return employerSubtitles[currentStep as keyof typeof employerSubtitles];
  };

  // Check if current step is final step
  const isFinalStep = () => {
    if (accountType === "jobseeker") {
      return true; // Jobseekers only have 1 step
    }
    return accountType === "employer" && currentStep === 4;
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{getStepTitle()}</CardTitle>
          <CardDescription>{getStepSubtitle()}</CardDescription>

          {accountType === "employer" && (
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step <= currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="mt-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {currentStep === 1 && (
                <div className="flex flex-col gap-3">
                  {/* Account Type */}
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Account Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={handleAccountTypeChange}
                          value={accountType || "jobseeker"}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-[--radix-select-trigger-width]">
                            <SelectItem value="jobseeker">
                              Job Seeker
                            </SelectItem>
                            <SelectItem value="employer">Employer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Full Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Employer Step 2 - Company Information */}
              {accountType === "employer" && currentStep === 2 && (
                <div className="flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Company Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Industry <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-[--radix-select-trigger-width]">
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Employee Count <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select employee count" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-[--radix-select-trigger-width]">
                            {employeeCounts.map((count) => (
                              <SelectItem key={count.value} value={count.value}>
                                {count.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Employer Step 3 - Contact Details */}
              {accountType === "employer" && currentStep === 3 && (
                <div className="flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Location <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Website (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.acme.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Contact Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="contact@acme.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Employer Step 4 - About Company */}
              {accountType === "employer" && currentStep === 4 && (
                <div className="flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="aboutCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          About Company <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your company, what you do, and your mission..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-6">
                {isFinalStep() ? (
                  <>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                    <Button variant="outline" className="w-full" type="button">
                      Sign up with Google
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!accountType}
                    className="w-full"
                  >
                    Continue
                  </Button>
                )}

                {accountType === "employer" && currentStep > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    className="w-full"
                  >
                    Back
                  </Button>
                )}
              </div>

              {/* Link to login */}
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
