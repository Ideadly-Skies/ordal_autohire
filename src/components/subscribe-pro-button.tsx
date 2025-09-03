"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

export function SubscribeProButton() {
  const { user } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgradeToPro = async () => {
    if (!user?.id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    if (user.plan === "pro") {
      toast.success("You're already on the Pro plan!");
      return;
    }

    setIsUpgrading(true);
    const loadingToast = toast.loading("Upgrading to Pro plan...");

    try {
      // Determine collection based on account type
      const collectionName =
        user.accountType === "jobseeker" ? "jobseekers" : "jobposters";
      const userRef = doc(db, collectionName, user.id);

      // Update user plan to pro
      await updateDoc(userRef, {
        plan: "pro",
      });

      toast.success("Successfully upgraded to Pro plan! 🎉", {
        id: loadingToast,
      });

      // Refresh the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error upgrading to Pro:", error);
      toast.error("Failed to upgrade plan. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  // Don't show button if user is already pro
  if (user?.plan === "pro") {
    return (
      <Card className="border-2 border-yellow-500/70 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6 text-center">
          <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-1">
            Pro Plan Active
          </h3>
          <p className="text-sm text-yellow-600">
            You're enjoying all Pro features!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-500/70 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-6 text-center">
        <Crown className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Upgrade to Pro Plan
        </h3>
        <p className="text-sm text-blue-600 mb-4">
          Unlock automatic job applications and advanced features instantly!
        </p>
        <Button
          onClick={handleUpgradeToPro}
          disabled={isUpgrading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isUpgrading ? (
            "Upgrading..."
          ) : (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Subscribe to Pro (Free Demo)
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          * Demo mode - No payment required
        </p>
      </CardContent>
    </Card>
  );
}
