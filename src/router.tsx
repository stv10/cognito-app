import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardRoute from "./components/DashboardRoute";
import RootLayout from "./components/RootLayout";

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
      },
    ],
  },
]); 