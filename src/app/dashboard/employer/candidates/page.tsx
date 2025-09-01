"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Download,
  Eye,
  ChevronDown,
  Calendar,
  Users,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";

type Candidate = {
  id: string;
  user_id: string;
  job_id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  applicationDate: string;
  status: string;
  experience: string;
  location: string;
  summary: string;
  skills: string[];
  education: string;
  previousRole: string;
  salary: string;
  availability: string;
  score: number;
  applied_at: number;
};

const statusColors = {
  applied: "bg-blue-500 text-white",
  "in review": "bg-yellow-500 text-white",
  interview: "bg-purple-500 text-white",
  hired: "bg-green-500 text-white",
  rejected: "bg-red-500 text-white",
};

export default function CandidatesListPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  // Fetch candidates from Firestore
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get all jobs for this employer
        const jobsQuery = query(
          collection(db, "jobs"),
          where("poster_id", "==", user.id)
        );
        const jobsSnapshot = await getDocs(jobsQuery);

        const allCandidates: Candidate[] = [];

        // For each job, get applicants
        for (const jobDoc of jobsSnapshot.docs) {
          const jobData = jobDoc.data();
          const applicantsRef = collection(db, "jobs", jobDoc.id, "applicants");
          const applicantsSnapshot = await getDocs(applicantsRef);

          applicantsSnapshot.forEach((applicantDoc) => {
            const applicantData = applicantDoc.data();

            const candidate: Candidate = {
              id: applicantDoc.id,
              user_id: applicantData.user_id || "",
              job_id: jobDoc.id,
              name:
                `${applicantData.first_name || ""} ${
                  applicantData.last_name || ""
                }`.trim() || "Unknown",
              email: applicantData.email || "",
              phone: applicantData.phone || "",
              position: jobData.title || "Unknown Position",
              applicationDate: new Date(applicantData.applied_at)
                .toISOString()
                .split("T")[0],
              status: applicantData.status || "applied",
              experience: `${applicantData.yoe || 0}+ years`,
              location: jobData.location || "",
              summary:
                applicantData.background_info?.summary ||
                applicantData.resume_summary ||
                "",
              skills: applicantData.background_info?.interests || [],
              education: "", // Add if available in your data
              previousRole: "", // Add if available in your data
              salary: `$${
                applicantData.expected_salary_min?.toLocaleString() || 0
              } - $${applicantData.expected_salary_max?.toLocaleString() || 0}`,
              availability: applicantData.availability || "Not specified",
              score: applicantData.score || 0,
              applied_at: applicantData.applied_at || 0,
            };

            allCandidates.push(candidate);
          });
        }

        // Sort by application date (most recent first)
        allCandidates.sort((a, b) => b.applied_at - a.applied_at);
        setCandidates(allCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [user]);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;
    const matchesPosition =
      positionFilter === "all" || candidate.position === positionFilter;

    return matchesSearch && matchesStatus && matchesPosition;
  });

  const uniquePositions = [...new Set(candidates.map((c) => c.position))];

  const handleStatusChange = async (
    candidate: Candidate,
    newStatus: string
  ) => {
    try {
      if (!candidate) return;

      // Update in Firestore - jobs/{jobId}/applicants/{candidateId}
      const candidateRef = doc(
        db,
        "jobs",
        candidate.job_id,
        "applicants",
        candidate.id
      );
      await updateDoc(candidateRef, {
        status: newStatus,
        updated_at: Date.now(),
      });

      // Update in jobseekers collection
      const jobsAppliedRef = collection(
        db,
        "jobseekers",
        candidate.user_id,
        "jobs_applied"
      );
      const jobsAppliedQuery = query(
        jobsAppliedRef,
        where("job_id", "==", candidate.job_id)
      );
      const jobsAppliedSnapshot = await getDocs(jobsAppliedQuery);

      if (!jobsAppliedSnapshot.empty) {
        jobsAppliedSnapshot.forEach(async (applicationDoc) => {
          const applicationRef = doc(
            db,
            "jobseekers",
            candidate.user_id,
            "jobs_applied",
            applicationDoc.id
          );
          await updateDoc(applicationRef, {
            status: newStatus,
            updated_at: Date.now(),
          });
        });
      }

      // Fix: Update local state with correct comparison
      setCandidates((prev) =>
        prev.map((c) => {
          // Fix: Compare with candidate.id instead of candidate.id === candidate.id
          if (c.id === candidate.id && c.job_id === candidate.job_id) {
            return { ...c, status: newStatus };
          }
          return c;
        })
      );

      // Fix: Update selected candidate with correct comparison
      if (
        selectedCandidate &&
        selectedCandidate.id === candidate.id && // Fix: Compare with candidate.id
        selectedCandidate.job_id === candidate.job_id
      ) {
        setSelectedCandidate({ ...selectedCandidate, status: newStatus });
      }

      console.log(
        `Updated candidate ${candidate.id} status to ${newStatus} in both collections`
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDownloadCV = (candidateId: string, candidateName: string) => {
    const link = document.createElement("a");
    link.href = "/placeholder-cv.pdf";
    link.download = `${candidateName.replace(" ", "_")}_CV.pdf`;
    link.click();
    console.log(`Downloading CV for ${candidateName}`);
  };

  const handleViewDetails = (candidateId: string, jobId: string) => {
    const candidate = candidates.find(
      (c) => c.id === candidateId && c.job_id === jobId
    );
    if (candidate) {
      setSelectedCandidate(candidate);
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className=" mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Candidates</h1>
          <p className="text-muted-foreground">
            Review applications for your job postings ({candidates.length}{" "}
            total)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="in review">In Review</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {uniquePositions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Candidates List */}
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <Card
              key={candidate.id + "" + candidate.job_id}
              className="bg-white border border-border hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={candidate.name}
                      />
                      <AvatarFallback className="bg-accent border text-foreground font-semibold">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {candidate.name}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        Applied for {candidate.position}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge
                          className={`${
                            statusColors[
                              candidate.status as keyof typeof statusColors
                            ] || "bg-slate-500 text-white"
                          } px-2 py-1 text-xs font-medium rounded`}
                        >
                          {candidate.status.charAt(0).toUpperCase() +
                            candidate.status.slice(1)}
                        </Badge>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(
                            candidate.applicationDate
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        {candidate.score > 0 && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {candidate.score}% match
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleViewDetails(candidate.id, candidate.job_id)
                      }
                      className="text-muted-foreground border-border hover:bg-muted"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownloadCV(candidate.id, candidate.name)
                      }
                      className="text-muted-foreground border-border hover:bg-muted"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      CV
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-muted-foreground border-border hover:bg-muted bg-transparent"
                        >
                          Status
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(candidate, "applied")
                          }
                        >
                          Mark as Applied
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(candidate, "in review")
                          }
                        >
                          Move to Review
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(candidate, "interview")
                          }
                        >
                          Schedule Interview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(candidate, "hired")}
                        >
                          Mark as Hired
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(candidate, "rejected")
                          }
                          className="text-red-600 focus:text-red-600"
                        >
                          Reject Candidate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCandidates.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">
              {candidates.length === 0
                ? "No candidates yet"
                : "No candidates found"}
            </p>
            <p className="text-muted-foreground">
              {candidates.length === 0
                ? "Applications will appear here when candidates apply to your jobs"
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Candidate Details
            </DialogTitle>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={selectedCandidate.name}
                  />
                  <AvatarFallback className="bg-accent border text-foreground font-semibold text-lg">
                    {selectedCandidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {selectedCandidate.position}
                  </p>
                  <Badge
                    className={`${
                      statusColors[
                        selectedCandidate.status as keyof typeof statusColors
                      ] || "bg-slate-500 text-white"
                    } px-2 py-1 text-xs font-medium rounded`}
                  >
                    {selectedCandidate.status.charAt(0).toUpperCase() +
                      selectedCandidate.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{selectedCandidate.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedCandidate.phone || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Applied{" "}
                    {new Date(
                      selectedCandidate.applicationDate
                    ).toLocaleDateString()}
                  </span>
                </div>
                {selectedCandidate.score > 0 && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">
                      {selectedCandidate.score}% match
                    </span>
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedCandidate.summary && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Summary
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedCandidate.summary}
                  </p>
                </div>
              )}

              {/* Skills */}
              {selectedCandidate.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    Skills & Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Details */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Experience
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {selectedCandidate.experience}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Salary Expectation
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {selectedCandidate.salary}
                  </p>
                </div>
              </div> */}

              {/* <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Availability
                </h4>
                <p className="text-muted-foreground text-sm">
                  {selectedCandidate.availability}
                </p>
              </div> */}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleDownloadCV(
                      selectedCandidate.id,
                      selectedCandidate.name
                    )
                  }
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      Update Status
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(selectedCandidate, "applied")
                      }
                    >
                      Mark as Applied
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(selectedCandidate, "in review")
                      }
                    >
                      Move to Review
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(selectedCandidate, "interview")
                      }
                    >
                      Schedule Interview
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(selectedCandidate, "hired")
                      }
                    >
                      Mark as Hired
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(selectedCandidate, "rejected")
                      }
                      className="text-red-600 focus:text-red-600"
                    >
                      Reject Candidate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
