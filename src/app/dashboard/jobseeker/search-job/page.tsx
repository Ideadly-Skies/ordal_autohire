import JobCard from "@/components/jobs/job-card";
import { JobSearchToolbar } from "@/components/jobs/job-search-toolbar";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

const fetchJobsWithCompanyLogos = async () => {
  const jobsRef = collection(db, "jobs");
  const jobQuery = query(
    jobsRef,
    where("status", "==", "open"),
    orderBy("created_at", "desc")
  );
  const snapshot = await getDocs(jobQuery);
  const allJobs = [];

  for (const jobDoc of snapshot.docs) {
    const jobData = jobDoc.data();
    let companyLogo = "";
    let posterName = "";

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

  return allJobs;
};

export default async function Page() {
  const jobs = await fetchJobsWithCompanyLogos();

  return (
    <div className="p-4">
      <JobSearchToolbar jobs={jobs} />
    </div>
  );
}
