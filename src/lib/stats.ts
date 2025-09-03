// src/lib/stats.ts
import { db } from "@/config/firebase";
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";

/**
 * Increment profile views for a jobseeker
 * @param userId - The jobseeker's user ID
 */
export async function incrementProfileViews(userId: string): Promise<void> {
  try {
    const userRef = doc(db, "jobseekers", userId);

    // Check if document exists first
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(userRef, {
        profile_views: increment(1),
        last_viewed_at: new Date(),
        updated_at: new Date(),
      });
    } else {
      // Create document with initial view count
      await setDoc(
        userRef,
        {
          profile_views: 1,
          last_viewed_at: new Date(),
          updated_at: new Date(),
        },
        { merge: true }
      );
    }

    console.log(`Profile views incremented for user: ${userId}`);
  } catch (error) {
    console.error("Error incrementing profile views:", error);
  }
}

/**
 * Get quick stats for a jobseeker
 * @param userId - The jobseeker's user ID
 */
export async function getJobseekerStats(userId: string): Promise<{
  applicationsSent: number;
  interviewInvites: number;
  responseRate: string;
}> {
  try {
    // This is already implemented in the component, but keeping it here for reusability
    const { collection, query, getDocs } = await import("firebase/firestore");

    // Get jobs applied
    const jobsAppliedRef = collection(db, "jobseekers", userId, "jobs_applied");
    const jobsAppliedSnapshot = await getDocs(jobsAppliedRef);

    const applicationsSent = jobsAppliedSnapshot.size;
    let interviewInvites = 0;

    // Count interview invites
    jobsAppliedSnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.status === "interview" ||
        data.status === "interviewing" ||
        data.status === "interview_scheduled"
      ) {
        interviewInvites++;
      }
    });

    // Calculate response rate
    const responseRate =
      applicationsSent > 0
        ? `${((interviewInvites / applicationsSent) * 100).toFixed(1)}%`
        : "0%";

    return {
      applicationsSent,
      interviewInvites,
      responseRate,
    };
  } catch (error) {
    console.error("Error fetching jobseeker stats:", error);
    return {
      applicationsSent: 0,
      interviewInvites: 0,
      responseRate: "0%",
    };
  }
}
