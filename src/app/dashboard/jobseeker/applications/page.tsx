"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import { CalendarDays, Building, FileText } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";

type Application = {
  id: string;
  created_at: number;
  job_id: string;
  job_snapshot: {
    company: string;
    job_id: string;
    location: string;
    poster_id: string;
    salary_max: number;
    salary_min: number;
    source: string;
    status: string;
    tags: string[];
    title: string;
  };
  poster_id: string;
  score: number;
  status: string;
  updated_at: number;
  user_id: string;
};

const statusColors: Record<string, string> = {
  applied: "bg-yellow-100 text-yellow-800 border-yellow-200",
  interview: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Query the subcollection: jobseekers/{userId}/jobs_applied
        const applicationsRef = collection(
          db,
          "jobseekers",
          user.id,
          "jobs_applied"
        );
        const q = query(applicationsRef, orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);

        const applicationsData: Application[] = [];
        querySnapshot.forEach((doc) => {
          applicationsData.push({
            id: doc.id,
            ...doc.data(),
          } as Application);
        });

        setApplications(applicationsData);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Failed to load applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const filteredApplications = applications.filter((app) =>
    filter === "all" ? true : app.status === filter
  );

  // Accept optional/unknown values and be defensive.
  const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  function toNum(v: unknown): number | null {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  }

  const formatSalary = (min: unknown, max: unknown) => {
    const a = toNum(min);
    const b = toNum(max);
    if (a == null && b == null) return "—";
    if (a != null && b != null) return `$${nf.format(a)} - $${nf.format(b)}`;
    const only = a ?? b!;
    return `$${nf.format(only)}`;
  };

  // Firestore Timestamp-safe date formatter
  const formatDate = (ts: unknown) => {
    // Support Firestore Timestamp, millis number, or millis string
    const ms =
      ts &&
      typeof ts === "object" &&
      ts !== null &&
      "toMillis" in ts &&
      typeof (ts as { toMillis: unknown }).toMillis === "function"
        ? // Firestore Timestamp
          (ts as { toMillis: () => number }).toMillis()
        : typeof ts === "number"
        ? ts
        : typeof ts === "string"
        ? Number(ts)
        : NaN;

    if (!Number.isFinite(ms)) return "—";

    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["jobseeker"]}>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={["jobseeker"]}>
        <div className="flex justify-center items-center min-h-[400px]">
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
            <p className="text-muted-foreground">{error}</p>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["jobseeker"]}>
      <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track your job applications and their status
                  {applications.length > 0 && (
                    <span className="ml-2">
                      ({applications.length} application
                      {applications.length !== 1 ? "s" : ""})
                    </span>
                  )}
                </CardDescription>
              </div>

              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="in review">In Review</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Applications Yet
                </h3>
                <p className="text-muted-foreground">
                  You haven&apos;t applied to any jobs yet. Start exploring
                  opportunities!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Salary Range</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">
                              {app.job_snapshot.title}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {app.job_snapshot.company}
                          </div>
                        </TableCell>
                        <TableCell>{app.job_snapshot.location}</TableCell>
                        <TableCell className="text-sm">
                          {formatSalary(
                            app.job_snapshot.salary_min,
                            app.job_snapshot.salary_max
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            {formatDate(app.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusColors[
                                app.status as keyof typeof statusColors
                              ] ||
                              "bg-slate-100 text-slate-800 border-slate-200"
                            }
                          >
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">
                              {app.score}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                              match
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {filteredApplications.length === 0 && applications.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No applications found for the selected filter.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
