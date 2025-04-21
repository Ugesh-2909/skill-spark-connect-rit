
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Users, FileCheck2, Flag, Activity } from "lucide-react";

const userStatsData = [
  { name: "Jan", Active: 400, New: 240 },
  { name: "Feb", Active: 300, New: 139 },
  { name: "Mar", Active: 200, New: 980 },
  { name: "Apr", Active: 278, New: 390 },
  { name: "May", Active: 189, New: 480 },
  { name: "Jun", Active: 239, New: 380 },
  { name: "Jul", Active: 349, New: 430 },
];

const achievementVerificationsData = [
  { name: "Mon", count: 21 },
  { name: "Tue", count: 34 },
  { name: "Wed", count: 25 },
  { name: "Thu", count: 19 },
  { name: "Fri", count: 38 },
  { name: "Sat", count: 12 },
  { name: "Sun", count: 5 },
];

export function AdminDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,843</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <FileCheck2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              -12% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Flags</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">
              +4 new since yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">
              Uptime for the past 30 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>
              Active and new user counts over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={userStatsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="Active" fill="#7E69AB" />
                <Bar dataKey="New" fill="#9b87f5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Achievement Verifications</CardTitle>
            <CardDescription>
              Daily verification counts for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={achievementVerificationsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="count" stroke="#6E59A5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities and admin actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "Admin (Mark T.)", action: "Verified 12 achievements", time: "5 minutes ago" },
                { user: "Admin (Jennifer L.)", action: "Updated system settings", time: "1 hour ago" },
                { user: "Admin (Robert K.)", action: "Removed flagged content", time: "3 hours ago" },
                { user: "System", action: "Automatic backup completed", time: "12 hours ago" },
                { user: "Admin (Mark T.)", action: "Added new achievement category", time: "yesterday" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-4 h-2 w-2 rounded-full bg-uprit-purple" />
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
