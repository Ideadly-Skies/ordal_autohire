// src/app/dashboard/search-job/page.tsx (Server Component)
import JobCard from "@/components/jobs/job-card";
import { listJobs } from "@/lib/jobs";
import { JobSearchToolbar } from "@/components/jobs/job-search-toolbar";

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q ?? "").trim().toLowerCase();

  const jobs = await listJobs({ limit: 30, status: "open", order: "new" });
  console.log(jobs);
  const filtered = q
    ? jobs.filter((j) => {
        const hay = `${j.title} ${j.company} ${j.location ?? ""} ${
          j.description ?? ""
        }`.toLowerCase();
        return hay.includes(q);
      })
    : jobs;

  return (
    <>
      <JobSearchToolbar defaultQuery={q} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 px-4">
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-muted-foreground py-12">
            No jobs found.
          </div>
        )}
      </div>
    </>
  );
}
