import JobCard from "@/components/job-card";
import { FaSearch } from "react-icons/fa";

export default function Page() {
  return (
    <>
      <div className="flex justify-between px-5 md:flex-row flex-col gap-3">
        <input
          type="text"
          className="border py-1 px-2 w-full md:w-5/8 dark:border-amber-50 rounded-sm"
          placeholder="Search by job, title, company, & skills.."
        />
        <button className="border hover:bg-grey-200 hover:cursor-pointer font-bold py-2 px-4 rounded">
          <FaSearch />
        </button>
        <button className="bg-amber-500 hover:bg-amber-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded">
          Auto-Apply to All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 px-4">
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
      </div>
    </>
  );
}
