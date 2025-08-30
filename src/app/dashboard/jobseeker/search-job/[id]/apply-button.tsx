"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
  doc,
  getDoc,
} from "@firebase/firestore";
import { db } from "@/config/firebase";
import { Job } from "../../../../../../types/jobs";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ApplyButtonProps {
  job: Job;
}

export default function ApplyButton({ job }: ApplyButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isCheckingApplication, setIsCheckingApplication] = useState(true);

  // Check if user has already applied for this job
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user?.id || !job.id) return;

      try {
        // Check in the subcollection: jobseekers/{userId}/jobs_applied
        const q = query(
          collection(db, "jobseekers", user.id, "jobs_applied"),
          where("job_id", "==", job.id)
        );

        const querySnapshot = await getDocs(q);
        setHasApplied(!querySnapshot.empty);
      } catch (error) {
        console.error("Error checking application status:", error);
      } finally {
        setIsCheckingApplication(false);
      }
    };

    checkApplicationStatus();
  }, [user, job.id]);

  const handleApply = async () => {
    if (!user || hasApplied) return;

    setIsLoading(true);

    try {
      // Get jobseeker data first
      const jobseekerRef = doc(db, "jobseekers", user.id);
      const jobseekerSnap = await getDoc(jobseekerRef);

      let jobseekerData: any = {};
      if (jobseekerSnap.exists()) {
        jobseekerData = jobseekerSnap.data();
      }

      // Create application data for jobseeker's subcollection
      const applicationData = {
        company: job.company,
        job_id: job.id,
        location: job.location,
        poster_id: job.poster_id || "",
        salary_max: parseInt(job.salary_max),
        salary_min: parseInt(job.salary_min),
        score: 20, // Default score, you can implement scoring logic
        source: "ordal", // Your platform name
        status: "applied",
        created_at: Date.now(),
        updated_at: Date.now(),
        title: job.title,
        user_id: user.id,
        tags: jobseekerData.background_info?.interests || [
          "React",
          "Next.js",
          "Tailwind",
        ],
      };

      // Create applicant data for job's subcollection using actual jobseeker data structure
      const applicantData = {
        user_id: user.id,
        job_id: job.id,
        status: "applied",
        applied_at: Date.now(),
        score: 20,
        // Personal info from jobseeker profile
        name: jobseekerData.name || "Unknown",
        first_name: jobseekerData.personal_info?.first_name || "",
        last_name: jobseekerData.personal_info?.last_name || "",
        email:
          jobseekerData.personal_info?.email || user.personal_info.email || "",
        phone: jobseekerData.personal_info?.phone || "",
        id: jobseekerData.id || user.id,
        // Background info
        yoe: user.background_info?.yoe || 0, // Years of experience
        resume_summary: jobseekerData.resume_summary || "",
        background_info: {
          summary: jobseekerData.background_info?.summary || "",
          interests: jobseekerData.background_info?.interests || [],
        },
        // Account type
        accountType: jobseekerData.accountType || "jobseeker",
        // Application specific data
        expected_salary_min: parseInt(job.salary_min) || 0,
        expected_salary_max: parseInt(job.salary_max) || 0,
      };

      // Add application to jobseeker's subcollection: jobseekers/{userId}/jobs_applied
      const userJobsAppliedRef = collection(
        db,
        "jobseekers",
        user.id,
        "jobs_applied"
      );
      await addDoc(userJobsAppliedRef, applicationData);

      // Add applicant to job's subcollection: jobs/{jobId}/applicants
      if (!job.id) {
        throw new Error("Job ID is required");
      }
      const jobApplicantsRef = collection(db, "jobs", job.id, "applicants");
      await addDoc(jobApplicantsRef, applicantData);

      // Update applicants count in the job document
      if (job.id) {
        const jobRef = doc(db, "jobs", job.id);
        await updateDoc(jobRef, {
          applicants: increment(1),
        });
      }

      setHasApplied(true);
      toast.success("Application submitted successfully!");
      // Optional: Redirect to applications page
      setTimeout(() => {
        router.push("/dashboard/jobseeker/applications");
      }, 1500);
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Error applying for job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingApplication) {
    return (
      <Button className="w-full" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Checking...
      </Button>
    );
  }

  if (hasApplied) {
    return (
      <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
        <Check className="w-4 h-4 mr-2" />
        Applied
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      onClick={handleApply}
      disabled={isLoading || !user}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Applying...
        </>
      ) : (
        "Apply Now"
      )}
    </Button>
  );
}
