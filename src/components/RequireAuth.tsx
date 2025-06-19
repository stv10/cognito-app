import { useEffect, type ReactElement } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/", { state: { from: location } });
    }
  }, [auth.isAuthenticated, navigate, location]);

  return children;
};

export default RequireAuth; 