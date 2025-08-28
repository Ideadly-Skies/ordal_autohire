"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, X, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const [isEditing, setIsEditing] = useState({
    name: false,
    title: false,
    about: false,
    skills: false,
  });

  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    title: "Senior Frontend Developer",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    about:
      "Passionate frontend developer with 5+ years of experience building scalable web applications. Specialized in React, TypeScript, and modern web technologies. Strong advocate for clean code, user experience, and continuous learning. Looking for opportunities to contribute to innovative products and grow with a dynamic team.",
  });

  const [skills, setSkills] = useState([
    "React.js",
    "TypeScript",
    "Next.js",
    "Node.js",
    "GraphQL",
    "Tailwind CSS",
    "Jest",
    "Docker",
    "AWS",
    "Git",
  ]);

  const [newSkill, setNewSkill] = useState("");

  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="min-h-screen ">
      <div className=" ">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </Button>
            </Link>
          </div>
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        <div className="space-y-4">
          {/* Basic Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-0">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name">Full Name</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit("name")}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                {isEditing.name ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => toggleEdit("name")}
                    autoFocus
                  />
                ) : (
                  <p className="text-sm font-medium text-muted-foreground">
                    {formData.name}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-0">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title">Professional Title</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit("title")}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                {isEditing.title ? (
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    onBlur={() => toggleEdit("title")}
                    autoFocus
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {formData.title}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">About</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit("about")}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing.about ? (
                <Textarea
                  value={formData.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  onBlur={() => toggleEdit("about")}
                  rows={6}
                  className="resize-none"
                  autoFocus
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {formData.about}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Skills</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit("skills")}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing.skills && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className="flex-1"
                  />
                  <Button onClick={addSkill} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 text-sm bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 gap-2"
                  >
                    {skill}
                    {isEditing.skills && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
