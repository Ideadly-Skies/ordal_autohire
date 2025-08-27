// src/components/profile-sidebar.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "./ui/progress";
import { fetchJobseeker } from "@/lib/profile";
import { Jobseeker } from "@/lib/jobseeker";

const DEFAULT_USER_ID = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || "USER_001";

function computeProfileStrength(js?: Jobseeker): number {
  if (!js) return 0;
  let score = 0;
  if (js.personal_info?.first_name && js.personal_info?.last_name) score += 25;
  if (js.background_info?.summary) score += 25;
  if ((js.skills?.length ?? 0) > 0) score += 25;
  if (js.resume_summary) score += 25;
  return score;
}

export default function ProfileSidebar() {
  const [data, setData] = useState<Jobseeker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    fetchJobseeker(DEFAULT_USER_ID).then((d) => {
      if (on) {
        setData(d);
        setLoading(false);
      }
    });
    return () => { on = false; };
  }, []);

  const strength = useMemo(() => computeProfileStrength(data ?? undefined), [data]);

  // Fake “AI match” for now—derive something repeatable from skills length
  const aiMatch = useMemo(() => {
    const n = data?.skills?.length ?? 0;
    return Math.min(95, 60 + n * 4); // 60–95%
  }, [data]);

  return (
    <div className="w-full lg:w-80 space-y-3 lg:space-y-4">
      {/* Profile Completion */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 lg:pb-3">
          <CardTitle className="text-base lg:text-lg font-medium">
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 lg:space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Profile Strength</span>
              <span className="text-sm font-semibold text-blue-600">
                {loading ? "…" : `${strength}%`}
              </span>
            </div>
            <Progress value={loading ? 0 : strength} className="h-2" />
          </div>
          <p className="text-xs lg:text-sm text-muted-foreground">
            Add portfolio links to reach 100%
          </p>
        </CardContent>
      </Card>

      {/* AI Match Insights */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 lg:pb-3">
          <CardTitle className="text-base lg:text-lg font-medium">
            AI Match Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 lg:space-y-4">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-orange-500 mb-1">
              {loading ? "…" : `${aiMatch}%`}
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground">Average Match Score</p>
          </div>

          {/* Simple “top 3” skills display */}
          <div className="space-y-1.5 lg:space-y-2">
            {(data?.skills ?? []).slice(0, 3).map((s) => (
              <div key={s} className="flex justify-between items-center">
                <span className="text-sm">{s}</span>
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1"
                >
                  {["Expert", "Advanced", "Intermediate"][Math.floor(Math.random()*3)]}
                </Badge>
              </div>
            ))}
            {(!data?.skills || data.skills.length === 0) && (
              <div className="text-xs text-muted-foreground">No skills yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats (placeholder/demo) */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 lg:pb-3">
          <CardTitle className="text-base lg:text-lg font-medium">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 lg:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Applications Sent</span>
            <span className="font-semibold">{loading ? "…" : 47}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Interview Invites</span>
            <span className="font-semibold text-green-600">{loading ? "…" : 12}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Profile Views</span>
            <span className="font-semibold">{loading ? "…" : 156}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Response Rate</span>
            <span className="font-semibold text-blue-600">{loading ? "…" : "25.5%"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
