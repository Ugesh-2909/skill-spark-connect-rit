
import { MainLayout } from "@/layouts/MainLayout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
// Remove AchievementVerification import
import { ContentModeration } from "@/components/admin/ContentModeration";
import { GameManagement } from "@/components/admin/GameManagement";
import { SystemConfiguration } from "@/components/admin/SystemConfiguration";
import { ReportingAnalytics } from "@/components/admin/ReportingAnalytics";
import { Helmet } from "react-helmet";

export default function Admin() {
  return (
    <MainLayout>
      <Helmet>
        <title>Admin Portal | UpRIT</title>
      </Helmet>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-muted-foreground">
              Manage users, monitor platform activity, and more
            </p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            {/* Achievement Verification tab removed */}
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="gamification">Gamification</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          {/* <TabsContent value="achievements">
            <AchievementVerification />
          </TabsContent> */}
          
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
    </MainLayout>
  );
}
