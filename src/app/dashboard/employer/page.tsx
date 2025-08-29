"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  MapPin,
  Globe,
  Mail,
  Phone,
  Users,
  Edit,
} from "lucide-react";

export default function EmployerProfilePage() {
  const { user } = useAuth();

  // Mock company data - replace with real data later
  const companyData = {
    name: "Tech Solutions Inc",
    industry: "Information Technology",
    size: "50-200 employees",
    founded: "2015",
    location: "San Francisco, CA",
    website: "https://techsolutions.com",
    email: "contact@techsolutions.com",
    phone: "+1 (555) 123-4567",
    about:
      "Leading technology solutions provider with over 10 years of experience in delivering innovative software solutions to enterprises worldwide.",
    benefits: [
      "Health Insurance",
      "401(k) Plan",
      "Remote Work",
      "Flexible Hours",
      "Professional Development",
    ],
    openPositions: [
      {
        id: 1,
        title: "Senior Frontend Developer",
        type: "Full-time",
        location: "Remote",
        applications: 12,
      },
      {
        id: 2,
        title: "DevOps Engineer",
        type: "Full-time",
        location: "Hybrid",
        applications: 8,
      },
    ],
  };

  return (
    <ProtectedRoute allowedRoles={["employer"]}>
      <div className="space-y-6">
        {/* Company Overview */}
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{companyData.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {companyData.industry}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {companyData.size}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {companyData.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={companyData.website}
                        className="text-blue-600 hover:underline"
                      >
                        {companyData.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {companyData.email}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">About Company</h3>
                  <p className="text-sm text-muted-foreground">
                    {companyData.about}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {companyData.benefits.map((benefit) => (
                      <Badge key={benefit} variant="secondary">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Job Listings</CardTitle>
                <CardDescription>
                  Manage your current job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyData.openPositions.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Badge variant="outline">{job.type}</Badge>
                          <span>•</span>
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {job.applications} applications
                        </div>
                        <Button variant="link" size="sm" className="mt-1">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your company's team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Team management features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
