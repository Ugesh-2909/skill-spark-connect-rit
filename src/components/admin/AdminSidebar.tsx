
import { ShieldAlert, BarChart2, Users, FileText, Settings, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "users", label: "Users", icon: Users },
    { id: "moderation", label: "Moderation", icon: FileText },
    { id: "gamification", label: "Gamification", icon: PieChart },
    { id: "system", label: "System", icon: Settings },
    { id: "reports", label: "Reports", icon: BarChart2 },
  ];

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center">
        <ShieldAlert className="h-6 w-6 text-uprit-purple mr-2" />
        <span className="font-display font-bold text-lg text-uprit-purple">Admin Portal</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex w-full items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium",
                  activeTab === item.id 
                    ? "bg-uprit-purple text-white" 
                    : "hover:bg-gray-50 text-gray-700"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link to="/" className="text-sm text-gray-500 hover:text-uprit-indigo flex items-center">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
