import { DashboardSidebar } from "@/app/components/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
const DashboardLayoutPage = ({ children }: { children: React.ReactNode }) => {
     return (
    <SidebarProvider>
      <DashboardSidebar/>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
};

export default DashboardLayoutPage;