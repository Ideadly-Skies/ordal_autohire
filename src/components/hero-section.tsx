import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";
import AvatarGroup from "./avatar-group";
import { Badge } from "./ui/badge";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative max-w-6xl mx-auto flex gap-10 items-center h-screen pt-10">
            <div className="  absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="flex items-center justify-center w-2/3">
              <div className=" lg:mr-auto lg:mt-0">
                <div>
                  <TextEffect
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h1"
                    className=" max-w-2xl text-balance text-3xl font-medium md:text-6xl"
                  >
                    Land More Interviews
                  </TextEffect>
                  <TextEffect
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h1"
                    className="max-w-2xl text-balance text-5xl font-medium md:text-6xl"
                  >
                    In Less Time.
                  </TextEffect>
                </div>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mt-8 max-w-2xl text-pretty text-lg"
                >
                  Access 1M+ unique job posts and AI-powered tools to accelerate
                  your path to senior roles.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex items-center gap-5"
                >
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-full border p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full px-10 text-base"
                    >
                      <Link href="/upload" className="flex items-center gap-2">
                        <span className="text-nowrap">Start now for free</span>
                        <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                  <AvatarGroup />
                </AnimatedGroup>
              </div>
            </div>
            <div className=" rounded-2xl mr-5 relative w-1/2 bg-gradient-to-t from-blue-500/60 to-blue-500/5">
              <Image
                src={"/young-business-woman.webp"}
                alt="Hero Image"
                width={1000}
                height={1000}
                className="w-ffull h-auto -mt-10 aspect-square object-contain"
              />

              <Badge className="px-5 py-1 absolute top-10 -left-14 bg-blue-400 border rounded-full flex flex-col gap-0 items-start">
                <h3 className="font-semibold text-sm">Admin Accountant</h3>
                <p className="text-[10px] opacity-80">Full-time</p>
              </Badge>
              <Badge className="px-5 py-1 absolute bottom-12 -right-10 bg-green-600 border rounded-full flex flex-col gap-0 items-start">
                <h3 className="font-semibold text-xs">Software Enginer</h3>
                <p className="text-[10px] opacity-80">Full-time</p>
              </Badge>
              <Badge className="px-5 py-1 absolute bottom-20 left-4 bg-orange-600 border rounded-full flex flex-col gap-0 items-start">
                <h3 className="font-semibold text-xs">Front-End Developer</h3>
                <p className="text-[10px] opacity-80">Remote</p>
              </Badge>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
