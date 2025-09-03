import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";

type ProfileTabsProps = {
  children: React.ReactNode;
};

export function ProfileTabs({ children }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="mb-6">
        <TabsList className="grid w-full sm:w-auto grid-cols-2">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <User className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="experience" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <Briefcase className="h-4 w-4" />
            <span>Experience</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="overview" className="m-0">
        {children}
      </TabsContent>
      
      <TabsContent value="experience" className="m-0">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-6">
              <div className="border-b pb-6 last:border-b-0 last:pb-0">
                <h3 className="font-medium text-lg mb-2">Software Developer</h3>
                <p className="text-sm text-muted-foreground mb-2">WerkDone • Full-time</p>
                <p className="text-sm text-muted-foreground">April 2025 - Present • 6 months</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Responsible for developing early-stage prototypes to test product ideas, applying strong
                  problem-solving skills and technical judgement to quickly assess technical feasibility and provide
                  direction for future development and/or in alignment with use needs.
                  Research emerging technologies, APIs, and tools that could influence or improve potential
                  solutions.
                  Maintain current knowledge of relevant technology, programming skills and applications.
                </p>
              </div>
              
              <div className="border-b pb-6 last:border-b-0 last:pb-0">
                <h3 className="font-medium text-lg mb-2">BackEnd Software Engineer</h3>
                <p className="text-sm text-muted-foreground mb-2">JadiPintar • Full-time</p>
                <p className="text-sm text-muted-foreground">March 2025 - July 2025 • 4 months</p>
                <p className="mt-3 text-sm text-muted-foreground">
                    Handling back-end technologies and database structures such as MySQL, Prisma, Node.js , JSON,
                    Python and more on a project basis.
                    Provide support for other related development tasks such as frontend and jira task allocation. 
                </p>
              </div>

              <div className="border-b pb-6 last:border-b-0 last:pb-06">
                <h3 className="font-medium text-lg mb-2">Software Engineer Instructor</h3>
                <p className="text-sm text-muted-foreground mb-2">Green Academy • Full-time</p>
                <p className="text-sm text-muted-foreground">Feb 2025 - July 2025 • 5 months</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  I teach a hybrid advanced Java full-stack web development class on selected days from 7-10 pm
                  Utilized Java spring boot for backend applications and services; Angular and Vue for the frontend
                  and supabase as the database provider for postgreSQL.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
