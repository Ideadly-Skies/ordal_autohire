// src/hooks/use-profile-tracking.ts
"use client";

import { useEffect } from "react";
import { incrementProfileViews } from "@/lib/stats";

/**
 * Hook to track profile views for jobseekers
 * Call this hook on any page that displays a jobseeker's profile
 * @param userId - The jobseeker's user ID
 * @param enabled - Whether to track the view (default: true)
 */
export function useProfileTracking(
  userId: string | null,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!userId || !enabled) return;

    // Track the profile view
    incrementProfileViews(userId);
  }, [userId, enabled]);
}

export default useProfileTracking;
