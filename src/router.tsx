import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardRoute from "./components/DashboardRoute";
import RootLayout from "./components/RootLayout";
import ErrorPage from "./components/ErrorPage";

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
      {
        path: "error",
        element: <ErrorPage />,
      },
    ],
  },
]); 