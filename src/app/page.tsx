import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  Star,
  Users,
  Briefcase,
  Target,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  Quote,
} from "lucide-react";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div>
      <HeroHeader />
      <HeroSection />
      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                500K+
              </div>
              <div className="text-sm text-muted-foreground">
                Automatic Applications Sent
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                25K+
              </div>
              <div className="text-sm text-muted-foreground">
                AI-Matched Job Placements
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                98%
              </div>
              <div className="text-sm text-muted-foreground">ATS Pass Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                5/day
              </div>
              <div className="text-sm text-muted-foreground">
                Auto-Apply Limit (Pro)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              AI-Powered Automatic Job Applications
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Let our AI chatbot handle job applications for you. Automatic ATS
              screening, keyword matching, and intelligent job filtering - all
              powered by advanced AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Automatic Job Applications
                </h3>
                <p className="text-muted-foreground">
                  Our AI chatbot automatically applies to jobs on your behalf,
                  with intelligent filtering and up to 5 applications per day
                  for Pro users.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  ATS Resume Screening
                </h3>
                <p className="text-muted-foreground">
                  Automatic ATS checker scans your resume for inconsistencies
                  and errors, ensuring your applications pass employer screening
                  systems.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  AI Chatbot Assistant
                </h3>
                <p className="text-muted-foreground">
                  Get instant answers and guidance throughout your job search
                  journey with our intelligent AI chatbot assistant.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Smart Candidate Matching
                </h3>
                <p className="text-muted-foreground">
                  Job posters get AI-computed match scores for all applicants,
                  helping identify the best candidates based on skills and
                  requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Keyword-Based Job Filtering
                </h3>
                <p className="text-muted-foreground">
                  Advanced keyword matching filters jobs from our pool using
                  credible API sources, ensuring relevant opportunities for your
                  skills.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Flexible Pricing Tiers
                </h3>
                <p className="text-muted-foreground">
                  Choose between Free (manual applications) or Pro (automatic
                  applications) for job seekers, with enhanced features for job
                  posters.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and let our AI chatbot handle your job
              applications automatically with intelligent screening and
              matching.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Upload & Screen Your Resume
              </h3>
              <p className="text-muted-foreground">
                Upload your resume and our automatic ATS checker will scan for
                inconsistencies and errors, ensuring it passes employer
                screening systems.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                AI Filters & Matches Jobs
              </h3>
              <p className="text-muted-foreground">
                Our AI filters jobs from credible sources using keyword matching
                with your resume, presenting only the most relevant
                opportunities.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Automatic Applications
              </h3>
              <p className="text-muted-foreground">
                Choose between manual applications (Free) or let our AI chatbot
                automatically apply to up to 5 jobs per day (Pro).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how professionals like you have transformed their careers with
              Ordal AutoHire.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border bg-card">
              <CardContent className="p-6 space-y-4">
                <Quote className="w-8 h-8 text-primary" />
                <p className="text-muted-foreground italic">
                  &quot;I landed 5 interviews in my first week using Ordal AutoHire&apos;s
                  automatic application feature. The AI chatbot handled
                  everything while I focused on interview preparation.&quot;
                </p>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/professional-headshot.png" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-card-foreground">
                      Sarah Martinez
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Software Engineer at Google
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6 space-y-4">
                <Quote className="w-8 h-8 text-primary" />
                <p className="text-muted-foreground italic">
                  &quot;The ATS checker found errors in my resume I never noticed.
                  After fixing them, I started getting more callbacks. The Pro
                  plan&apos;s automatic applications saved me hours every day.&quot;
                </p>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/tech-professional.png" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-card-foreground">
                      Michael Johnson
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Product Manager at Microsoft
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6 space-y-4">
                <Quote className="w-8 h-8 text-primary" />
                <p className="text-muted-foreground italic">
                  &quot;As a job poster, the Pro plan&apos;s candidate matching scores
                  helped me identify the perfect candidate from 200+ applicants.
                  The AI-computed match percentages were incredibly accurate.&quot;
                </p>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/diverse-business-professionals.png" />
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-card-foreground">
                      Alex Liu
                    </div>
                    <div className="text-sm text-muted-foreground">
                      HR Director at TechCorp
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Ordal AutoHire and how it can
              accelerate your career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                How does the automatic job application work?
              </h3>
              <p className="text-muted-foreground">
                Our AI chatbot analyzes your resume, screens it through our ATS
                checker, and automatically applies to filtered jobs that match
                your skills. Pro users can apply to up to 5 jobs per day.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                What&apos;s the difference between Free and Pro plans?
              </h3>
              <p className="text-muted-foreground">
                Free users get access to most job listings but must apply
                manually. Pro users get automatic applications, AI job
                tailoring, and unlimited access to all features.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                How does the ATS checker work?
              </h3>
              <p className="text-muted-foreground">
                Our automatic ATS checker scans your resume for inconsistencies,
                formatting errors, and keyword optimization to ensure it passes
                employer screening systems.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                How are job matches calculated?
              </h3>
              <p className="text-muted-foreground">
                We use keyword matching between your resume and job
                descriptions, combined with AI-computed skills analysis to
                provide accurate match percentages for both job seekers and job
                posters.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                What features do job posters get?
              </h3>
              <p className="text-muted-foreground">
                Job posters get a dashboard with posting forms and candidate
                views. Free users see top 5 matches only, while Pro users see
                all applicants sorted by AI-computed match scores.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Is there a rate limit for automatic applications?
              </h3>
              <p className="text-muted-foreground">
                Yes, automatic applications are limited to 5 roles per day to
                ensure quality applications and prevent spam. The limit resets
                every 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 lg:p-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground text-balance">
                Ready to Automate Your Job Search?
              </h2>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                Join thousands of professionals who let our AI chatbot handle
                their job applications automatically. Start with our free plan
                or upgrade to Pro for unlimited automatic applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <span className="text-primary-foreground/60 text-sm">
                  ATS screening included • No credit card required
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
