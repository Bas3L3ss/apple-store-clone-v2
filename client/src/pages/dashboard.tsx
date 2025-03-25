import DashboardContainer from "../components/dashboard/dashboard-container";
import DashboardLayout from "../components/dashboard/ui/layout";
import { Outlet } from "react-router";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <DashboardContainer scrollable={false}>
        <Outlet />
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default AdminDashboard;
