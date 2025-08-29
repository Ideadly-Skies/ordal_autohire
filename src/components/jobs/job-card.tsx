// src/components/job-card.tsx
import React from "react";
import type { Job } from "@/lib/jobs";
import { IoLocationOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { PiMoneyLight, PiHandbag } from "react-icons/pi";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = { job: Job };

export default function JobCard({ job }: Props) {
  return (
    <div className="border rounded-md p-4 space-y-2 bg-white/5 relative flex flex-col justify-between h-full">
      <div>
        <div className="text-lg font-semibold">{job.title}</div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          {job.company} <MdVerified className="inline text-green-600" />
        </div>
        <div className="mt-2 space-y-1">
          {job.location && (
            <div className="text-sm flex items-center gap-1">
              <IoLocationOutline className="inline" /> {job.location}
            </div>
          )}
          {job.description && (
            <div className="flex items-center gap-1 mt-2">
              <PiHandbag className="inline shrink-0" />
              <p className="text-sm line-clamp-2">{job.description}</p>
            </div>
          )}
          {(job.salary_min || job.salary_max) && (
            <div className="text-sm flex items-center gap-1">
              <PiMoneyLight className="inline" />
              {job.salary_min ? `$${job.salary_min.toLocaleString()}` : ""}{" "}
              {job.salary_max ? `– $${job.salary_max.toLocaleString()}` : ""}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <Button asChild>
          <Link
            href={`/dashboard/jobseeker/search-job/${job.id}`}
            className=" cursor-pointer  font-bold py-1 px-2 rounded inline-flex items-center justify-center"
          >
            Detail
          </Link>
        </Button>
      </div>
    </div>
  );
}
