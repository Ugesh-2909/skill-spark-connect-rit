import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Search, 
  Plus, 
  Menu,
  User,
  Settings,
  LogOut,
  Trophy,
  LogIn
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [profile, setProfile] = useState<any>(null);
  
  const isAuthenticated = !!user;

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

  return (
    <header className="border-b border-gray-200 bg-white py-3 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search achievements, projects, or users..."
            className="pl-8 w-full bg-gray-50 border-gray-200 focus-visible:bg-white"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {isAuthenticated && (
          <Button size="sm" className="bg-uprit-indigo hover:bg-uprit-indigo/90 hidden sm:flex">
            <Plus className="h-4 w-4 mr-1" />
            Add Achievement
          </Button>
        )}
        
        {isAuthenticated ? (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 relative"
              asChild
            >
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={profile?.avatar_url || undefined} alt={profile?.full_name}
                    />
                    <AvatarFallback>
                      {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.username ? `@${profile.username}` : user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/achievements" className="w-full flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Achievements
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="w-full flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <div className="flex items-center w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button asChild variant="default" size="sm" className="bg-uprit-indigo hover:bg-uprit-indigo/90">
            <Link to="/auth" className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
