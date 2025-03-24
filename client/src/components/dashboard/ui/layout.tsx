import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import Header from "./header";
import AdminSidebar from "./admin-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
