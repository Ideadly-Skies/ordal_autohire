"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import React from "react";

const STEPS = [
    "/guide-about1.png",
    "/guide-about2.png",
    "/guide-about3.png",
    "/guide-about4.png",
    "/guide-about5.png",
] as const;

export default function GuideSlide() {
    const [index, setIndex] = React.useState(0);
    const total = STEPS.length;
    const progress = Math.round(((index + 1) / total) * 100);

    const next = () => setIndex((i) => Math.min(i + 1, total - 1));
    const prev = () => setIndex((i) => Math.max(i - 1, 0));

    return (
        <section className="mx-auto max-w-4xl px-4 py-10">
            <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight text-sky-400">
                How to Apply
            </h2>
            <div className="rounded-2xl border bg-card/50 p-4 shadow-sm">
                <div className="rounded-xl bg-muted p-2">
                    <Image
                        src={STEPS[index]}
                        alt={`Step ${index + 1}`}
                        width={500}
                        height={300}
                        className="w-full rounded-lg object-cover"
                    />
                </div>
            </div>
            <div className="mt-4">
                <Progress value={progress} className="h-2" />
                <div className="mt-1 text-center text-xs text-muted-foreground">
                    {`Step ${index + 1} of ${total} • ${progress}%`}
                </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
                <Button
                    variant="secondary"
                    onClick={prev}
                    disabled={index === 0}
                    aria-label="Previous step"
                >
                    Prev
                </Button>
                <Button
                    onClick={next}
                    disabled={index === total - 1}
                    aria-label="Next step"
                >
                    Next
                </Button>
            </div>
        </section>
    )
}