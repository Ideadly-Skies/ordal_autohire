// src/components/job-search-toolbar.tsx
"use client";

import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { Button } from "../ui/button";

export function JobSearchToolbar({
  defaultQuery = "",
}: {
  defaultQuery?: string;
}) {
  return (
    <form
      className="flex justify-between md:flex-row flex-col gap-3"
      action="/dashboard/search-job"
      method="get" // submit as GET (?q=...)
    >
      <div className="flex gap-2 w-full md:w-4/6">
        <input
          type="text"
          name="q"
          defaultValue={defaultQuery}
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

      {/* Use a Link (no onClick in server land) */}
      <Button asChild>
        <Link
          href="/dashboard/auto-apply"
          className=" hover:cursor-pointer text-fore font-bold py-2 px-4 rounded inline-flex items-center justify-center"
        >
          Auto-Apply to All
        </Link>
      </Button>
    </form>
  );
}
