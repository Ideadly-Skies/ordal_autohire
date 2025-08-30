"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/auth-context";

// UI Components
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

// Icons
import {
  Edit3,
  Save,
  X,
  Building2,
  Factory,
  Users,
  MapPin,
  Globe,
  Mail,
} from "lucide-react";

type CompanyData = {
  companyName: string;
  industry: string;
  employeeCount: string;
  location: string;
  website: string;
  email: string;
  about: string;
};

export default function CompanyOverview() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [editData, setEditData] = useState<CompanyData | null>(null);

  // Ambil data dari Firestore
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user?.id) return;

      try {
        const docRef = doc(db, "jobposters", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompanyData({
            companyName: data.company_name || "",
            industry: data.industry || "Information Technology",
            employeeCount: data.employee_count || "",
            location: data.location || "",
            website: data.website || "",
            email: data.contact_email || "",
            about: data.about_company || "",
          });
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [user]);

  // Handle edit
  const handleEdit = () => {
    if (companyData) {
      setEditData(companyData);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditData(companyData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editData || !user?.id) return;

    try {
      const docRef = doc(db, "jobposters", user.id);
      await updateDoc(docRef, {
        company_name: editData.companyName,
        industry: editData.industry,
        employee_count: editData.employeeCount,
        location: editData.location,
        website: editData.website,
        contact_email: editData.email,
        about_company: editData.about,
      });

      setCompanyData(editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating company data:", error);
    }
  };

  const updateEditData = (updates: Partial<CompanyData>) => {
    setEditData((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  if (!companyData)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className=" px-4 py-4 sm:py-6 lg:py-8">
        {/* Company Info Card */}
        <div className="mb-8 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              Profile Information
            </h1>
            <p className="text-muted-foreground">
              Manage your company profile details to keep them up to date.
            </p>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end mt-6 lg:mt-8 gap-2 sm:gap-3">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="gap-2 w-full sm:w-auto order-2 sm:order-1"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent w-full sm:w-auto order-1 sm:order-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent w-full sm:w-auto"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
        <Card className="shadow-sm">
          <CardContent className="">
            {/* Company Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8 mb-6 lg:mb-8">
              {/* Left Side - Company Basic Info */}
              <div className="space-y-4 lg:space-y-6 w-full lg:w-1/2">
                {/* Company Name */}
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <Input
                      value={editData?.companyName || ""}
                      onChange={(e) =>
                        updateEditData({ companyName: e.target.value })
                      }
                      className="text-xl sm:text-2xl font-bold border p-2 h-auto bg-transparent w-full"
                      placeholder="Company Name"
                    />
                  </div>
                ) : (
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">
                    {companyData.companyName}
                  </h2>
                )}

                {/* Industry */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 ">
                  <Factory className="h-4 w-4 flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      value={editData?.industry || ""}
                      onChange={(e) =>
                        updateEditData({ industry: e.target.value })
                      }
                      className="border p-2 h-auto bg-transparent w-full"
                      placeholder="Industry"
                    />
                  ) : (
                    <span className="text-sm sm:text-base break-words">
                      {companyData.industry}
                    </span>
                  )}
                </div>

                {/* Employee Count */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      value={editData?.employeeCount || ""}
                      onChange={(e) =>
                        updateEditData({ employeeCount: e.target.value })
                      }
                      className="p-2 h-auto bg-transparent border w-full"
                      placeholder="Number of employees"
                    />
                  ) : (
                    <span className="text-sm sm:text-base">
                      {companyData.employeeCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Side - Contact Info */}
              <div className="space-y-4 lg:space-y-6 w-full lg:w-1/2">
                {/* Location */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      value={editData?.location || ""}
                      onChange={(e) =>
                        updateEditData({ location: e.target.value })
                      }
                      className="p-2 h-auto bg-transparent border w-full"
                      placeholder="Location"
                    />
                  ) : (
                    <span className="text-sm sm:text-base break-words">
                      {companyData.location}
                    </span>
                  )}
                </div>

                {/* Website */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      value={editData?.website || ""}
                      onChange={(e) =>
                        updateEditData({ website: e.target.value })
                      }
                      className="border p-2 h-auto bg-transparent text-blue-600 w-full"
                      placeholder="Website URL"
                    />
                  ) : (
                    <a
                      href={companyData.website}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {companyData.website}
                    </a>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      value={editData?.email || ""}
                      onChange={(e) =>
                        updateEditData({ email: e.target.value })
                      }
                      className="border p-2 h-auto bg-transparent w-full"
                      placeholder="Contact email"
                      type="email"
                    />
                  ) : (
                    <span className="text-sm sm:text-base break-all">
                      {companyData.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* About Company */}
            <div className="space-y-4 lg:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold">
                About Company
              </h3>
              {isEditing ? (
                <Textarea
                  value={editData?.about || ""}
                  onChange={(e) => updateEditData({ about: e.target.value })}
                  className="leading-relaxed min-h-[100px] sm:min-h-[120px] border-gray-200 w-full resize-vertical"
                  placeholder="Tell us about your company..."
                />
              ) : (
                <p className="leading-relaxed text-sm sm:text-base ">
                  {companyData.about}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
