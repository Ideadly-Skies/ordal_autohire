// src/components/job-card.tsx
import React from "react";

import { IoLocationOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { PiMoneyLight, PiHandbag } from "react-icons/pi";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Job } from "../../../types/jobs";

type Props = {
  job: Job & {
    company_logo?: string;
    poster_name?: string;
  };
};

export default function JobCard({ job }: Props) {
  const companyName = job.poster_name || job.company;

  return (
    <div className="border rounded-md p-4 space-y-2 bg-white/5 relative flex flex-col justify-between h-full">
      <div>
        {/* Job Title with Company Logo */}
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage
              src={job.company_logo}
              alt={`${companyName} logo`}
              className="object-cover"
            />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
              {companyName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold truncate">{job.title}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="truncate">{companyName}</span>
              <MdVerified className="inline text-green-600 flex-shrink-0" />
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          {job.location && (
            <div className="text-sm flex items-center gap-1">
              <IoLocationOutline className="inline flex-shrink-0" />
              <span className="truncate">{job.location}</span>
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
              <PiMoneyLight className="inline flex-shrink-0" />
              <span>
                {job.salary_min
                  ? `$${parseInt(job.salary_min.toString()).toLocaleString()}`
                  : ""}{" "}
                {job.salary_max
                  ? `– $${parseInt(job.salary_max.toString()).toLocaleString()}`
                  : ""}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <Button asChild>
          <Link
            href={`/dashboard/jobseeker/search-job/${job.id}`}
            className="cursor-pointer font-bold py-1 px-2 rounded inline-flex items-center justify-center"
          >
            Detail
          </Link>
        </Button>
      </div>
    </div>
  );
}
