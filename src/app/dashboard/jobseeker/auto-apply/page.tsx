"use client";
import { useCallback, useState } from "react";
import { useAuth } from "@/context/auth-context"; // 👈 add
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { SubscribeProCTAButton } from "@/components/subscribe-pro-cta-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";

// Midtrans snap typing stays the same…
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

type Plan = {
  name: "Free" | "Pro";
  price: string;
  amountIdr?: number;
  cta: string;
  features: string[];
  highlight: "popular" | "recommended";
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    cta: "Get started",
    highlight: "popular",
    features: [
      "Access to ALL job listings",
      "AI-powered job matching",
      "Semi-automatic applications",
      "Up to 3 applications per minute",
      "Advanced ATS optimization",
      "!No priority support",
    ],
  },
  {
    name: "Pro",
    price: "$119",
    amountIdr: 1_790_000,
    cta: "Upgrade to Pro",
    highlight: "recommended",
    features: [
      "Access to ALL job listings",
      "AI-powered job matching",
      "Fully automatic applications",
      "Up to 5 applications per minute",
      "Premium ATS optimization",
      "Priority support",
      "Advanced analytics & insights",
    ],
  },
];

function PlanCard({
  plan,
  onCheckout,
  loadingFor,
}: {
  plan: Plan;
  onCheckout: (p: Plan) => void;
  loadingFor: string | null;
}) {
  const isPlus = plan.name === "Free";
  const ribbon =
    plan.highlight === "popular"
      ? { text: "Most Popular", className: "bg-orange-600 text-white" }
      : { text: "Recommended", className: "bg-teal-600 text-white" };

  const cardBase =
    "relative h-full flex flex-col transition-shadow shadow-sm border-muted-foreground/20";
  const cardStyle = isPlus
    ? `${cardBase} border-2 border-orange-500/70`
    : `${cardBase} bg-teal-900/15 ring-1 ring-teal-700/50`;

  const buttonStyle = isPlus
    ? "bg-orange-600 hover:bg-orange-700"
    : "bg-teal-600 hover:bg-teal-700";

  const disabled = loadingFor === plan.name;

  return (
    <Card className={cardStyle}>
      <Badge
        className={`absolute -top-10 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs ${ribbon.className}`}
      >
        {ribbon.text}
      </Badge>

      <CardHeader className="pt-8">
        <CardTitle className="text-2xl font-semibold text-center">
          {plan.name}
        </CardTitle>
        <div className="text-5xl font-bold text-center mt-2">{plan.price}</div>
        <p className="text-center text-xs text-muted-foreground mt-1">per month</p>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-3 text-sm">
          {plan.features.map((f, i) => {
            const negative = f.startsWith("!");
            const text = negative ? f.slice(1) : f;
            return (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4" aria-hidden />
                <span className={negative ? "text-red-500" : undefined}>{text}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto">
        {plan.name === "Pro" ? (
          <SubscribeProCTAButton
            amountIdr={plan.amountIdr!}
            className={`w-full ${buttonStyle}`}
          >
            {plan.cta}
          </SubscribeProCTAButton>
        ) : (
          <Button
            className={`w-full ${buttonStyle}`}
            disabled={disabled}
            onClick={() => onCheckout(plan)}
          >
            {disabled ? "Processing..." : plan.cta}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function Page() {
  const { user } = useAuth(); // 👈 read plan from auth
  const [loadingFor, setLoadingFor] = useState<string | null>(null);

  const checkout = useCallback(async (plan: Plan) => {
    try {
      if (plan.name === "Free") {
        console.log("Activated Free plan");
        return;
      }
      if (!window.snap) {
        alert("Payment module not ready. Please refresh the page.");
        return;
      }
      if (!plan.amountIdr) {
        alert("Missing price for this plan.");
        return;
      }
      setLoadingFor(plan.name);

      const res = await fetch("/api/midtrans/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: `PRO-${Date.now()}`,
          amount: plan.amountIdr,
          customer: {
            first_name: user?.displayName || "User",
            email: user?.email,
            phone: user?.phone || "",
          },
          items: [
            {
              id: "pro-subscription",
              price: plan.amountIdr,
              quantity: 1,
              name: "Pro Plan (Monthly)",
            },
          ],
        }),
      });

      const { token } = await res.json();
      if (!token) throw new Error("No token from server");

      window.snap!.pay(token, {
        onSuccess: async (result) => {
          console.log("✅ Success", result);
          // upgrade handled by your Snap success flow/hook if you wired it
        },
        onPending: (r) => console.log("⏳ Pending", r),
        onError: (e) => {
          console.error("❌ Error", e);
          alert("Payment failed. Please try again.");
        },
        onClose: () => console.warn("Popup closed by user"),
      });
    } catch (e) {
      console.error(e);
      alert("Failed to start payment.");
    } finally {
      setLoadingFor(null);
    }
  }, [user]);

  // ✅ If already Pro, show the simple message instead of pricing cards
  if (user?.plan === "pro") {
    return (
      <main className="mx-auto max-w-3xl h-full px-4 py-16">
        <Card className="border-2 border-yellow-500/70 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader className="text-center">
            <Crown className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
            <CardTitle className="text-2xl">Congrats — you’re a Pro user!</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Start using the Ordal chatbot now to auto-apply and get premium features.
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700">
              Open Ordal Chatbot
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  // Default (not Pro): show landing + pricing
  return (
    <main className="mx-auto max-w-6xl h-full px-4 py-16">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* LEFT */}
        <section className="space-y-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            Try Auto Apply
          </h1>
          <p className="text-muted-foreground max-w-prose">
            Our system matches your skills with openings and submits applications instantly.
          </p>
          <Button size="lg" className="px-8" onClick={() => checkout(plans[0])}>
            Get Started
          </Button>
        </section>

        {/* RIGHT */}
        <section className="space-y-6">
          <Card className="border-muted-foreground/20 bg-muted p-6 shadow-sm max-w-3xl w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-center">Choose Your Plan</CardTitle>
              <p className="text-md text-muted-foreground text-center">
                Start free with manual applications, or upgrade for AI-powered auto apply.
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 grid-cols-1">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.name}
                    plan={plan}
                    onCheckout={checkout}
                    loadingFor={loadingFor}
                  />
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 text-xs text-muted-foreground" />
          </Card>
        </section>
      </div>
    </main>
  );
}
