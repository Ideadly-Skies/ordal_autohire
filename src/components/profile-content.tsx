// src/app/dashboard/jobseeker/profile-content.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import type { Jobseeker } from "@/lib/jobseeker";

import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    });
const db = getFirestore(app);

export default function ProfileContent() {
  const { user } = useAuth();
  const uid = user?.id ?? ""; // or user?.uid depending on your context

  const [data, setData] = useState<Jobseeker | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔴 remove the one-time fetch; use a live listener instead
  useEffect(() => {
    if (!uid) return;

    setLoading(true);
    const unsub = onSnapshot(
      doc(db, "jobseekers", uid),
      (snap) => {
        setData((snap.data() as Jobseeker) ?? null);
        console.log(`snap data from profile content: ${snap.data()}`);
        setLoading(false);
      },
      (err) => {
        console.error("profile onSnapshot error", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  const about = useMemo(
    () =>
      data ? data.resume_summary || data.background_info?.summary || "" : "",
    [data]
  );
  const skills = data?.skills ?? [];
  const interests = data?.background_info?.interests ?? [];
  const name = `${data?.personal_info?.first_name ?? ""} ${
    data?.personal_info?.last_name ?? ""
  }`.trim();

  return (
    <div className="flex-1">
      <div className="space-y-6">
        {/* About */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              {loading ? (
                <Skeleton className="h-7 w-48" />
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                {about || "No information added yet."}
              </p>
            )}
          </CardContent>
        </Card>
        {/* Skills */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
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
              <p className="text-sm text-muted-foreground">
                No information added yet.
              </p>
            )}
          </CardContent>
        </Card>
        {/* Interests */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
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
              <p className="text-sm text-muted-foreground">
                No information added yet.
              </p>
            )}
          </CardContent>
        </Card>
        {/* Recent Activity
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
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
              <p className="text-sm text-muted-foreground">
                No information added yet.
              </p>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
