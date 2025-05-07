
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Award,
  Trophy,
  Code,
  Settings,
  Home,
  Users,
  User,
  Bell,
  LogOut,
  MessageSquare
} from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { useMessages } from "@/hooks/use-messages";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const { getUnreadMessagesCount } = useMessages();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (user) {
        const count = await getUnreadMessagesCount();
        setUnreadMessages(count);
      }
    };
    
    fetchUnreadMessages();
    
    // Set up an interval to check for new messages periodically
    const interval = setInterval(fetchUnreadMessages, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [user, getUnreadMessagesCount]);

  // Function to handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside
      className={cn(
        "flex-col bg-white border-r border-gray-200 h-screen",
        open ? "flex w-64" : "hidden w-0 md:flex md:w-16"
      )}
    >
      <div className="h-14 py-2 flex items-center justify-center border-b">
        <Link
          to="/"
          className="flex items-center"
          aria-label="Go to dashboard"
        >
          {open ? (
            <div className="flex items-center">
              <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold ml-2 text-uprit-indigo">
                UpRIT
              </span>
            </div>
          ) : (
            <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
          )}
        </Link>
      </div>
      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-1 px-2">
          <NavItem
            open={open}
            href="/"
            icon={<Home />}
            label="Dashboard"
            active={location.pathname === "/"}
          />
          <NavItem
            open={open}
            href="/achievements"
            icon={<Award />}
            label="Achievements"
            active={location.pathname.startsWith("/achievements")}
          />
          <NavItem
            open={open}
            href="/leaderboard"
            icon={<Trophy />}
            label="Leaderboard"
            active={location.pathname.startsWith("/leaderboard")}
          />
          <NavItem
            open={open}
            href="/projects"
            icon={<Code />}
            label="Projects"
            active={location.pathname.startsWith("/projects")}
          />
          <NavItem
            open={open}
            href="/network"
            icon={<Users />}
            label="Network"
            active={location.pathname.startsWith("/network")}
          />
          <NavItem
            open={open}
            href="/messages"
            icon={<MessageSquare />}
            label="Messages"
            active={location.pathname.startsWith("/messages")}
            badge={unreadMessages > 0 ? unreadMessages : undefined}
          />
          <NavItem
            open={open}
            href="/notifications"
            icon={<Bell />}
            label="Notifications"
            active={location.pathname === "/notifications"}
            badge={unreadCount > 0 ? unreadCount : undefined}
          />
          <NavItem
            open={open}
            href="/profile"
            icon={<User />}
            label="Profile"
            active={location.pathname === "/profile"}
          />
        </nav>
      </ScrollArea>
      <div className="flex flex-col gap-1 p-2 border-t">
        <NavItem
          open={open}
          href="/settings"
          icon={<Settings />}
          label="Settings"
          active={location.pathname === "/settings"}
        />
        <button
          className={cn(
            "flex items-center h-10 px-2 rounded-md text-gray-700 hover:bg-gray-100",
            open ? "justify-start" : "justify-center"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          {open && <span className="ml-2">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

interface NavItemProps {
  open: boolean;
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}

function NavItem({
  open,
  href,
  icon,
  label,
  active,
  badge,
}: NavItemProps) {
  const NavButton = (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "w-full justify-start font-normal h-10",
        active
          ? "bg-gray-100 text-uprit-indigo font-medium"
          : "text-gray-700",
        open ? "px-3" : "px-0 justify-center"
      )}
    >
      <Link to={href} className={cn("flex items-center relative", open ? "" : "flex-col")}>
        {React.cloneElement(icon as React.ReactElement, {
          className: "h-5 w-5",
        })}
        {open && <span className="ml-2">{label}</span>}
        {badge !== undefined && (
          <span
            className={cn(
              "flex items-center justify-center rounded-full bg-uprit-indigo text-white",
              open
                ? "absolute right-0 top-0 -mt-1 -mr-1 h-5 w-5 text-xs"
                : "mt-1 h-4 w-4 text-[10px]"
            )}
          >
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </Link>
    </Button>
  );

  if (!open) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
        <TooltipContent side="right" className="ml-2">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return NavButton;
}
