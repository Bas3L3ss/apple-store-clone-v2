import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import Header from "./header";
import AppSidebar from "./app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
