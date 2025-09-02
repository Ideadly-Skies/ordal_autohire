"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Edit,
  Users,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  MapPin,
  Briefcase,
  Building,
  Eye,
  MonitorCog,
  Trash2,
} from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { db } from "@/config/firebase";
import { format } from "date-fns";
import { Job } from "../../../../../types/jobs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<(typeof jobs)[0] | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const jobsRef = collection(db, "jobs");
        const q = query(jobsRef, where("poster_id", "==", user.id));
        const snapshot = await getDocs(q);

        const jobsData: Job[] = [];

        // Fetch jobs and their applicant counts
        for (const jobDoc of snapshot.docs) {
          const jobData = jobDoc.data();

          // Get applicants count from subcollection
          const applicantsRef = collection(db, "jobs", jobDoc.id, "applicants");
          const applicantsSnapshot = await getDocs(applicantsRef);
          const applicantsCount = applicantsSnapshot.size;

          jobsData.push({
            id: jobDoc.id,
            ...jobData,
            applicants: applicantsCount, // Override with actual count from subcollection
          } as Job);
        }

        setJobs(jobsData);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user?.id]);

  const handleDeleteJob = async (jobId: string) => {
    try {
      // First, delete all applicants in the subcollection
      const applicantsRef = collection(db, "jobs", jobId, "applicants");
      const applicantsSnapshot = await getDocs(applicantsRef);

      // Delete each applicant document
      const deletePromises = applicantsSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Then delete the job document
      await deleteDoc(doc(db, "jobs", jobId));

      // Refresh the jobs list
      setJobs(jobs.filter((job) => job.id !== jobId));
      console.log("Job and all applicants deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Error deleting job. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 ">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your job postings and track applications
            </p>
          </div>
          <Link href="/dashboard/employer/jobs/new">
            <Button>Add New Post</Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Loading jobs...</div>
          </div>
        )}

        {/* Job List */}
        <div className="space-y-4">
          {!loading &&
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">
                        {job.company}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-transparent"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className=" w-full max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center gap-2">
                              {job.title}{" "}
                              <Badge
                                variant={
                                  job.status === "closed"
                                    ? "destructive"
                                    : "default"
                                }
                              >
                                {job.status}
                              </Badge>
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-6">
                            <p className="text-muted-foreground leading-relaxed">
                              {job.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 text-sm">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {job.company}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {job.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MonitorCog className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {job.work_mode}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {job.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {job.experience}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  ${job.salary_min} - ${job.salary_max}
                                </span>
                              </div>
                            </div>

                            {/* Tags Section */}
                            {job.tags && job.tags.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-3">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                  {job.tags.map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Posted{" "}
                                {format(
                                  new Date(job.created_at),
                                  "MMM d, yyyy"
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {job.applicants}{" "}
                                {job.applicants === 1
                                  ? "applicant"
                                  : "applicants"}
                              </div>
                            </div>

                            <div className="grid gap-6">
                              <div>
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                  Requirements
                                </h4>
                                <div className="space-y-2">
                                  {job.requirements.map((req, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start gap-2 text-sm text-muted-foreground"
                                    >
                                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span>{req}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                  What We Offer
                                </h4>
                                <div className="space-y-2">
                                  {job.offers.map((offer, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start gap-2 text-sm text-muted-foreground"
                                    >
                                      <Star className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                      <span>{offer}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between border-t pt-4">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Job
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Job Posting
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {job.title}"? This action cannot be undone
                                      and will remove all associated data
                                      including {job.applicants} application
                                      {job.applicants !== 1 ? "s" : ""}.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteJob(job.id!)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete Permanently
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <div className="flex gap-2">
                                <Link
                                  href={`/dashboard/employer/candidates?job_id=${job.id}`}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Users className="h-4 w-4" />
                                    View Applicants ({job.applicants})
                                  </Button>
                                </Link>
                                <Link
                                  href={`/dashboard/employer/jobs/edit/${job.id}`}
                                >
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Edit className="h-4 w-4" />
                                    Edit Job
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Link href={`/dashboard/employer/jobs/edit/${job.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>

                  {/* Tags in card preview */}
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {job.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {job.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Badge
                        variant={
                          job.status === "closed" ? "destructive" : "default"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(job.created_at), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />${job.salary_min} - $
                      {job.salary_max}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applicants}{" "}
                      {job.applicants === 1 ? "applicant" : "applicants"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No jobs posted yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first job posting to start attracting candidates
            </p>
            <Link href="/dashboard/employer/jobs/new">
              <Button>Post Your First Job</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
