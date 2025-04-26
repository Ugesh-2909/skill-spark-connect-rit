
import { Book, BarChart2, Trophy, PieChart, Users, FileText } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface FacultySidebarProps {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}

export function FacultySidebar({ selectedMenu, setSelectedMenu }: FacultySidebarProps) {
  const sidebarMenu = [
    { label: "Dashboard", icon: BarChart2 },
    { label: "Leaderboard", icon: Trophy },
    { label: "Analytics", icon: PieChart },
    { label: "Projects", icon: FileText },
    { label: "Skills", icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col">
      <div className="p-4 border-b flex items-center space-x-2">
        <Book className="h-6 w-6 text-uprit-indigo" />
        <span className="font-display font-bold text-lg text-uprit-indigo">
          Faculty Portal
        </span>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?img=4" alt="Prof. Thomas Wilson" />
            <AvatarFallback>TW</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">Prof. Thomas Wilson</h4>
            <p className="text-xs text-gray-500">Computer Science, Senior Faculty</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarMenu.map((item) => (
            <li key={item.label}>
              <button
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm w-full font-medium",
                  selectedMenu === item.label
                    ? "bg-uprit-indigo text-white"
                    : "hover:bg-gray-50 text-gray-700"
                )}
                onClick={() => setSelectedMenu(item.label)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <a href="/" className="text-sm text-gray-500 hover:text-uprit-indigo flex items-center">
          ← Back to Dashboard
        </a>
      </div>
    </aside>
  );
}
