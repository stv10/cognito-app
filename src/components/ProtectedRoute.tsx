import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.isAuthenticated) {
    navigate("/");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 