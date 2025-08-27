"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tabs = ["Overview", "Experience", "Applications", "Settings"];

const skills = [
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
];

const activities = [
  {
    type: "application",
    title: "Applied to Senior Frontend Developer at TechCorp",
    time: "2 hours ago",
    color: "bg-green-500",
  },
  {
    type: "view",
    title: "Profile viewed by StartupXYZ",
    time: "1 day ago",
    color: "bg-blue-500",
  },
  {
    type: "interview",
    title: "Interview scheduled with InnovateLab",
    time: "3 days ago",
    color: "bg-orange-500",
  },
];

export default function ProfileContent() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="flex-1">
      {/* Navigation Tabs */}
      {/* <div className="flex space-x-2 mb-6 lg:mb-8 bg-gray-50 rounded-xl p-2">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            size="sm"
            className={`flex-1 text-sm lg:text-base transition-all duration-200 ${
              activeTab === tab
                ? "bg-white shadow-sm font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div> */}

      <div className="space-y-5">
        {/* About Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-1 lg:pb-2">
            <CardTitle className="text-xl lg:text-2xl font-semibold">
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
              Passionate frontend developer with 5+ years of experience building
              scalable web applications. Specialized in React, TypeScript, and
              modern web technologies. Strong advocate for clean code, user
              experience, and continuous learning. Looking for opportunities to
              contribute to innovative products and grow with a dynamic team.
            </p>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 lg:pb-3">
            <CardTitle className="text-lg lg:text-xl font-medium">
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 lg:pb-3">
            <CardTitle className="text-lg lg:text-xl font-medium">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.color}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pretty">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
