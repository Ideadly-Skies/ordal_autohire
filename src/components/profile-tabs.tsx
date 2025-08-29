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
                <h3 className="font-medium text-lg mb-2">Software Engineer</h3>
                <p className="text-sm text-muted-foreground mb-2">Google • Full-time</p>
                <p className="text-sm text-muted-foreground">Jan 2020 - Present • 3 yrs 8 mos</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Building awesome web applications with modern technologies.
                </p>
              </div>
              
              <div className="pt-6">
                <h3 className="font-medium text-lg mb-2">Frontend Developer</h3>
                <p className="text-sm text-muted-foreground mb-2">Facebook • Full-time</p>
                <p className="text-sm text-muted-foreground">Jun 2018 - Dec 2019 • 1 yr 7 mos</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Worked on user interface components and improved user experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
