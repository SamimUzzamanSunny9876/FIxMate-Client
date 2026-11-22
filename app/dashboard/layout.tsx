import { DashboardSidebar } from "@/app/components/DashboardSidebar";
import { NavBar } from "@/components/homePage/NavBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Footer } from "react-day-picker";
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