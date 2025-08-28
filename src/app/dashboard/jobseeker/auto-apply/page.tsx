'use client'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

type Plan = {
  name: "Free" | "Pro";
  price: string;
  cta: string;
  features: string[];     // prefix with "!" to render a red “negative” item
  highlight: "popular" | "recommended";
}

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

function PlanCard({ plan }: { plan: Plan }) {
  const isPlus = plan.name === "Free";
  const isPro = plan.name === "Pro";

  const ribbon =
    plan.highlight === "popular"
      ? { text: "Most Popular", className: "bg-orange-600 text-white" }
      : { text: "Recommended", className: "bg-teal-600 text-white" };

  // visual styles per card (match screenshot #2 while fitting your dark theme)
  const cardBase =
    "relative h-full flex flex-col transition-shadow shadow-sm border-muted-foreground/20";
  const cardStyle = isPlus
    ? `${cardBase} border-2 border-orange-500/70`
    : `${cardBase} bg-teal-900/15 ring-1 ring-teal-700/50`;

  const buttonStyle = isPlus
    ? "bg-orange-600 hover:bg-orange-700"
    : "bg-teal-600 hover:bg-teal-700";

  return (
    <Card className={cardStyle}>
      <Badge
        className={`absolute -top-10 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs ${ribbon.className}`}
      >
        {ribbon.text}
      </Badge>

      <CardHeader className="pt-8">
        <CardTitle className="text-2xl font-semibold text-center">{plan.name}</CardTitle>
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
        <Button className={`w-full ${buttonStyle}`}>{plan.cta}</Button>
      </CardFooter>
    </Card>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl h-full px-4 py-16">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* LEFT: keep hero aesthetics from screenshot #1 */}
        <section className="space-y-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            Try Auto Apply
          </h1>
          <p className="text-muted-foreground max-w-prose">
            Our system matches your skills with openings and submits applications instantly.
          </p>
          <Button size="lg" className="px-8">Get Started</Button>
        </section>

        {/* RIGHT: container styled like screenshot #2 */}
        <section>
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
                  <PlanCard key={plan.name} plan={plan} />
                ))}
              </div>
            </CardContent>

            {/* Quiet footer to preserve spacing (no extras, per screenshot #1 vibe) */}
            <CardFooter className="flex flex-col gap-3 text-xs text-muted-foreground" />
          </Card>
        </section>
      </div>
    </main>
  );
}
