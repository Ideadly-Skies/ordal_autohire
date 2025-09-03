"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import JobCard from "@/components/jobs/job-card";
import Pagination from "@/components/jobs/pagination";
import Link from "next/link";
import { Button } from "../ui/button";

const PAGE_LIMIT = 12;

interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
  tags?: string[];
  work_mode?: string;
  type?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  company_logo?: string;
  poster_name?: string;
  experience?: string;
  created_at?: string;
  applicants?: number;
  requirements?: string[];
  offers?: unknown; // Replace 'unknown' with a specific type if the structure is known
  status?: string;
  // Add other fields as needed
}

export function JobSearchToolbar({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Filter jobs by search query
  const filtered = query
    ? jobs.filter((j) => {
        const hay = `${j.title} ${j.company} ${j.location ?? ""} ${
          j.description ?? ""
        }`.toLowerCase();
        return hay.includes(query.trim().toLowerCase());
      })
    : jobs;

  // Paginate filtered results
  const startIndex = (page - 1) * PAGE_LIMIT;
  const endIndex = startIndex + PAGE_LIMIT;
  const paginated = filtered.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filtered.length / PAGE_LIMIT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 when search is submitted
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1); // Reset to page 1 when search input changes
  };

  return (
    <>
      <form
        className="flex justify-between md:flex-row flex-col gap-3"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 w-full md:w-4/6">
          <input
            type="text"
            name="q"
            value={query}
            onChange={handleInputChange}
            className="border py-1 px-4 w-full md:w-5/6  rounded-lg"
            placeholder="Search by job, title, company, & skills.."
          />
          <button
            type="submit"
            className="border hover:bg-gray-200 hover:cursor-pointer font-bold py-2 px-3 rounded-lg"
            aria-label="Search"
          >
            <FaSearch />
          </button>
        </div>
        <Button asChild>
          <Link
            href="/dashboard/auto-apply"
            className=" hover:cursor-pointer text-fore font-bold py-2 px-4 rounded inline-flex items-center justify-center"
          >
            Auto-Apply to All
          </Link>
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {paginated.map((job) => (
         <JobCard
            key={job.id}
            job={{
              ...job,
              location: job.location ?? "",
              description: job.description ?? "",
              work_mode: job.work_mode ?? "",
              type: job.type ?? "",
              tags: job.tags ?? [],
              salary_min: job.salary_min !== undefined ? String(job.salary_min) : "",
              salary_max: job.salary_max !== undefined ? String(job.salary_max) : "",
              experience: job.experience ?? "",
              created_at: job.created_at ?? "",
              applicants: job.applicants ?? 0,
              requirements: job.requirements ?? [], // Ensure always string[]
              offers: Array.isArray(job.offers) ? job.offers : [], // Ensure always string[]
              status: job.status === "open" || job.status === "closed" ? job.status : "open", // Ensure valid status
            }}
          />
        ))}
        {paginated.length === 0 && (
          <div className="col-span-full text-center text-sm text-muted-foreground py-12">
            No jobs found.
          </div>
        )}
      </div>


      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
