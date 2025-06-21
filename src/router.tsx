import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import DashboardLayout from "./pages/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import { DashboardIndex } from "./components/DashboardIndex";
import { TasksPage } from "./pages/TasksPage";

// Create the router
export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "dashboard",
        Component: DashboardLayout,
        children: [
          {
            index: true,
            Component: DashboardIndex,
          },
          {
            path: "tasks",
            Component: TasksPage
          }
        ]
      },
      {
        path: "error",
        Component: ErrorPage,
      },
    ],
  },
  {
    path: "/login",
    Component: LoginPage
  }
]);