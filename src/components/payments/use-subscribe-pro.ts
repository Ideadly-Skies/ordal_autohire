"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import toast from "react-hot-toast";

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

export function useSubscribePro(defaults?: {
  amountIdr?: number;
  itemName?: string;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Load Midtrans Snap script once
  useEffect(() => {
    if (typeof window === "undefined" || window.snap) return;
    const env = process.env.NEXT_PUBLIC_MIDTRANS_ENV ?? "sandbox";
    const src =
      env === "production"
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
    const key = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    if (key) s.setAttribute("data-client-key", key);
    document.body.appendChild(s);
  }, []);

  const start = useCallback(
    async (opts?: { amountIdr?: number; itemName?: string }) => {
      const amountIdr = opts?.amountIdr ?? defaults?.amountIdr ?? 1_790_000;
      const itemName =
        opts?.itemName ?? defaults?.itemName ?? "Pro Plan (Monthly)";

      if (!user?.id) return toast.error("Please log in to upgrade.");
      if (user.plan === "pro") return toast.success("You're already Pro!");
      if (!window.snap)
        return toast.error("Payment module not ready. Refresh the page.");

      setLoading(true);
      const tId = toast.loading("Creating payment…");

      try {
        const orderId = `PRO-${user.id}-${Date.now()}`;
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

        if (!res.ok) throw new Error(await res.text());
        const { token } = await res.json();
        if (!token) throw new Error("No token from server");

        toast.dismiss(tId);

        window.snap!.pay(token, {
          onSuccess: async () => {
            toast.success("Payment successful! Activating Pro…");

            const col =
              user.accountType === "jobseeker" ? "jobseekers" : "jobposters";
            await updateDoc(doc(db, col, user.id), {
              plan: "pro",
              pro_since: serverTimestamp(),
              subscription: {
                provider: "midtrans",
                status: "active",
                order_id: orderId,
              },
            });

            toast.success("Pro plan activated 🎉");
            window.location.reload();
          },
          onPending: () => toast("Payment pending.", { icon: "⏳" }),
          onError: (e) => {
            console.error(e);
            toast.error("Payment failed.");
          },
          onClose: () => toast("Payment popup closed.", { icon: "👋" }),
        });
      } catch (e) {
        console.error(e);
        toast.error("Failed to start payment.");
        toast.dismiss(tId);
      } finally {
        setLoading(false);
      }
    },
    [user, defaults?.amountIdr, defaults?.itemName]
  );

  return { start, loading };
}
