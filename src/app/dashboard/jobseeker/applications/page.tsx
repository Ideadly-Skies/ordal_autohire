"use client";

import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building } from "lucide-react";
import { useAuth } from "@/context/auth-context";

// ---- Firestore (client SDK) ----
import { db } from "@/config/firebase"; // your initialized client db
import {
  collection, onSnapshot, orderBy, query, Timestamp,
} from "firebase/firestore";

type AppRow = {
  id: string;              // doc id (job_id)
  position: string;        // top-level 'title' (or from snapshot fallback)
  company: string;         // job_snapshot.company
  location: string;        // job_snapshot.location
  appliedDate: Date;       // created_at (ms or Timestamp)
  status: "applied" | "interview" | "rejected" | "accepted" | string;
};

const statusColors: Record<string, string> = {
  applied: "bg-yellow-100 text-yellow-800 border-yellow-200",
  interview: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
};

function toDate(v: unknown): Date {
  if (!v) return new Date(0);
  // Firestore Timestamp
  if (typeof v === "object" && v !== null && "toDate" in (v as { toDate?: () => Date })) {
    return (v as Timestamp).toDate();
  }
  // epoch ms
  if (typeof v === "number") return new Date(v);
  return new Date(0);
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    // /jobseekers/{uid}/jobs_applied (ordered newest first)
    const q = query(
      collection(db, "jobseekers", user.id, "jobs_applied"),
      orderBy("created_at", "desc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      const next = snap.docs.map((d) => {
        const data = d.data() || {};
        type JobSnapshot = {
          title?: string;
          company?: string;
          location?: string;
        };
        const js = (data.job_snapshot ?? {}) as JobSnapshot;

        const row: AppRow = {
          id: d.id,
          position: (data.title as string) || (js.title as string) || "(untitled)",
          company: (js.company as string) || "—",
          location: (js.location as string) || "—",
          appliedDate: toDate(data.created_at),
          status: (data.status as string) || "applied",
        };
        return row;
      });
      setRows(next);
      setLoading(false);
    });

    return () => unsub();
  }, [user?.id]);

  const filtered = useMemo(
    () => rows.filter((r) => (filter === "all" ? true : r.status === filter)),
    [rows, filter],
  );

  return (
    <ProtectedRoute allowedRoles={["jobseeker"]}>
      <div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track your job applications in real time
                </CardDescription>
              </div>

              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                {filter === "all" ? "No applications yet." : `No ${filter} applications.`}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.position}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          {app.company}
                        </div>
                      </TableCell>

                      <TableCell>{app.location}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          {app.appliedDate.toLocaleDateString()}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={statusColors[app.status] ?? "bg-gray-100 text-gray-800 border-gray-200"}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
