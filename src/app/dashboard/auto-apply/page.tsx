'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react";
import { File } from 'lucide-react';
import { Shell } from 'lucide-react';
import { Zap } from 'lucide-react';

type Plan = {
  name: string;
  price: string;
  cta: string;
  features: string[];
  highlight?: "popular" | "recommended";
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    cta: "Get Started",
    features: [
      "Access to most job listings",
      "Jobs tailored to your CV",
      "Manual application required",
      "No automatic job matching"
    ],
  },

  {
    name: "Plus",
    price: "$79",
    cta: "Choose Plus",
    highlight: "popular",
    features: [
      "Access to ALL job listings",
      "AI-powered job matching",
      "Semi-automatic applications",
      "Up to 3 applications per minute",
      "Advanced ATS optimization",
      "No priority support"
    ],
  },

  {
    name: "Pro",
    price: "$119",
    cta: "Choose Pro",
    highlight: "recommended",
    features: [
      "Access to ALL job listings",
      "AI-powered job matching",
      "Fully automatic applications",
      "Up to 5 applications per minute",
      "Premium ATS optimization",
      "Priority support",
      "Advanced analytics & insights"
    ],
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  const ribbon =
    plan.highlight === "popular" ? { text: "Most Popular", color: "bg-orange-600 text-white" } : plan.highlight === "recommended" ? { text: "Recommended", color: "bg-teal-600 text-white" } : null;

  return (
    <Card className="relative h-full flex flex-col border-muted-foreground/20 shadow-sm">
      {ribbon && (
        <Badge className={`absolute -top-3 left-14 rounded-full px-3 py-1 text-xs ${ribbon.color}`}>
          {ribbon.text}
        </Badge>
      )}


      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">{plan.name}</CardTitle>
        <div className="text-3xl font-bold text-center">{plan.price}</div>
      </CardHeader>


      <CardContent className="flex-1">
        <ul className="space-y-2 text-sm">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4" aria-hidden />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </CardContent>


      <CardFooter className="mt-auto">
        <Button
          variant={plan.highlight ? "default" : "secondary"}
          className={`w-full ${plan.name === "Free"
              ? "hover:!bg-secondary"
              : plan.name === "Plus"
                ? "hover:!bg-orange-600"
                : "hover:!bg-teal-600"
            }`}
        >
          {plan.cta}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl h-full px-4 py-16">
      <div className="grid items-center gap-12 md:grid-cols-2">

        <section className="space-y-6">
          <h1 className="text-6xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Try Auto Apply
          </h1>
          <p className="text-muted-foreground max-w-prose">
            Our system matches your skills with openings and submits applications instantly.
          </p>
          <Button size="lg" className="px-8">Get Started</Button>
        </section>

        <section>
          <Card className="border-muted-foreground/20 bg-muted p-6 shadow-sm max-w-3xl w-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-center">Choose Your Plan</CardTitle>
              <p className="text-md text-muted-foreground text-center">
                Start free with manual applications, or upgrade for AI‑powered auto apply.
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                  <PlanCard key={plan.name} plan={plan} />
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 text-xs text-muted-foreground">
              <h1 className="text-2xl text-black/70 dark:text-white mb-4">Why Upgrade from Free?</h1>
              <div className="flex flex-row gap-4 w-xl p-1">
                <div className="flex items-center gap-2">
                  <File className="text-black dark:text-white" />
                  <span className="rounded-full bg-foreground/70" />
                  Be ready when the perfect role goes live
                </div>
                <div className="flex items-center gap-2">
                  <Shell className="text-black dark:text-white" />
                  <span className="rounded-full bg-foreground/70" />
                  More application = more interviews
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="text-black dark:text-white" />
                  <span className="rounded-full bg-foreground/70" />
                  Job openings fill fast, timing matters
                </div>
              </div>

            </CardFooter>

          </Card>
        </section>
      </div>
    </main>
  );
}
