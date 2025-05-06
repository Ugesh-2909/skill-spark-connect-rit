
import { Link, useLocation } from "react-router-dom";
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
  ShieldAlert,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();
  
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Network", href: "/network", icon: Users },
    { name: "Projects", href: "/projects", icon: Layout },
    { name: "Leaderboard", href: "/leaderboard", icon: BookOpen }
  ];

  const userLinks = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ];
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          setProfile(data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    
    fetchProfile();
  }, [user]);

  // Check if the user is an admin
  const isAdmin = profile?.role === 'admin';
  // Check if the user is faculty
  const isFaculty = profile?.role === 'faculty';

  if (!open) {
    return null;
  }

  if (!user) {
    return (
      <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col relative animate-fade-in z-20">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-uprit-indigo" />
            <span className="font-display font-bold text-lg text-uprit-indigo">UpRIT</span>
          </Link>
        </div>
        <div className="flex-1 p-4">
          <Link to="/auth">
            <Button className="w-full">Sign In</Button>
          </Link>
        </div>
      </div>
    );
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
            <AvatarImage 
              src={profile?.avatar_url || "https://i.pravatar.cc/150?img=5"} 
              alt={profile?.full_name || "User"} 
            />
            <AvatarFallback>
              {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{profile?.full_name || user.email}</h4>
            <p className="text-xs text-gray-500">{profile?.department || 'Student'}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.href 
                    ? 'bg-uprit-indigo/10 text-uprit-indigo' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <item.icon className={`h-5 w-5 ${
                  location.pathname === item.href 
                    ? 'text-uprit-indigo' 
                    : 'text-gray-500'
                }`} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
          
          {isFaculty && (
            <li>
              <Link
                to="/faculty"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/faculty' 
                    ? 'bg-uprit-indigo/10 text-uprit-indigo' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <GraduationCap className={`h-5 w-5 ${
                  location.pathname === '/faculty' 
                    ? 'text-uprit-indigo' 
                    : 'text-gray-500'
                }`} />
                <span>Faculty Portal</span>
              </Link>
            </li>
          )}
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
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.href 
                      ? 'bg-uprit-indigo/10 text-uprit-indigo' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${
                    location.pathname === item.href 
                      ? 'text-uprit-indigo' 
                      : 'text-gray-500'
                  }`} />
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
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/admin' 
                      ? 'bg-purple-100 text-uprit-purple' 
                      : 'text-uprit-purple hover:bg-purple-50'
                  }`}
                >
                  <ShieldAlert className={`h-5 w-5 ${
                    location.pathname === '/admin' 
                      ? 'text-uprit-purple' 
                      : 'text-uprit-purple'
                  }`} />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <Button variant="outline" className="w-full" onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
