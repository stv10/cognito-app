import { CheckCircle, User } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export const DashboardIndex = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Authentication Status
          </CardTitle>
          <CardDescription>
            Your authentication is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-accent border border-accent-foreground/20 rounded-lg p-4">
            <p className="text-accent-foreground text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              You are successfully authenticated and can access this protected
              route.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Message</CardTitle>
            <CardDescription>
              This is a protected route. You can only see this if you're
              authenticated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The authentication system is working perfectly with shadcn/ui
              components!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access your tasks and manage your workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">React Router</Badge>
              <Badge variant="outline">Cognito Auth</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">shadcn/ui</Badge>
              <Badge variant="outline">TypeScript</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">Vite</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
