"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        handlers?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (error: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

type SubscribeProButtonProps = {
  /** Price you charge in IDR (gross_amount) */
  amountIdr?: number;           // default 1,790,000
  /** Human-facing item name sent to Midtrans */
  itemName?: string;            // default "Pro Plan (Monthly)"
};

export function SubscribeProButton({
  amountIdr = 1_790_000,
  itemName = "Pro Plan (Monthly)",
}: SubscribeProButtonProps) {
  const { user } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);

  // --- Load Midtrans Snap script once on the client ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.snap) return; // already loaded

    const env = process.env.NEXT_PUBLIC_MIDTRANS_ENV ?? "sandbox";
    const src =
      env === "production"
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    if (!clientKey) {
      console.warn("NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is not set");
    }

    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    if (clientKey) s.setAttribute("data-client-key", clientKey);
    document.body.appendChild(s);

    // do not remove the script on unmount so other pages can reuse it
  }, []);

  const handleUpgradeToPro = async () => {
    if (!user?.id) {
      toast.error("Please log in to upgrade.");
      return;
    }
    if (user.plan === "pro") {
      toast.success("You're already on the Pro plan!");
      return;
    }
    if (!window.snap) {
      toast.error("Payment module not ready. Please refresh the page.");
      return;
    }

    setIsUpgrading(true);
    const loadingToast = toast.loading("Creating payment…");

    try {
      // 1) Ask backend for a Snap token
      const orderId = `PRO-${user.id}-${Date.now()}`; // unique
      const res = await fetch("/api/midtrans/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: amountIdr,
          customer: {
            first_name: user.displayName || "User",
            email: user.email,
            phone: user.phone || "",
          },
          items: [
            {
              id: "pro-subscription",
              price: amountIdr,
              quantity: 1,
              name: itemName,
            },
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to get token: ${err}`);
      }

      const { token } = await res.json();
      if (!token) throw new Error("No token returned by server");

      toast.dismiss(loadingToast);

      // 2) Open the Snap popup
      window.snap!.pay(token, {
        onSuccess: async (result) => {
          toast.success("Payment successful! Activating Pro…");

          // 3) Mark user as Pro in Firestore
          const collectionName =
            user.accountType === "jobseeker" ? "jobseekers" : "jobposters";
          const userRef = doc(db, collectionName, user.id);

          await updateDoc(userRef, {
            plan: "pro",
            pro_since: serverTimestamp(),
            subscription: {
              provider: "midtrans",
              status: "active",
              order_id: orderId,
              // Persist raw result if you want:
              // last_payment_result: result,
            },
          });

          toast.success("Pro plan activated 🎉");
          // Optional: refresh UI
          window.location.reload();
        },
        onPending: () => {
          toast("Payment is pending. You can complete it later.", {
            icon: "⏳",
          });
        },
        onError: (error) => {
          console.error("Midtrans error:", error);
          toast.error("Payment failed. Please try again.");
        },
        onClose: () => {
          toast("Payment popup closed.", { icon: "👋" });
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to start payment. Please try again.");
      toast.dismiss(loadingToast);
    } finally {
      setIsUpgrading(false);
    }
  };

  // Already Pro → show status card
  if (user?.plan === "pro") {
    return (
      <Card className="border-2 border-yellow-500/70 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6 text-center">
          <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-1">
            Pro Plan Active
          </h3>
          <p className="text-sm text-yellow-600">
            You&apos;re enjoying all Pro features!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Paywall CTA → triggers real Midtrans checkout
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
          {isUpgrading ? "Processing…" : "Upgrade to Pro"}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Secure payment via Midtrans Snap.
        </p>
      </CardContent>
    </Card>
  );
}
