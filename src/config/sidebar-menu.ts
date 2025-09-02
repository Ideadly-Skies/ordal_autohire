import {
  Bot,
  Building,
  Home,
  LifeBuoy,
  Search,
  Send,
  User,
  Users,
  FileText,
  Briefcase,
} from "lucide-react";

export const secondaryMenu = [
  {
    title: "Homepage",
    url: "/",
    icon: Home,
  },
];

export const jobseekerMenu = [
  {
    name: "Profile",
    url: "/dashboard/jobseeker",
    icon: User,
  },
  {
    name: "Search Jobs",
    url: "/dashboard/jobseeker/search-job",
    icon: Search,
  },
  {
    name: "Auto Apply",
    url: "/dashboard/jobseeker/auto-apply",
    icon: Bot,
  },
  {
    name: "Applications",
    url: "/dashboard/jobseeker/applications",
    icon: FileText,
  },
];

export const employerMenu = [
  {
    name: "Company Profile",
    url: "/dashboard/employer",
    icon: Building,
  },
  {
    name: "Job Posts",
    url: "/dashboard/employer/jobs",
    icon: Briefcase,
  },
  {
    name: "Candidates",
    url: "/dashboard/employer/candidates",
    icon: Users,
  },
];
