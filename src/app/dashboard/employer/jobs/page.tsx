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

        const jobsData: Job[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];

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
      await deleteDoc(doc(db, "jobs", jobId));
      // Refresh the jobs list
      setJobs(jobs.filter((job) => job.id !== jobId));
      console.log("Job deleted successfully");
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
          </div>
          <Link href="/dashboard/employer/jobs/new">
            <Button>Add New Post</Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && <p className="text-muted-foreground">Loading jobs...</p>}

        {/* Job List */}
        <div className="space-y-4">
          {!loading &&
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
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

                            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {format(
                                  new Date(job.created_at),
                                  "MMM d, yyyy"
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {job.applicants} applicants
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
                                      including applications.
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

                              <Link
                                href={`/dashboard/employer/jobs/edit/${job.id}`}
                              >
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit Job Details
                                </Button>
                              </Link>
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
                          Edit Job
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>

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
                      {job.applicants} applicants
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No jobs posted yet</p>
            <Link href="/dashboard/employer/jobs/new">
              <Button>Post Your First Job</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
