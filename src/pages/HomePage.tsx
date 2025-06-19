import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const auth = useAuth();

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

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-6">Welcome to Cognito App</h1>
        <p className="text-muted-foreground mb-8">Please sign in to continue</p>
        <Button 
          onClick={() => auth.signinRedirect()}
          size="lg"
          variant="default"
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default HomePage; 