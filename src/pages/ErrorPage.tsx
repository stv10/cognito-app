import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  const location = useLocation();
  const error = location.state?.error || "An error occurred";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
        <h2 className="text-destructive text-xl font-semibold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild variant="outline">
          <Link to="/">
            Go to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage; 