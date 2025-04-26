
import { useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { ContentModeration } from "@/components/admin/ContentModeration";
import { GameManagement } from "@/components/admin/GameManagement";
import { SystemConfiguration } from "@/components/admin/SystemConfiguration";
import { ReportingAnalytics } from "@/components/admin/ReportingAnalytics";
import { Helmet } from "react-helmet";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-6">
        <Helmet>
          <title>Admin Portal | UpRIT</title>
        </Helmet>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-muted-foreground">
              Manage users, monitor platform activity, and more
            </p>
          </div>

          <Tabs value={activeTab} className="space-y-4">
            <TabsContent value="dashboard">
              <AdminDashboard />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="moderation">
              <ContentModeration />
            </TabsContent>
            
            <TabsContent value="gamification">
              <GameManagement />
            </TabsContent>
            
            <TabsContent value="system">
              <SystemConfiguration />
            </TabsContent>
            
            <TabsContent value="reports">
              <ReportingAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
