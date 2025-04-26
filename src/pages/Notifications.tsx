
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function Notifications() {
  const [notifications] = useState([
    {
      id: 1,
      type: "like",
      user: {
        name: "Emily Brown",
        avatar: "https://i.pravatar.cc/150?img=45",
        initials: "EB"
      },
      content: "liked your achievement",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "comment",
      user: {
        name: "Michael Chen",
        avatar: "https://i.pravatar.cc/150?img=12",
        initials: "MC"
      },
      content: "commented on your project",
      time: "5 hours ago"
    },
    {
      id: 3,
      type: "connection",
      user: {
        name: "Sarah Wilson",
        avatar: "https://i.pravatar.cc/150?img=33",
        initials: "SW"
      },
      content: "sent you a connection request",
      time: "1 day ago"
    }
  ]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

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
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Comment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone comments on your content
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Connection Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone sends you a connection request
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <Avatar>
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>{notification.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p>
                        <span className="font-medium">{notification.user.name}</span>
                        {" "}
                        {notification.content}
                      </p>
                      <p className="text-sm text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
