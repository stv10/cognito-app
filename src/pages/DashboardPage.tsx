import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User, CheckCircle } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <Badge variant="secondary" className="ml-2">
              Protected
            </Badge>
          </div>
          
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
                  You are successfully authenticated and can access this protected route.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Message</CardTitle>
                <CardDescription>
                  This is a protected route. You can only see this if you're authenticated.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The authentication system is working perfectly with shadcn/ui components!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>
                  What's available in this app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 