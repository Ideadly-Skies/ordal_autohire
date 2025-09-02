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
                1M+
              </div>
              <div className="text-sm text-muted-foreground">
                Active Job Posts
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                50K+
              </div>
              <div className="text-sm text-muted-foreground">
                Successful Placements
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                95%
              </div>
              <div className="text-sm text-muted-foreground">
                Interview Success Rate
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                24h
              </div>
              <div className="text-sm text-muted-foreground">
                Average Response Time
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
              AI-Powered Job Search Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leverage cutting-edge technology to streamline your job search and
              land your dream role faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Smart Job Matching
                </h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your skills and preferences to match you with
                  the most relevant opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Resume Optimization
                </h3>
                <p className="text-muted-foreground">
                  AI-powered resume analysis and optimization to increase your
                  chances of getting noticed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Interview Preparation
                </h3>
                <p className="text-muted-foreground">
                  Practice with AI-generated interview questions tailored to
                  your target roles and industry.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Network Insights
                </h3>
                <p className="text-muted-foreground">
                  Discover connections and referral opportunities within your
                  professional network.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Application Tracking
                </h3>
                <p className="text-muted-foreground">
                  Keep track of all your applications with automated status
                  updates and follow-up reminders.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Salary Intelligence
                </h3>
                <p className="text-muted-foreground">
                  Get real-time salary data and negotiation insights for your
                  target positions and locations.
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
              Get started in minutes and let our AI do the heavy lifting for
              your job search.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Create Your Profile
              </h3>
              <p className="text-muted-foreground">
                Upload your resume and tell us about your career goals, skills,
                and preferences. Our AI will analyze your profile to understand
                your unique strengths.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Get Matched
              </h3>
              <p className="text-muted-foreground">
                Our intelligent matching system scans millions of job posts
                daily and presents you with opportunities that align with your
                profile and career aspirations.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Land Interviews
              </h3>
              <p className="text-muted-foreground">
                Apply with optimized applications, prepare with AI-powered
                interview coaching, and track your progress until you land your
                dream job.
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
                  "I landed 3 interviews in my first week using Ordal AutoHire.
                  The AI matching was incredibly accurate, and the interview
                  prep helped me feel confident."
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
                  "The salary intelligence feature helped me negotiate a 40%
                  increase. I wish I had found this platform sooner in my
                  career."
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
                  "From application to offer in just 2 weeks! The resume
                  optimization and application tracking made everything so much
                  easier."
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
                      Data Scientist at Netflix
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
                How does the AI matching work?
              </h3>
              <p className="text-muted-foreground">
                Our AI analyzes your skills, experience, preferences, and career
                goals to match you with relevant opportunities. It learns from
                your interactions and feedback to improve recommendations over
                time.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Is my data secure and private?
              </h3>
              <p className="text-muted-foreground">
                Yes, we use enterprise-grade security measures to protect your
                data. Your profile is only visible to you and potential
                employers you choose to engage with.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-muted-foreground">
                Absolutely. You can cancel your subscription at any time with no
                cancellation fees. You'll continue to have access until the end
                of your billing period.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Do you work with all industries?
              </h3>
              <p className="text-muted-foreground">
                Yes, we have job opportunities across all major industries
                including tech, finance, healthcare, marketing, sales, and more.
                Our AI adapts to industry-specific requirements.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                How quickly can I expect to see results?
              </h3>
              <p className="text-muted-foreground">
                Most users see relevant job matches within 24 hours of
                completing their profile. Interview opportunities typically come
                within the first week for active users.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                What makes you different from other job boards?
              </h3>
              <p className="text-muted-foreground">
                Unlike traditional job boards, we use advanced AI to actively
                match you with opportunities, optimize your applications, and
                provide personalized career guidance throughout your journey.
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
                Ready to Transform Your Job Search?
              </h2>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                Join thousands of professionals who have accelerated their
                careers with our AI-powered platform.
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
                  No credit card required
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
