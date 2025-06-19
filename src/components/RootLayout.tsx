import { Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useTokenManager } from "@/lib/hooks/useTokenManager";
import Navbar from "./Navbar";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import { ThemeProvider } from "./theme-provider";

const RootLayout = () => {
  const auth = useAuth();
  
  // Use the token manager hook
  useTokenManager();

  if (auth.error) {
    return <ErrorPage error={auth.error.message} />;
  }

  if (auth.isLoading) {
    return <LoadingPage />;
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <Outlet />
    </ThemeProvider>
  );
};

export default RootLayout; 