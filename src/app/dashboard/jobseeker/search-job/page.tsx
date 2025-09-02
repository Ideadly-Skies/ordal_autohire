import JobCard from "@/components/jobs/job-card";
import { getJobsCount } from "@/lib/jobs";
import { JobSearchToolbar } from "@/components/jobs/job-search-toolbar";
import Pagination from "@/components/jobs/pagination";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";

const PAGE_LIMIT = 12;

const fetchJobsWithCompanyLogos = async (
  page: number = 1,
  pageLimit: number = PAGE_LIMIT
) => {
  try {
    const jobsRef = collection(db, "jobs");

    // Create query with filters and pagination
    let jobQuery = query(
      jobsRef,
      where("status", "==", "open"),
      orderBy("created_at", "desc"),
      firestoreLimit(pageLimit)
    );

    // If not first page, implement pagination (you might need to adjust this based on your pagination strategy)
    if (page > 1) {
      // For simplicity, we'll fetch all and slice for now
      // In production, you'd want to implement proper pagination with startAfter
      jobQuery = query(
        jobsRef,
        where("status", "==", "open"),
        orderBy("created_at", "desc")
      );
    }

    const snapshot = await getDocs(jobQuery);
    const allJobs = [];

    for (const jobDoc of snapshot.docs) {
      const jobData = jobDoc.data();
      let companyLogo = "";
      let posterName = "";

      // Fetch company logo from jobposters collection
      if (jobData.poster_id) {
        try {
          const posterRef = doc(db, "jobposters", jobData.poster_id);
          const posterSnap = await getDoc(posterRef);

          if (posterSnap.exists()) {
            const posterData = posterSnap.data();
            companyLogo = posterData.profile_image || "";
            posterName = posterData.company_name || jobData.company;
          }
        } catch (error) {
          console.error("Error fetching poster data:", error);
        }
      }

      allJobs.push({
        id: jobDoc.id,
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        description: jobData.description,
        salary_min: jobData.salary_min,
        salary_max: jobData.salary_max,
        type: jobData.type,
        work_mode: jobData.work_mode,
        experience: jobData.experience,
        requirements: jobData.requirements || [],
        offers: jobData.offers || [],
        tags: jobData.tags || [],
        status: jobData.status,
        created_at: jobData.created_at,
        poster_id: jobData.poster_id,
        applicants: jobData.applicants || 0,
        company_logo: companyLogo,
        poster_name: posterName,
      });
    }

    // Implement simple pagination by slicing
    if (page > 1) {
      const startIndex = (page - 1) * pageLimit;
      const endIndex = startIndex + pageLimit;
      return allJobs.slice(startIndex, endIndex);
    }

    return allJobs.slice(0, pageLimit);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string; page?: string };
}) {
  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const page = parseInt(searchParams?.page ?? "1", 10);

  // Use the fetchJobsWithCompanyLogos function instead of listJobs
  const jobs = await fetchJobsWithCompanyLogos(page, PAGE_LIMIT);
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
    <div className="p-4">
      <JobSearchToolbar defaultQuery={q} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
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
    </div>
  );
}
