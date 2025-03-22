import DashboardContainer from "../components/dashboard/dashboard-container";
import DashboardLayout from "../components/dashboard/ui/layout";
import { Outlet } from "react-router";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <DashboardContainer>
        <Outlet />
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default AdminDashboard;
