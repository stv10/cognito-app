import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Shield, User } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { role, groups, isAdmin } = useUserRole();

  if (!auth.isAuthenticated || !auth.user) navigate("/error", { state: { error: "User not authenticated" } });

  const getRoleIcon = () => {
    if (isAdmin) {
      return <Shield className="h-4 w-4 text-red-500" />;
    }
    return <User className="h-4 w-4 text-blue-500" />;
  };

  const getRoleBadgeVariant = () => {
    if (isAdmin) {
      return "destructive" as const;
    }
    return "secondary" as const;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-background border-b border-border z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="text-foreground font-medium">
              Welcome, {auth.user?.profile?.given_name} {auth.user?.profile?.family_name}!
            </div>
            <div className="flex items-center gap-2">
              {getRoleIcon()}
              <Badge variant={getRoleBadgeVariant()} className="text-xs">
                {role}
              </Badge>
              {groups.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {groups.join(', ')}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button 
              onClick={() => auth.removeUser()}
              variant="outline"
              size="icon"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 