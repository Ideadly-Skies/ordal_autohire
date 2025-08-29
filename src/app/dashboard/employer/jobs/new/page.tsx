import { JobForm } from "@/components/jobs/job-form";

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Add New Job
          </h1>
          <p className="text-muted-foreground">
            Fill in the details to post a new job listing
          </p>
        </div>
        <JobForm />
      </div>
    </div>
  );
}
