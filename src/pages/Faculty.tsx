
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Sidebar } from "@/components/Sidebar";
import { MainLayout } from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { BarChart2, Users, Trophy, Book, MessageSquare, PieChart } from "lucide-react";

const sidebarMenu = [
  { label: "Dashboard", icon: BarChart2 },
  { label: "Leaderboard", icon: Trophy },
  { label: "Analytics", icon: PieChart },
  { label: "Projects", icon: Book },
  { label: "Skills", icon: Users },
  { label: "Achievements", icon: Trophy },
  { label: "Communication", icon: MessageSquare },
];

export default function Faculty() {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-4 border-b flex items-center space-x-2">
          <Book className="h-6 w-6 text-uprit-indigo" />
          <span className="font-display font-bold text-lg text-uprit-indigo">
            Faculty Portal
          </span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarMenu.map((item) => (
              <li key={item.label}>
                <button
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm w-full font-medium ${
                    selectedMenu === item.label
                      ? "bg-uprit-indigo text-white"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                  onClick={() => setSelectedMenu(item.label)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t text-xs text-gray-500">
          <a href="#" className="hover:underline">Help Resources</a> •{" "}
          <a href="#" className="hover:underline">Documentation</a>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <Helmet>
          <title>Faculty Portal | UpRIT</title>
        </Helmet>
        <header className="p-4 border-b flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Faculty Member</h1>
            <p className="text-muted-foreground">Department of Computer Science</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString()}
            </span>
            {/* Notification/Settings icons could go here */}
          </div>
        </header>
        <section className="flex-1 p-4 md:p-8">
          {selectedMenu === "Dashboard" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-6 flex flex-col items-start">
                  <span className="text-xs text-gray-500 mb-1">Department Activity</span>
                  <span className="text-2xl font-bold">52 Achievements</span>
                  <span className="text-xs text-green-600 mt-2">+8% this month</span>
                </Card>
                <Card className="p-6 flex flex-col items-start">
                  <span className="text-xs text-gray-500 mb-1">Top Performer</span>
                  <span className="text-2xl font-bold">Jane Doe</span>
                  <span className="text-xs text-muted-foreground mt-2">CS Major</span>
                </Card>
                <Card className="p-6 flex flex-col items-start">
                  <span className="text-xs text-gray-500 mb-1">Upcoming Events</span>
                  <ul className="text-sm mt-2">
                    <li>• HackRIT 2025 - May 13</li>
                    <li>• Capstone Expo - May 18</li>
                  </ul>
                </Card>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <span className="text-sm font-semibold">Recent Student Achievements</span>
                  <ul className="mt-2 space-y-1">
                    <li>✓ Emma Brown completed AWS Certification</li>
                    <li>✓ Michael Johnson published research paper</li>
                    <li>✓ Sarah Lee led Hackathon team</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <span className="text-sm font-semibold">Notable Projects</span>
                  <ul className="mt-2 space-y-1">
                    <li>• AI-Powered Campus Navigation</li>
                    <li>• Accessibility Web Tools</li>
                    <li>• Cybersecurity Risk Dashboard</li>
                  </ul>
                </Card>
              </div>
              <Card className="p-6">
                <span className="text-sm font-semibold">Activity Timeline</span>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>[Today] Jane Doe awarded "Most Innovative Project"</li>
                  <li>[Yesterday] John Smith climbed to #2 in the leaderboard</li>
                  <li>[2 days ago] New Capstone projects published</li>
                </ul>
              </Card>
              <div className="mt-6 text-right text-xs text-gray-400">
                For demo purposes: rest of portal sections (Leaderboard, Analytics, Projects...) coming soon.
              </div>
            </div>
          )}
          {/* You could extend here for more menu pages */}
          {selectedMenu !== "Dashboard" && (
            <div className="flex items-center justify-center h-64 text-lg text-muted-foreground">
              {selectedMenu} - Coming Soon
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
