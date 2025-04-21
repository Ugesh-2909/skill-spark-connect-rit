
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Save, 
  RefreshCw, 
  Palette, 
  Mail, 
  Key, 
  Globe, 
  LucideProps, 
  Upload,
  ArrowRight,
  Check
} from "lucide-react";

const SettingToggle = ({ 
  title, 
  description, 
  checked = false, 
  icon: Icon 
}: { 
  title: string, 
  description: string, 
  checked?: boolean, 
  icon: React.FC<LucideProps> 
}) => {
  return (
    <div className="flex items-start space-x-4 rounded-md border p-4">
      <div className="mt-0.5">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-none">{title}</p>
          <Switch checked={checked} />
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export function SystemConfiguration() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">System Configuration</h2>
      
      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="api">API & Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the UpRIT platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input type="color" value="#9b87f5" className="w-20 h-10" />
                  <Input value="#9b87f5" className="w-32" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <Input type="color" value="#7E69AB" className="w-20 h-10" />
                  <Input value="#7E69AB" className="w-32" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                  <div className="mb-4 rounded-full bg-gray-100 p-2">
                    <Upload className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your logo or click to browse
                  </p>
                  <Button variant="outline" size="sm">Select File</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Font Family</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Headings</Label>
                    <Input value="Inter" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Body</Label>
                    <Input value="Inter" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingToggle 
                  title="Dark Mode Support" 
                  description="Allow users to switch between light and dark mode" 
                  checked={true}
                  icon={Palette}
                />
                
                <SettingToggle 
                  title="Custom CSS" 
                  description="Enable custom CSS for advanced styling" 
                  checked={false}
                  icon={Palette}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Appearance Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notification Templates</CardTitle>
              <CardDescription>
                Customize email notifications sent to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Template Selection</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {["Welcome Email", "Achievement Verification", "Comment Notification", "Weekly Digest", "Password Reset"].map((template, index) => (
                    <Button 
                      key={index} 
                      variant={index === 0 ? "default" : "outline"} 
                      className="justify-start"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      {template}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <Label>Template: Welcome Email</Label>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset to Default
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject Line</Label>
                    <Input value="Welcome to UpRIT - Your Academic Achievement Platform" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email Content</Label>
                    <Textarea 
                      className="min-h-[200px]" 
                      value={`Hi {{name}},

Welcome to UpRIT! We're excited to have you join our platform designed to showcase your academic achievements and connect with peers.

To get started:
1. Complete your profile
2. Add your first achievement
3. Explore the leaderboard

Your account details:
- Username: {{username}}
- Email: {{email}}

If you have any questions, please don't hesitate to contact us.

Best regards,
The UpRIT Team`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Available Variables</Label>
                    <div className="flex flex-wrap gap-2">
                      {["{{name}}", "{{username}}", "{{email}}", "{{date}}", "{{institution}}"].map((variable, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure when and how notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="digest" checked />
                    <Label htmlFor="digest">Send weekly activity digest</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="achievements" checked />
                    <Label htmlFor="achievements">Achievement verification notifications</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="comments" checked />
                    <Label htmlFor="comments">Comment notifications</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="leaderboard" checked />
                    <Label htmlFor="leaderboard">Leaderboard position changes</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="system" checked />
                    <Label htmlFor="system">System announcements</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>
                Enable or disable platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <SettingToggle 
                  title="Achievement Verification" 
                  description="Enable verification process for submitted achievements" 
                  checked={true}
                  icon={Check}
                />
                
                <SettingToggle 
                  title="User Commenting" 
                  description="Allow users to comment on achievements and projects" 
                  checked={true}
                  icon={Globe}
                />
                
                <SettingToggle 
                  title="Leaderboard" 
                  description="Enable the gamified leaderboard functionality" 
                  checked={true}
                  icon={ArrowRight}
                />
                
                <SettingToggle 
                  title="Team Formation" 
                  description="Allow users to create and join teams" 
                  checked={true}
                  icon={Key}
                />
                
                <SettingToggle 
                  title="Direct Messaging" 
                  description="Enable direct messaging between users" 
                  checked={false}
                  icon={Mail}
                />
                
                <SettingToggle 
                  title="Faculty Endorsements" 
                  description="Allow faculty to endorse student achievements" 
                  checked={true}
                  icon={Check}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Feature Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key Name</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { 
                        name: "Canvas Integration", 
                        permissions: "Read Achievements, User Profiles", 
                        created: "Oct 15, 2023", 
                        status: "Active" 
                      },
                      { 
                        name: "GitHub Integration", 
                        permissions: "Read Projects, Write Achievements", 
                        created: "Nov 1, 2023", 
                        status: "Active" 
                      },
                      { 
                        name: "LinkedIn Export", 
                        permissions: "Read Achievements, Read Projects", 
                        created: "Nov 10, 2023", 
                        status: "Active" 
                      },
                    ].map((key, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>{key.permissions}</TableCell>
                        <TableCell>{key.created}</TableCell>
                        <TableCell>
                          <Badge variant={key.status === "Active" ? "default" : "outline"}>
                            {key.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">Revoke</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Key className="mr-2 h-4 w-4" />
                Generate New API Key
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
              <CardDescription>
                Configure external service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: "Canvas LMS",
                  description: "Sync achievements with Canvas LMS",
                  connected: true
                },
                {
                  name: "GitHub",
                  description: "Import projects and contributions from GitHub",
                  connected: true
                },
                {
                  name: "LinkedIn",
                  description: "Allow users to export achievements to LinkedIn",
                  connected: false
                },
                {
                  name: "Google Calendar",
                  description: "Sync events and deadlines with Google Calendar",
                  connected: false
                },
              ].map((integration, index) => (
                <div key={index} className="flex items-start space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{integration.name}</p>
                      <Badge variant={integration.connected ? "default" : "outline"}>
                        {integration.connected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                  <Button variant={integration.connected ? "outline" : "default"} size="sm">
                    {integration.connected ? "Configure" : "Connect"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
