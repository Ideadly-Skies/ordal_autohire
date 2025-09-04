import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import "@/styles/App.css";
import "@/styles/index.css";

import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { AuthProvider } from "@/context/auth-context";
import PopUpPreview from "./PopUpPreview";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ordal AutoHire – Smart AI-Powered Job Applications",
  description:
    "Ordal AutoHire is an AI-driven application platform that helps jobseekers automatically match and apply for jobs with ATS-optimized resumes, while giving recruiters smart tools to find top candidates.",
  keywords: [
    "Ordal AutoHire",
    "AI Job Search",
    "ATS Resume Checker",
    "Job Matching",
    "Auto Apply Jobs",
    "AI Recruitment",
    "Smart Hiring",
    "Job Application Automation",
    "Career Tools",
  ],
  authors: [{ name: "Ordal AutoHire Team" }],
  openGraph: {
    title: "Ordal AutoHire – A Smart, AI-Based Job Application Platform",
    description:
      "Automatically screen resumes, match skills with job listings, and apply with AI. Jobseekers and recruiters both save time with Ordal AutoHire.",
    siteName: "Ordal AutoHire",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ordal AutoHire – AI-based job applications",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ordal AutoHire – AI-Powered Job Applications",
    description:
      "AI-based job application platform for smart jobseekers and recruiters. Resume screening, job matching, and auto-apply in one place.",
    images: ["/og-image.jpg"],
    creator: "@yourhandle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* Dreamy Sky Pink Glow */}
          {/* <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 90%),
            radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
            }}
            /> */}
          {/* Your Content/Components */}
          <Toaster />
          {children}
          {/* persistent floating chat widget */}
          <PopUpPreview />
          <Script
            id="midtrans-snap"
            src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL!}
            data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            strategy="afterInteractive"
          />

          <AnimatedThemeToggler className="fixed z-3 bottom-6 left-6" />
        </AuthProvider>
      </body>
    </html>
  );
}
