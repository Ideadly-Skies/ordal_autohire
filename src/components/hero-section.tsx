import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import AvatarGroup from "./avatar-group";
import { Badge } from "./ui/badge";
import { UploadButton } from "./upload-button";

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
    <main className="overflow-hidden">
      {/* background shape */}
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden contain-strict lg:block"
      >
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      <section>
        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-center min-h-screen px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-10 pb-8 lg:pb-0">
          <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>

          {/* text heading */}
          <div className="flex-1 flex items-center justify-center lg:justify-start w-full lg:w-3/5 text-center lg:text-left">
            <div className="lg:mr-auto w-full max-w-2xl">
              <div>
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="max-w-2xl tracking-tight text-4xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-6xl font-bold"
                >
                  Land More Interviews
                </TextEffect>
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="max-w-2xl tracking-tight text-4xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-6xl font-bold"
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
                className="mt-6 sm:mt-8 max-w-2xl text-pretty text-base sm:text-lg lg:text-lg"
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
                className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5"
              >
                <UploadButton />
                <AvatarGroup />
              </AnimatedGroup>
            </div>
          </div>

          {/* Gambar */}
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
            className=" hidden lg:flex items-center justify-end w-2/5 h-full"
          >
            <div className="relative w-full max-w-xl bg-gradient-to-t from-blue-500/60 to-blue-50 rounded-2xl">
              <Image
                src={"/young-business-woman.webp"}
                alt="Hero Image"
                width={1000}
                height={1000}
                className="w-full h-auto -mt-6 sm:-mt-8 lg:-mt-10 aspect-square object-contain"
              />

              <Badge className="px-3 sm:px-4 lg:px-5 py-1 absolute top-6 sm:top-8 lg:top-10 -left-8 sm:-left-10 lg:-left-10 bg-blue-400 border rounded-full flex flex-col gap-0 items-start text-white">
                <h3 className="font-semibold text-xs sm:text-sm">
                  Admin Accountant
                </h3>
                <p className="text-[9px] sm:text-[10px] opacity-80">
                  Full-time
                </p>
              </Badge>

              <Badge className="px-3 sm:px-4 lg:px-5 py-1 absolute bottom-8 sm:bottom-10 lg:bottom-12 -right-6 sm:-right-8 lg:-right-10 bg-green-600 border rounded-full flex flex-col gap-0 items-start text-white">
                <h3 className="font-semibold text-xs">Software Engineer</h3>
                <p className="text-[9px] sm:text-[10px] opacity-80">
                  Full-time
                </p>
              </Badge>

              <Badge className="px-3 sm:px-4 lg:px-5 py-1 absolute bottom-16 sm:bottom-18 lg:bottom-20 left-2 sm:left-3 lg:left-4 bg-orange-600 border rounded-full flex flex-col gap-0 items-start text-white">
                <h3 className="font-semibold text-xs">Front-End Developer</h3>
                <p className="text-[9px] sm:text-[10px] opacity-80">Remote</p>
              </Badge>
            </div>
          </AnimatedGroup>
        </div>
      </section>
    </main>
  );
}
