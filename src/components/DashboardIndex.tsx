import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Settings, BarChart3, Plus, Eye, ListTodo } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

export const DashboardIndex = () => {
  const { isAdmin, isUser, role } = useUserRole();

  return (
    <>
      <div className="space-y-6">
        {/* Role-based welcome message */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Shield className="h-8 w-8 text-red-500" />
          ) : (
            <Users className="h-8 w-8 text-blue-500" />
          )}
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {isAdmin ? "Admin Dashboard" : "User Dashboard"}
            </h2>
            <p className="text-muted-foreground">
              {isAdmin 
                ? "Manage tasks, users, and system settings" 
                : "View and manage your assigned tasks"
              }
            </p>
          </div>
          <Badge variant={isAdmin ? "destructive" : "secondary"}>
            {role}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin-specific content */}
          {isAdmin && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Admin Controls
                  </CardTitle>
                  <CardDescription>
                    Manage system settings and user permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">User Management</Badge>
                    <Badge variant="outline">System Settings</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Analytics</Badge>
                    <Badge variant="outline">Audit Logs</Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Access Admin Panel
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Analytics
                  </CardTitle>
                  <CardDescription>
                    View system-wide statistics and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">150</div>
                      <div className="text-sm text-muted-foreground">Total Tasks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">25</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* User-specific content */}
          {isUser && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    My Tasks Overview
                  </CardTitle>
                  <CardDescription>
                    View and manage your assigned tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">8</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/dashboard/tasks">
                      <Eye className="h-4 w-4 mr-2" />
                      View My Tasks
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common actions for task management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">View Tasks</Badge>
                    <Badge variant="outline">Update Status</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Add Comments</Badge>
                    <Badge variant="outline">Request Help</Badge>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/dashboard/tasks">
                      <Plus className="h-4 w-4 mr-2" />
                      Go to Tasks
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Common content for both roles */}
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
                components! Your role: <strong>{role}</strong>
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
              <Button asChild className="w-full">
                <Link to="/dashboard/tasks">
                  <ListTodo className="h-4 w-4 mr-2" />
                  Manage Tasks
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
