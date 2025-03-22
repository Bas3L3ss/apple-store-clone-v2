import DashboardLayout from "../components/dashboard/ui/layout";
import { Outlet } from "react-router";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;
