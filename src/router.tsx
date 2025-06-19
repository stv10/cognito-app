import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardRoute from "./components/DashboardRoute";
import RootLayout from "./components/RootLayout";

// Authentication loader for protected routes
const authLoader = () => {
  // This will be called before the route renders
  // We'll handle auth checks in the component itself
  return null;
};

// Create the router
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: <DashboardRoute />,
        loader: authLoader,
      },
    ],
  },
]); 