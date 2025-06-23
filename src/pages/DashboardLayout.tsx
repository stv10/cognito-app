import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListTodo, Shield, Users, Settings, BarChart3 } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

const DashboardLayout = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { isAdmin, role } = useUserRole();
  
    if (!auth.isAuthenticated) {
      navigate("/login");
      return null;
    }
  
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <Shield className="h-6 w-6 text-red-500" />
              ) : (
                <Users className="h-6 w-6 text-blue-500" />
              )}
              <h1 className="text-3xl font-bold text-foreground">
                {isAdmin ? "Admin Dashboard" : "User Dashboard"}
              </h1>
              <Badge variant={isAdmin ? "destructive" : "secondary"}>
                {role}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link to="/dashboard/tasks">
                  <ListTodo className="h-4 w-4 mr-2" />
                  {isAdmin ? "Manage Tasks" : "My Tasks"}
                </Link>
              </Button>
              
              {isAdmin && (
                <>
                  <Button asChild variant="outline">
                    <Link to="/dashboard/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/dashboard/analytics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 