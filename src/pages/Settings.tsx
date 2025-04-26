import { MainLayout } from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Key, 
  Lock, 
  LogOut, 
  Mail, 
  Shield, 
  Trash2 
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  
  const handleChangePassword = () => {
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully."
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="account" className="mb-6">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Account Tab */}
          <TabsContent value="account">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Email Address</CardTitle>
                <CardDescription>Update your email address and communication preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="jane.doe@rit.edu" type="email" />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="marketing-emails" defaultChecked />
                    <Label htmlFor="marketing-emails" className="cursor-pointer">
                      Receive marketing emails
                    </Label>
                  </div>
                  
                  <Button className="mt-2 bg-uprit-indigo hover:bg-uprit-indigo/90">
                    Update Email
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to maintain account security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <Button className="mt-2 bg-uprit-indigo hover:bg-uprit-indigo/90" onClick={handleChangePassword}>
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions for your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-red-200 p-4">
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Once deleted, your account and all associated data will be permanently removed.
                    </p>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Achievement Milestones</p>
                        <p className="text-sm text-gray-500">Receive emails when you earn new achievements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Connection Requests</p>
                        <p className="text-sm text-gray-500">Receive emails for new connection requests</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Project Updates</p>
                        <p className="text-sm text-gray-500">Receive emails about updates to projects you're part of</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">In-App Notifications</h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Achievement Comments</p>
                        <p className="text-sm text-gray-500">Notify when someone comments on your achievements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Leaderboard Changes</p>
                        <p className="text-sm text-gray-500">Notify when your ranking changes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Team Invitations</p>
                        <p className="text-sm text-gray-500">Notify when you're invited to join a team</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <Button className="mt-4 bg-uprit-indigo hover:bg-uprit-indigo/90">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your data and how your profile is displayed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Profile Visibility</h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Public Profile</p>
                        <p className="text-sm text-gray-500">Allow anyone to view your profile</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Email Address</p>
                        <p className="text-sm text-gray-500">Display your email on your public profile</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show in Leaderboard</p>
                        <p className="text-sm text-gray-500">Include your profile in public leaderboards</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Data Settings</h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activity Tracking</p>
                        <p className="text-sm text-gray-500">Allow the platform to track your activity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data for Recommendations</p>
                        <p className="text-sm text-gray-500">Use your data to improve recommendations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <Button className="mt-4 bg-uprit-indigo hover:bg-uprit-indigo/90">
                    Save Privacy Settings
                  </Button>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Request Data Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
