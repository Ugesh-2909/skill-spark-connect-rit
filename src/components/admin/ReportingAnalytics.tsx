
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Download, 
  Calendar, 
  Clock, 
  Filter,
  Share2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userActivityData = [
  { month: "Jan", Logins: 450, Achievements: 120, Comments: 65 },
  { month: "Feb", Logins: 480, Achievements: 150, Comments: 80 },
  { month: "Mar", Logins: 520, Achievements: 180, Comments: 95 },
  { month: "Apr", Logins: 580, Achievements: 220, Comments: 105 },
  { month: "May", Logins: 620, Achievements: 200, Comments: 130 },
  { month: "Jun", Logins: 590, Achievements: 190, Comments: 120 },
  { month: "Jul", Logins: 610, Achievements: 210, Comments: 140 },
];

const achievementCategoryData = [
  { name: "Technical Skills", value: 35 },
  { name: "Academic Excellence", value: 25 },
  { name: "Leadership", value: 20 },
  { name: "Professional Dev", value: 15 },
  { name: "Creative Works", value: 5 },
];

const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#583E81", "#3F2A5C"];

const departmentActivityData = [
  { department: "Computer Science", students: 245, achievements: 890, avgCredits: 68 },
  { department: "Software Engineering", students: 180, achievements: 720, avgCredits: 74 },
  { department: "Computer Engineering", students: 150, achievements: 540, avgCredits: 65 },
  { department: "Information Technology", students: 210, achievements: 680, avgCredits: 59 },
  { department: "Cybersecurity", students: 130, achievements: 520, avgCredits: 71 },
  { department: "Data Science", students: 115, achievements: 480, avgCredits: 76 },
];

