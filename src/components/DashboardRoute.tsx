import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";

const DashboardRoute = () => {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
};

export default DashboardRoute; 