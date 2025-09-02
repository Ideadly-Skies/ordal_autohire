import { JobForm } from "@/components/jobs/job-form";
import { notFound } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Job } from "../../../../../../../types/jobs";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;

  const jobRef = doc(db, "jobs", id);
  const jobSnap = await getDoc(jobRef);

  if (!jobSnap.exists()) {
    notFound();
  }

  const job = {
    id: jobSnap.id,
    ...jobSnap.data(),
  } as Job;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Job</h1>
          <p className="text-muted-foreground">
            Update the job listing details
          </p>
        </div>
        <JobForm initialData={job} isEditing={true} />
      </div>
    </div>
  );
}
