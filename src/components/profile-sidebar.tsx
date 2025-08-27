import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Progress } from "./ui/progress";

export default function ProfileSidebar() {
  return (
    <div className="w-full lg:w-80 space-y-3 lg:space-y-4">
      {/* Profile Completion */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 lg:pb-3">
          <CardTitle className="text-base lg:text-lg font-medium">
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 lg:space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Profile Strength
              </span>
              <span className="text-sm font-semibold text-blue-600">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <p className="text-xs lg:text-sm text-muted-foreground">
            Add portfolio links to reach 100%
          </p>
        </CardContent>
      </Card>

      {/* AI Match Insights */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 lg:pb-3">
          <CardTitle className="text-base lg:text-lg font-medium">
            AI Match Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 lg:space-y-4">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-orange-500 mb-1">
              92%
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground">
              Average Match Score
            </p>
          </div>

          <div className="space-y-1.5 lg:space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">React.js</span>
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1"
              >
                Expert
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">TypeScript</span>
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1"
              >
                Expert
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Node.js</span>
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1"
              >
                Advanced
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 lg:pb-3">
          <CardTitle className="text-base lg:text-lg font-medium">
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 lg:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Applications Sent
            </span>
            <span className="font-semibold">47</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Interview Invites
            </span>
            <span className="font-semibold text-green-600">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Profile Views</span>
            <span className="font-semibold">156</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Response Rate</span>
            <span className="font-semibold text-blue-600">25.5%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
