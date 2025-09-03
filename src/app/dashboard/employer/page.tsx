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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Toast
import { toast } from "react-hot-toast";

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
  Camera,
  Upload,
} from "lucide-react";

type CompanyData = {
  companyName: string;
  industry: string;
  employeeCount: string;
  location: string;
  website: string;
  email: string;
  about: string;
  profileImage?: string;
};

export default function CompanyOverview() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [editData, setEditData] = useState<CompanyData | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
            profileImage: data.profile_image || "",
          });
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [user]);

  // Add timeout for upload loading state
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isUploadingImage) {
      timeout = setTimeout(() => {
        setIsUploadingImage(false);
        toast.error("Upload timeout. Please try again.");
      }, 30000); // 30 seconds timeout
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isUploadingImage]);

  const processImageUpload = async (cdnUrl: string) => {
    try {
      const docRef = doc(db, "jobposters", user!.id);

      // Update Firestore dengan URL gambar
      await updateDoc(docRef, {
        profile_image: cdnUrl,
        updated_at: new Date().toISOString(),
      });

      // Update local state
      setCompanyData((prev) =>
        prev ? { ...prev, profileImage: cdnUrl } : prev
      );

      if (editData) {
        setEditData((prev) =>
          prev ? { ...prev, profileImage: cdnUrl } : prev
        );
      }

      toast.success("Profile image updated successfully!");
      console.log("Profile image updated successfully:", cdnUrl);
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.error("Failed to update profile image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Alternative manual file upload handler
  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("UPLOADCARE_PUB_KEY", "c28f28a655efb84b86dd");
      formData.append("file", file);

      const response = await fetch("https://upload.uploadcare.com/base/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.file) {
        const cdnUrl = `https://ucarecdn.com/${result.file}/`;
        await processImageUpload(cdnUrl);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Manual upload error:", error);
      toast.error("Failed to upload image. Please try again.");
      setIsUploadingImage(false);
    }
  };

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
        profile_image: editData.profileImage,
        updated_at: new Date().toISOString(),
      });

      setCompanyData(editData);
      setIsEditing(false);
      toast.success("Company data updated successfully!");
      console.log("Company data updated successfully");
    } catch (error) {
      console.error("Error updating company data:", error);
      toast.error("Failed to update company data. Please try again.");
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
      <div className=" p-4">
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
          <CardContent className="p-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-border">
                  <AvatarImage
                    src={companyData.profileImage}
                    alt={companyData.companyName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-blue-600 text-white text-4xl font-bold">
                    {companyData.companyName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Upload Overlay - Only show when editing */}
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              {/* Upload Button - Only show when editing */}
              {isEditing && (
                <div className="mt-4">
                  {isUploadingImage ? (
                    <div className="flex items-center justify-center gap-2 py-4">
                      <Spinner />
                      <span className="text-sm text-muted-foreground">
                        Uploading image...
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                        id="manual-upload"
                      />
                      <label
                        htmlFor="manual-upload"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground border border-dashed border-muted rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Click to upload image
                      </label>
                    </div>
                  )}
                </div>
              )}{" "}
              {/* Recommendation text - Only show when editing */}
              {isEditing && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Recommended: Square image, at least 400x400px
                </p>
              )}
            </div>

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
