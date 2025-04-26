
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Trophy, 
  Users, 
  Layout, 
  BookOpen, 
  Bell, 
  Settings, 
  GraduationCap,
  User,
  ShieldAlert
} from "lucide-react";

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Network", href: "/network", icon: Users },
    { name: "Projects", href: "/projects", icon: Layout },
    { name: "Leaderboard", href: "/leaderboard", icon: BookOpen },
    { name: "Faculty Portal", href: "/faculty", icon: GraduationCap }
  ];

  const userLinks = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Mocked admin status - in a real app, this would come from authentication context
  const isAdmin = true;

  if (!open) {
    return null;
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col relative animate-fade-in z-20">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-uprit-indigo" />
          <span className="font-display font-bold text-lg text-uprit-indigo">UpRIT</span>
        </Link>
      </div>
      
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">Jane Doe</h4>
            <p className="text-xs text-gray-500">Computer Science</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                <item.icon className="h-5 w-5 text-gray-500" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            User
          </h3>
          <ul className="mt-2 space-y-1">
            {userLinks.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  <item.icon className="h-5 w-5 text-gray-500" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {isAdmin && (
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Admin
            </h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-uprit-purple hover:bg-purple-50"
                >
                  <ShieldAlert className="h-5 w-5 text-uprit-purple" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <Button variant="outline" className="w-full">
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
