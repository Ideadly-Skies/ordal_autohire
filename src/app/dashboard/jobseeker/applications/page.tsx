"use client";

import { useState } from "react";
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
import { CalendarDays, Building } from "lucide-react";

// Mock data - replace with real API call later
const applications = [
  {
    id: 1,
    position: "Frontend Developer",
    company: "Tech Corp",
    appliedDate: "2024-02-20",
    status: "pending",
    location: "Remote",
  },
  {
    id: 2,
    position: "Full Stack Engineer",
    company: "StartUp Inc",
    appliedDate: "2024-02-18",
    status: "interview",
    location: "San Francisco, CA",
  },
  {
    id: 3,
    position: "React Developer",
    company: "Software Co",
    appliedDate: "2024-02-15",
    status: "rejected",
    location: "New York, NY",
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  interview: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function ApplicationsPage() {
  const [filter, setFilter] = useState("all");

  const filteredApplications = applications.filter((app) =>
    filter === "all" ? true : app.status === filter
  );

  return (
    <ProtectedRoute allowedRoles={["jobseeker"]}>
      <div className="">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track your job applications and their status
                </CardDescription>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
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
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.position}
                    </TableCell>
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
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusColors[app.status as keyof typeof statusColors]
                        }
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
