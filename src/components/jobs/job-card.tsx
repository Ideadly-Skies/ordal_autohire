// src/components/job-card.tsx
import React from "react";
import type { Job } from "@/lib/jobs";

type Props = { job: Job };

export default function JobCard({ job }: Props) {
  return (
    <div className="border rounded p-4 space-y-2 bg-white/5">
      <div className="text-lg font-semibold">{job.title}</div>
      <div className="text-sm text-muted-foreground">{job.company}</div>
      {job.location && <div className="text-sm">{job.location}</div>}
      {job.description && (
        <p className="text-sm line-clamp-3">{job.description}</p>
      )}
      {(job.salary_min || job.salary_max) && (
        <div className="text-sm">
          {job.salary_min ? `$${job.salary_min.toLocaleString()}` : ""}{" "}
          {job.salary_max ? `– $${job.salary_max.toLocaleString()}` : ""}
        </div>
      )}
    </div>
  );
}
