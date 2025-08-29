"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchJobseeker } from "@/lib/profile";
import { Jobseeker } from "@/lib/jobseeker";
import { useAuth } from "@/context/auth-context";
import { Briefcase, GraduationCap, MapPin, Mail, Globe, Linkedin, BookOpen } from "lucide-react";

export default function ProfileContent() {
  const { user, isLoading } = useAuth();
  const [data, setData] = useState<Jobseeker | null>(null);
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    let isMounted = true;
    const userId = user?.id || "";
    
    const loadData = async () => {
      try {
        const jobseekerData = await fetchJobseeker(userId);
        if (isMounted) {
          setData(jobseekerData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (userId) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const about = useMemo(() => {
    if (!data) return "";
    return data.resume_summary || data.background_info?.summary || "";
  }, [data]);

  const skills = data?.skills || [];
  const interests = data?.background_info?.interests || [];
  const name = `${data?.personal_info?.first_name || ""} ${data?.personal_info?.last_name || ""}`.trim();
  const title = data?.background_info?.title || "Job Title";
  const location = data?.personal_info?.location || "Location not specified";
  const email = data?.personal_info?.email || "";
  const website = data?.personal_info?.website || "";
  const linkedin = data?.personal_info?.linkedin || "";

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* About Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {about || "No summary provided."}
          </p>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Experience</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              + Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">
                  {data?.background_info?.company || "Company Name"} • {data?.background_info?.employment_type || "Full-time"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data?.background_info?.start_date || "Jan 2022"} - {data?.background_info?.end_date || "Present"} • 
                  {data?.background_info?.duration || "2 yrs 8 mos"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {data?.background_info?.description || "Description of responsibilities and achievements in this role."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Education</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              + Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">
                  {data?.education?.[0]?.institution || "University Name"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {data?.education?.[0]?.degree || "Bachelor's Degree"}, {data?.education?.[0]?.field_of_study || "Computer Science"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data?.education?.[0]?.start_year || "2018"} - {data?.education?.[0]?.end_year || "2022"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Skills</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              + Add Skills
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 text-sm bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interests Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Interests</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              + Add Interests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {interests.length > 0 ? (
              interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="px-3 py-1 text-sm text-gray-700 border-gray-200 hover:bg-gray-50"
                >
                  {interest}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No interests added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <span className="text-sm">{email || "No email provided"}</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="text-sm">{location}</span>
          </div>
          {website && (
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-400" />
              <a 
                href={website.startsWith('http') ? website : `https://${website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {website}
              </a>
            </div>
          )}
          {linkedin && (
            <div className="flex items-center space-x-3">
              <Linkedin className="h-5 w-5 text-gray-400" />
              <a 
                href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {linkedin.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
