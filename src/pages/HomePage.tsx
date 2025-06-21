import { useAuth } from "react-oidc-context";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  if(!auth.isAuthenticated) navigate("/login");

  if (auth.isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-6">Welcome!</h1>
          <Button asChild size="lg" variant="default">
            <Link to="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }
};

export default HomePage; 