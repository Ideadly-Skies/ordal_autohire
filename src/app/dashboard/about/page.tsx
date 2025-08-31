import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
    Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel"
import { Clock, BrainCircuit, ScrollText } from "lucide-react"
import GuideSlide from "./guideslide";

const benefits = [
    {
        icon: Clock,
        title: "Save Time & Effort",
        body:
            "No need to apply manually every day. Our system automatically matches and submits applications on your behalf.",
    },
    {
        icon: BrainCircuit,
        title: "Smarter Job Matching",
        body:
            "AI tailors each application to your skills, experience, and preferences—raising your chances of interviews.",
    },
    {
        icon: ScrollText,
        title: "ATS Optimization",
        body:
            "Your CV and applications are formatted to pass ATS so recruiters actually see your profile.",
    },
]
const members = [
    { src: "/saki.png", name: "Saki", role: "leader" },
    { src: "/kotone.png", name: "Kotone", role: "member" },
    { src: "/temari.png", name: "Temari", role: "member" },
    { src: "/rinami.png", name: "Rinami", role: "member" },
    { src: "/ume.png", name: "Ume", role: "member" },
]

export default function AboutPage() {
    return (
        <main>
            <section className="relative w-full overflow-hidden">
                <Image
                    src="/about-header.jpg" alt="About Auto-Apply"
                    width={2400} height={1000}
                    className="h-[360px] w-full object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <h1 className="text-white text-2xl md:text-5xl font-semibold tracking-wide uppercase my-4">
                        About Auto-Apply
                    </h1>
                    <p className="mt-3 max-w-xl text-white/90 text-md leading-relaxed">
                        Auto-Apply is an AI-powered job search platform built to simplify the job-seeking journey.
                        By using intelligent resume matching, our system helps users connect with the right job opportunities
                        based on their skills and experience.
                    </p>
                </div>
            </section>

            <section className=" bg-sky-200 dark:bg-slate-900 py-8 shadow-sm">
                <h2 className="text-center text-3xl font-semibold tracking-tight text-sky-400 dark:text-emerald-600">Benefits</h2>
                <br />
                <div className="mx-auto max-w-6xl h-42 grid grid-cols-1 gap-10 px-4 sm:grid-cols-3">
                    {benefits.map((B, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <B.icon className="size-8 text-slate-700 dark:text-amber-500" aria-hidden />
                            <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-white">{B.title}</h3>
                            <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-700/80 dark:text-white">{B.body}</p>
                        </div>
                    ))}
                </div>
            </section>
            <GuideSlide />
            <section className="px-4 py-10 bg-muted">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-center text-3xl font-semibold tracking-tight text-sky-400 dark:text-emerald-600">Foco Team</h2>
                    <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-full max-w-[260px]">
                                <Carousel opts={{ align: "start", loop: true }}>
                                    <CarouselContent className="-ml-4">
                                        {members.map((m, i) => (
                                            <CarouselItem key={i} className="pl-4 basis-full">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-full rounded-2xl bg-sky-200 dark:bg-emerald-600 p-1">
                                                        <Image
                                                            src={m.src}
                                                            alt={m.name}
                                                            width={256}
                                                            height={256}
                                                            className="aspect-square w-full rounded-xl object-cover"
                                                        />
                                                    </div>
                                                    <div className="mt-2 flex flex-col items-center gap-1">
                                                        <p className="text-sm font-medium text-slate-800 dark:text-white">{m.name}</p>
                                                        {m.role === "leader" ? (
                                                            <Badge className="bg-amber-500 text-white dark:text-white dark:bg-emerald-600">Leader</Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="dark:bg-amber-500 dark:text-emerald-700">Member</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>

                            <p className="mt-6 max-w-md text-center text-sm leading-relaxed text-slate-700 dark:text-white">
                                We’re a small but passionate team of five developers currently training at Hacktiv8. Our mission
                                is to empower job seekers with smart tools that remove friction from the hiring process. We believe
                                technology—especially AI—can make job searching smarter, faster, and more accessible for everyone.
                                Together, we’re building a platform that reflects real-world hiring needs, guided by empathy,
                                transparency, and continuous learning.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Image
                                src="/team.jpg"
                                alt="Team"
                                width={640}
                                height={480}
                                className="w-full max-w-[520px] rounded-2xl object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}