export function ReportingAnalytics() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reporting & Analytics</h2>
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Standard Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Analytics Overview</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive metrics and trends across the platform
              </p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="30days">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,843</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">↑ 12%</span> from last month
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,294</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">↑ 8%</span> from last month
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,432</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">↑ 5%</span> from last month
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500">↓ 2%</span> from last month
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>
                  Monthly activity trends across the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Logins" stroke="#9b87f5" strokeWidth={2} />
                    <Line type="monotone" dataKey="Achievements" stroke="#7E69AB" strokeWidth={2} />
                    <Line type="monotone" dataKey="Comments" stroke="#6E59A5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Achievement Categories</CardTitle>
                <CardDescription>
                  Distribution of achievements by category
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={achievementCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {achievementCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Department Activity</CardTitle>
              <CardDescription>
                Achievement statistics by academic department
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={departmentActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="achievements" fill="#9b87f5" name="Total Achievements" />
                  <Bar yAxisId="right" dataKey="avgCredits" fill="#7E69AB" name="Avg. Credits" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard Reports</CardTitle>
              <CardDescription>
                Access pre-built reports for common analysis needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "User Growth Report",
                    description: "Track new user registrations and activity over time",
                    timeEstimate: "1-2 minutes"
                  },
                  {
                    title: "Achievement Distribution",
                    description: "Analyze achievements by category, department, and time period",
                    timeEstimate: "2-3 minutes"
                  },
                  {
                    title: "Leaderboard Analysis",
                    description: "Track leaderboard changes and point accumulation patterns",
                    timeEstimate: "1-2 minutes"
                  },
                  {
                    title: "Verification Metrics",
                    description: "Analyze verification times, approval rates, and rejection reasons",
                    timeEstimate: "2-3 minutes"
                  },
                  {
                    title: "Engagement Report",
                    description: "Measure user engagement with platform features",
                    timeEstimate: "2-3 minutes"
                  },
                  {
                    title: "Content Activity",
                    description: "Track content creation, comments, and interactions",
                    timeEstimate: "1-2 minutes"
                  },
                ].map((report, index) => (
                  <Card key={index} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">{report.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-2">
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {report.timeEstimate}
                      </div>
                      <Button size="sm">Generate</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create tailored reports with specific metrics and filters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Name</label>
                  <input className="w-full rounded-md border border-input bg-background px-3 py-2" placeholder="Enter report name..." />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="w-full flex items-center justify-between">
                      <span>Start Date</span>
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <span>to</span>
                    <Button variant="outline" className="w-full flex items-center justify-between">
                      <span>End Date</span>
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Data Metrics</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                  {[
                    "User Registrations", "Active Users", "New Achievements", 
                    "Verification Rate", "Comments & Likes", "Project Count",
                    "Department Stats", "Category Breakdown", "Credit Distribution",
                    "Leaderboard Changes", "Engagement Metrics", "Content Trends"
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="checkbox" id={`metric-${index}`} className="rounded border-gray-300" />
                      <label htmlFor={`metric-${index}`} className="text-sm">{metric}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Filters</label>
                <div className="border rounded-md p-4 mt-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs">Department</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="se">Software Engineering</SelectItem>
                          <SelectItem value="ce">Computer Engineering</SelectItem>
                          <SelectItem value="it">Information Technology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs">User Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Users" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="students">Students</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                          <SelectItem value="admins">Administrators</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs">Achievement Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="technical">Technical Skills</SelectItem>
                          <SelectItem value="academic">Academic Excellence</SelectItem>
                          <SelectItem value="leadership">Leadership</SelectItem>
                          <SelectItem value="professional">Professional Dev</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Add More Filters
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Visualization Options</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div className="border rounded-md p-3 flex flex-col items-center justify-center cursor-pointer hover:border-uprit-indigo">
                    <BarChart className="h-8 w-8 mb-2" />
                    <span className="text-xs font-medium">Bar Chart</span>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center justify-center cursor-pointer hover:border-uprit-indigo">
                    <LineChart className="h-8 w-8 mb-2" />
                    <span className="text-xs font-medium">Line Chart</span>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center justify-center cursor-pointer hover:border-uprit-indigo">
                    <div className="h-8 w-8 mb-2 rounded-full border-4 border-uprit-indigo" />
                    <span className="text-xs font-medium">Pie Chart</span>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center justify-center cursor-pointer hover:border-uprit-indigo">
                    <div className="h-8 w-8 mb-2 grid grid-cols-2 gap-1">
                      <div className="bg-uprit-indigo"></div>
                      <div className="bg-uprit-indigo opacity-75"></div>
                      <div className="bg-uprit-indigo opacity-50"></div>
                      <div className="bg-uprit-indigo opacity-25"></div>
                    </div>
                    <span className="text-xs font-medium">Table View</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="space-x-2">
              <Button variant="outline">Preview Report</Button>
              <Button>Generate Report</Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-1" />
                Schedule
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Manage automated reporting schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Last Generated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { 
                        name: "Weekly User Activity", 
                        frequency: "Every Monday at 8:00 AM", 
                        recipients: "Admin Team (5 users)", 
                        lastGenerated: "Nov 13, 2023", 
                        status: "Active" 
                      },
                      { 
                        name: "Monthly Achievement Summary", 
                        frequency: "1st of each month", 
                        recipients: "Department Heads (8 users)", 
                        lastGenerated: "Nov 1, 2023", 
                        status: "Active" 
                      },
                      { 
                        name: "Quarterly Engagement Metrics", 
                        frequency: "Every 3 months", 
                        recipients: "Executive Team (3 users)", 
                        lastGenerated: "Oct 1, 2023", 
                        status: "Active" 
                      },
                      { 
                        name: "Verification Audit Report", 
                        frequency: "Every Friday at 4:00 PM", 
                        recipients: "Verification Team (4 users)", 
                        lastGenerated: "Nov 10, 2023", 
                        status: "Paused" 
                      },
                    ].map((report, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.frequency}</TableCell>
                        <TableCell>{report.recipients}</TableCell>
                        <TableCell>{report.lastGenerated}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === "Active" ? "default" : "outline"}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">Run</Button>
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
                <Calendar className="mr-2 h-4 w-4" />
                Schedule New Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
