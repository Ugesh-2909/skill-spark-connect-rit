
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <ScrollArea className="flex-1 h-[calc(100vh-64px)]">
          <main className="p-4 md:p-6">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
