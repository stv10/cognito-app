import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

// Helper functions for setting and deleting cookies
function setCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const useTokenManager = () => {
  const auth = useAuth();

  // Store tokens when user logs in
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      setCookie("access_token", auth.user.access_token);
      setCookie("id_token", auth.user.id_token ?? "");
      if (auth.user.refresh_token) {
        setCookie("refresh_token", auth.user.refresh_token);
      }
    } else {
      deleteCookie("access_token");
      deleteCookie("id_token");
      deleteCookie("refresh_token");
    }
  }, [auth.isAuthenticated, auth.user]);
}; 