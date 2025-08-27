// src/components/profile-content.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchJobseeker } from "@/lib/profile";
import { Jobseeker } from "@/lib/jobseeker";

const DEFAULT_USER_ID = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || "USER_001";

export default function ProfileContent() {
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

  const about = useMemo(() => {
    if (!data) return "";
    // Prefer resume_summary; fallback to background_info.summary
    return data.resume_summary || data.background_info?.summary || "";
  }, [data]);

  const skills = data?.skills ?? [];
  const interests = data?.background_info?.interests ?? [];
  const name = `${data?.personal_info?.first_name ?? ""} ${data?.personal_info?.last_name ?? ""}`.trim();

  return (
    <div className="flex-1">
      <div className="space-y-5">
        {/* About Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-1 lg:pb-2">
            <CardTitle className="text-xl lg:text-2xl font-semibold">
              {loading ? "About" : name ? `About ${name}` : "About"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {loading ? "Loading profile…" : (about || "No summary yet.")}
            </p>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 lg:pb-3">
            <CardTitle className="text-lg lg:text-xl font-medium">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-xs text-muted-foreground">Loading…</div>
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
              <div className="text-xs text-muted-foreground">No skills yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Interests (from background_info) */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 lg:pb-3">
            <CardTitle className="text-lg lg:text-xl font-medium">Interests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-xs text-muted-foreground">Loading…</div>
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
              <div className="text-xs text-muted-foreground">No interests yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity – placeholder */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 lg:pb-3">
            <CardTitle className="text-lg lg:text-xl font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Activity feed not wired yet.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
