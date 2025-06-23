import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import Navbar from "../components/Navbar";
import LoadingPage from "./LoadingPage";

const RootLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (auth.error) {
      navigate("/error", { state: { error: auth.error.message } });
    }
  }, [auth.error, navigate]);
  
  return (
    <>
      {auth.isLoading && <LoadingPage />}
      {!auth.isLoading && (
        <>
          <Navbar />
          <Outlet />
        </>
      )}
    </>
  );
};

export default RootLayout; 