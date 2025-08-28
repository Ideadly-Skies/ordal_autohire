// src/components/profile-content.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJobseeker } from "@/lib/profile";
import { Jobseeker } from "@/lib/jobseeker";
import { useAuth } from "@/context/auth-context";

export default function ProfileContent() {
  const { user, isLoading } = useAuth();

  const DEFAULT_USER_ID = user?.id || "";
  const [data, setData] = useState<Jobseeker | null>(null);
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    let on = true;
    fetchJobseeker(DEFAULT_USER_ID).then((d) => {
      if (on) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      on = false;
    };
  }, []);

  const about = useMemo(() => {
    if (!data) return "";
    // Prefer resume_summary; fallback to background_info.summary
    return data.resume_summary || data.background_info?.summary || "";
  }, [data]);

  const skills = data?.skills ?? [];
  const interests = data?.background_info?.interests ?? [];
  const name = `${data?.personal_info?.first_name ?? ""} ${
    data?.personal_info?.last_name ?? ""
  }`.trim();

  return (
    <div className="flex-1">
      <div className="space-y-5">
        {/* About Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-1 lg:pb-2">
            <CardTitle className="text-xl lg:text-2xl font-semibold">
              {loading ? (
                <Skeleton className="h-8 w-48" />
              ) : name ? (
                `About ${name}`
              ) : (
                "About"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {about || "No summary yet."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 lg:pb-3">
            <CardTitle className="text-lg lg:text-xl font-medium">
              {loading ? <Skeleton className="h-7 w-24" /> : "Skills"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-28" />
              </div>
            ) : skills.length ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="px-3 py-1 text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                No skills yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interests Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 lg:pb-3">
            <CardTitle className="text-lg lg:text-xl font-medium">
              {loading ? <Skeleton className="h-7 w-32" /> : "Interests"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            ) : interests.length ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="px-3 py-1 text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                No interests yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 lg:pb-3">
            <CardTitle className="text-lg lg:text-xl font-medium">
              {loading ? <Skeleton className="h-7 w-40" /> : "Recent Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                Activity feed not wired yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
