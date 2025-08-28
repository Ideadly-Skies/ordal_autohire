// src/components/job-card.tsx
import React from "react";
import type { Job } from "@/lib/jobs";
import { IoLocationOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { PiMoneyLight, PiHandbag } from "react-icons/pi";
import Link from "next/link";

type Props = { job: Job };

export default function JobCard({ job }: Props) {
  return (
    <div className="border rounded p-4 space-y-2 bg-white/5 relative">
      <div className="text-lg font-semibold">{job.title}</div>
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        {job.company} <MdVerified className="inline text-green-600" />
      </div>
      {job.location && (
        <div className="text-sm flex items-center gap-1">
          <IoLocationOutline className="inline" /> {job.location}
        </div>
      )}
      {job.description && (
        <p className="text-sm line-clamp-3 flex items-center gap-1">
          <PiHandbag className="inline text-2xl" /> {job.description}
        </p>
      )}
      {(job.salary_min || job.salary_max) && (
        <div className="text-sm flex items-center gap-1">
          <PiMoneyLight className="inline" />
          {job.salary_min ? `$${job.salary_min.toLocaleString()}` : ""}{" "}
          {job.salary_max ? `– $${job.salary_max.toLocaleString()}` : ""}
        </div>
      )}
      <Link
        href="/dashboard/search-job"
        className="bg-zinc-500 hover:bg-zinc-700 hover:cursor-pointer text-white font-bold py-1 px-2 rounded inline-flex items-center justify-center absolute bottom-2 right-2"
      >
        Detail
      </Link>
    </div>
  );
}
