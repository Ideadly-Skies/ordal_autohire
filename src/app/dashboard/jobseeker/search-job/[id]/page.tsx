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
  Globe,
  Mail,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
} from "@firebase/firestore";
import { db } from "@/config/firebase";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { MdVerified } from "react-icons/md";
import { Job } from "../../../../../../types/jobs";
import ApplyButton from "./apply-button";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  type JobPoster = {
    id: string;
    company_name: string;
    about_company?: string;
    industry?: string;
    employee_count?: string;
    location?: string;
    website?: string;
    contact_email?: string;
    profile_image?: string; // Added profile_image field
    personal_info?: {
      name: string;
      email: string;
    };
    plan?: string;
    accountType?: string;
  };

  const { id } = await params;

  async function getJobById(
    jobId: string
  ): Promise<(Job & { company_data?: JobPoster }) | null> {
    try {
      const docRef = doc(db, "jobs", jobId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data() as Omit<Job, "id" | "poster_name">;
      let posterName: string | undefined;
      let companyData: JobPoster | undefined;

      if (data.poster_id) {
        const posterRef = doc(db, "jobposters", data.poster_id);
        const posterSnap = await getDoc(posterRef);
        if (posterSnap.exists()) {
          companyData = posterSnap.data() as JobPoster;
          posterName = companyData.company_name;
        }
      }

      return {
        id: docSnap.id,
        ...data,
        poster_name: posterName,
        company_data: companyData,
      };
    } catch (error) {
      console.error("Error fetching job:", error);
      return null;
    }
  }

  const job = await getJobById(id);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Job Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The job you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/dashboard/jobseeker/search-job">
            <Button className="mt-4">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format dates
  const postedAgo = formatDistanceToNow(new Date(job.created_at), {
    addSuffix: true,
  });
  const postedDate = format(new Date(job.created_at), "MMM d, yyyy");

  // Get company data with fallbacks
  const companyData = job.company_data;
  const companyName = companyData?.company_name || job.company;
  const companyLocation = companyData?.location || job.location;
  const companyIndustry = companyData?.industry || "Technology Company";
  const companySize = companyData?.employee_count || "Unknown size";
  const companyWebsite = companyData?.website;
  const companyEmail = companyData?.contact_email;
  const companyAbout = companyData?.about_company || job.description;
  const companyProfileImage = companyData?.profile_image; // Get profile image

  return (
    <div className="min-h-screen p-4">
      <div className="">
        <div>
          {/* Back Button */}
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
              {/* Job Header Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={companyProfileImage}
                          alt={`${companyName} logo`}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                          {companyName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold">{job.title}</h1>
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-blue-600">
                            {companyName}
                          </span>
                          <MdVerified className="inline text-green-600" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="mb-4">
                        <Badge variant="default">{job.work_mode}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Job Meta */}
                  <div className="flex items-center gap-8 mb-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{job.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">
                        ${parseInt(job.salary_min).toLocaleString()} - $
                        {parseInt(job.salary_max).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {job.tags && job.tags.length > 0 && (
                    <div className="mb-4">
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

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{postedAgo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{job.applicants} applicants</span>
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
                  <p className="leading-relaxed whitespace-pre-line">
                    {job.description}
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
                    {job.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <Check className="h-3 w-3 text-green-700" />
                        </div>
                        <span>{requirement}</span>
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
                    {job.offers.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                          <Star className="h-3 w-3 text-orange-400" />
                        </div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-3 lg:space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Apply for this job</CardTitle>
                  <p className="text-sm">Posted {postedDate}</p>
                </CardHeader>
                <CardContent className="space-y-3 mt-3">
                  <ApplyButton job={job} />
                </CardContent>
              </Card>

              {/* Company Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About {companyName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={companyProfileImage}
                        alt={`${companyName} logo`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-blue-600 text-white font-bold">
                        {companyName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{companyName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {companyIndustry}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {companySize}
                      </p>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="space-y-3 mb-4">
                    {companyLocation && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{companyLocation}</span>
                      </div>
                    )}

                    {companyWebsite && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {companyWebsite
                            .replace("https://", "")
                            .replace("http://", "")}
                        </a>
                      </div>
                    )}

                    {companyEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${companyEmail}`}
                          className="text-blue-600 hover:underline"
                        >
                          {companyEmail}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{companyIndustry}</span>
                    </div>
                  </div>

                  {/* Company Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {companyAbout}
                  </p>

                  {/* <Button variant="outline" className="w-full bg-transparent">
                    View Company Profile
                  </Button> */}
                </CardContent>
              </Card>

              {/* Job Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Job Type:
                    </span>
                    <span className="text-sm font-medium">{job.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Work Mode:
                    </span>
                    <span className="text-sm font-medium">{job.work_mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Experience:
                    </span>
                    <span className="text-sm font-medium">
                      {job.experience}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Industry:
                    </span>
                    <span className="text-sm font-medium">
                      {companyIndustry}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Company Size:
                    </span>
                    <span className="text-sm font-medium">{companySize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Salary:
                    </span>
                    <span className="text-sm font-medium">
                      ${parseInt(job.salary_min).toLocaleString()} - $
                      {parseInt(job.salary_max).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Applicants:
                    </span>
                    <span className="text-sm font-medium">
                      {job.applicants}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
