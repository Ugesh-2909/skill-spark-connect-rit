
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} />
      <div className="flex flex-col flex-1 w-full">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
