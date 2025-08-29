import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Check,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "@/config/firebase";
import { Job } from "@/lib/jobs";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  type JobPoster = {
    id: string;
    company_name: string;
    // tambahkan field lain kalau perlu
  };

  const { id } = await params;
  console.log(id); // Ganti dengan fetch data pekerjaan berdasarkan ID
  // Misalnya, panggil API atau query database di sini

  async function getJobById(jobId: string): Promise<Job | null> {
    try {
      const docRef = doc(db, "jobs", jobId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data() as Omit<Job, "id" | "poster_name">;
      let posterName: string | undefined;

      if (data.poster_id) {
        const posterRef = doc(db, "jobposters", data.poster_id);
        const posterSnap = await getDoc(posterRef);
        if (posterSnap.exists()) {
          const posterData = posterSnap.data() as JobPoster;
          posterName = posterData.company_name;
          console.log(posterData);
        }
      }

      return {
        id: docSnap.id,
        ...data,
        poster_name: posterName,
      };
    } catch (error) {
      console.error("Error fetching job:", error);
      return null;
    }
  }

  const job: Job | null = await getJobById(id);

  // Format Post Date
  const postedAgo = job?.created_at
    ? formatDistanceToNow(job.created_at, { addSuffix: true })
    : "";

  console.log(job);

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div>
          {/* Button */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" className="p-2">
              <Link
                href={"/dashboard/jobseeker/search-job"}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="ml-2">Back to Jobs</span>
              </Link>
            </Button>
          </div>
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-5">
            <div className="lg:col-span-2 space-y-3 lg:space-y-5">
              {/* Job Header Card - Parallel Layout */}
              <Card>
                <CardContent className="p-6">
                  {/* Top Row - Company Info and Actions */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                          A
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                          {job?.title || "Job Title"}
                        </h1>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-blue-600">
                            {job?.poster_name || "Company Name"}
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            ✓
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Job Meta - Single Horizontal Row */}
                  <div className="flex items-center gap-8 mb-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{job?.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm">Contract</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">4+ years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">
                        {" "}
                        {job?.salary_min
                          ? `${job.salary_min.toLocaleString()}`
                          : ""}{" "}
                        {job?.salary_max
                          ? `– ${job.salary_max.toLocaleString()}`
                          : ""}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row - Posted Info and Match */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{postedAgo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>15 applicants</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                      <span className="font-medium">92% Match</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {job?.description || "description"}
                  </p>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent className="mt-3">
                  <div className="space-y-3">
                    {[
                      "Bachelor's degree in Supply Chain Management or related field",
                      "4+ years experience in inventory management",
                      "Experience with WMS and ERP systems",
                      "Strong analytical and leadership skills",
                      "Knowledge of cold chain management",
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* What We Offer */}
              <Card>
                <CardHeader>
                  <CardTitle>What We Offer</CardTitle>
                </CardHeader>
                <CardContent className="mt-3">
                  <div className="space-y-3">
                    {[
                      "Competitive salary package",
                      "Health insurance coverage",
                      "Professional development opportunities",
                      "Collaborative work environment",
                      "Career advancement prospects",
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                          <Star className="h-3 w-3 text-orange-400" />
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-3 lg:space-y-5 ">
              {/* Apply Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Apply for this job</CardTitle>
                  <p className="text-sm text-gray-500">
                    Recruiter active 1 minute ago
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 mt-3">
                  <Button className="w-full">
                    <Link
                      href={"/dashboard/jobseeker/applications"}
                      className="w-full"
                    >
                      Apply Now
                    </Link>
                  </Button>
                  {/* 
                  <div className="text-center pt-2">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                      <span className="font-bold text-lg">92%</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Match with your profile
                    </p>
                  </div> */}
                </CardContent>
              </Card>

              {/* About Company */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    About {job?.poster_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white font-bold">
                        A
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{job?.poster_name}</h3>
                      <p className="text-sm text-gray-600">
                        Technology Company
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">
                    ASTRO is a leading technology company specializing in
                    innovative solutions for supply chain and inventory
                    management.
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Company Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">
                          Inventory Manager
                        </h4>
                        <p className="text-xs text-gray-600">
                          TechCorp • Jakarta
                        </p>
                        <p className="text-xs text-gray-500">2d ago</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                        <span className="text-xs font-medium">88%</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">
                          Supply Chain Specialist
                        </h4>
                        <p className="text-xs text-gray-600">
                          LogiTech • Bandung
                        </p>
                        <p className="text-xs text-gray-500">3d ago</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                        <span className="text-xs font-medium">85%</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                  >
                    View More Jobs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
