import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider, type AuthProviderProps } from 'react-oidc-context' 
import { RouterProvider } from "react-router-dom";
import { router } from './router';
import "./index.css";
import { ThemeProvider } from './components/theme-provider';

const cognitoAuthConfig: AuthProviderProps = {
  authority: import.meta.env.VITE_AUTHORITY || "",
  client_id: import.meta.env.VITE_CLIENT_ID || "",
  redirect_uri: import.meta.env.VITE_REDIRECT_URI || "",
  response_type: "code",
  scope: "email openid profile",
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
