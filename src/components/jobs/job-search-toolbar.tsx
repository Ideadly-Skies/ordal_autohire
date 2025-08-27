// src/components/job-search-toolbar.tsx
"use client";

import { FaSearch } from "react-icons/fa";
import Link from "next/link";

export function JobSearchToolbar({ defaultQuery = "" }: { defaultQuery?: string }) {
  return (
    <form
      className="flex justify-between px-5 md:flex-row flex-col gap-3"
      action="/dashboard/search-job"
      method="get" // submit as GET (?q=...)
    >
      <input
        type="text"
        name="q"
        defaultValue={defaultQuery}
        className="border py-1 px-2 w-full md:w-5/6 dark:border-amber-50 rounded-sm"
        placeholder="Search by job, title, company, & skills.."
      />
      <button
        type="submit"
        className="border hover:bg-gray-200 hover:cursor-pointer font-bold py-2 px-4 rounded"
        aria-label="Search"
      >
        <FaSearch />
      </button>

      {/* Use a Link (no onClick in server land) */}
      <Link
        href="/dashboard/auto-apply"
        className="bg-amber-500 hover:bg-amber-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded inline-flex items-center justify-center"
      >
        Auto-Apply to All
      </Link>
    </form>
  );
}
