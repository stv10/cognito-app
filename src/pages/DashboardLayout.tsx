import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListTodo, Shield } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { Link, Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
    const auth = useAuth();
    const navigate = useNavigate();
  
    if (!auth.isAuthenticated) {
      navigate("/login");
      return null;
    }
  
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
            <Link to="/dashboard/tasks">
              <Button className="w-full justify-start" variant="outline">
                <ListTodo className="h-4 w-4 mr-2" />
                Manage Tasks
              </Button>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 