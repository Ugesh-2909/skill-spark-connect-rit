
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { Loader2, Bell } from "lucide-react";

export default function Notifications() {
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    updateNotificationSettings 
  } = useNotifications();
  
  const [settings, setSettings] = useState({
    likes: true,
    comments: true,
    connections: true
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    const newSettings = { ...settings, [setting]: !settings[setting] };
    setSettings(newSettings);
    updateNotificationSettings(newSettings);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {notifications.length > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Like Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone likes your achievements or projects
                    </p>
                  </div>
                  <Switch 
                    checked={settings.likes} 
                    onCheckedChange={() => handleSettingChange('likes')} 
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Comment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone comments on your content
                    </p>
                  </div>
                  <Switch 
                    checked={settings.comments} 
                    onCheckedChange={() => handleSettingChange('comments')} 
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Connection Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone sends you a connection request
                    </p>
                  </div>
                  <Switch 
                    checked={settings.connections} 
                    onCheckedChange={() => handleSettingChange('connections')} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-uprit-indigo" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-10">
                  <Bell className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium text-gray-700">No notifications yet</h3>
                  <p className="text-gray-500">
                    When you receive notifications, they will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start space-x-4 p-3 rounded-lg transition-colors ${
                        notification.read ? 'bg-white' : 'bg-blue-50'
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/150?img=45" />
                        <AvatarFallback>UR</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
