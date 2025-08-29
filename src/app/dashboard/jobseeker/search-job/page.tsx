import JobCard from "@/components/jobs/job-card";
import { listJobs, getJobsCount } from "@/lib/jobs";
import { JobSearchToolbar } from "@/components/jobs/job-search-toolbar";
import Pagination from "@/components/jobs/pagination";

const PAGE_LIMIT = 12;

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string; page?: string };
}) {
  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const page = parseInt(searchParams?.page ?? "1", 10);

  const jobs = await listJobs({
    limit: PAGE_LIMIT,
    status: "open",
    order: "new",
    page,
  });
  const totalJobs = await getJobsCount({ status: "open" });
  const totalPages = Math.ceil(totalJobs / PAGE_LIMIT);

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

      <Pagination currentPage={page} totalPages={totalPages} query={q} />
    </>
  );
}
