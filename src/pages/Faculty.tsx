
import { useState } from "react";
import { Helmet } from "react-helmet";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart2,
  Users,
  Trophy,
  Book,
  MessageSquare,
  PieChart,
  Search,
  Filter,
  Share2,
  Map,
  Download,
  Calendar
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const sidebarMenu = [
  { label: "Dashboard", icon: BarChart2 },
  { label: "Leaderboard", icon: Trophy },
  { label: "Analytics", icon: PieChart },
  { label: "Projects", icon: Book },
  { label: "Skills", icon: Users },
  { label: "Achievements", icon: Trophy },
  { label: "Navigation", icon: Map },
  { label: "Communication", icon: MessageSquare },
];

const studentData = [
  {
    id: "1",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    program: "Computer Science",
    year: "Senior",
    domain: "AI/ML",
    department: "GCCIS",
    points: 875,
    rank: 1,
    achievements: 28,
    topSkills: ["Python", "Machine Learning", "Data Analysis"]
  },
  {
    id: "2",
    name: "Ava Williams",
    avatar: "https://i.pravatar.cc/150?img=24",
    program: "Software Engineering",
    year: "Junior",
    domain: "Web Development",
    department: "GCCIS",
    points: 842,
    rank: 2,
    achievements: 25,
    topSkills: ["JavaScript", "React", "Node.js"]
  },
  {
    id: "3",
    name: "Ethan Brown",
    avatar: "https://i.pravatar.cc/150?img=59",
    program: "Data Science",
    year: "Senior",
    domain: "Data Analytics",
    department: "GCCIS",
    points: 816,
    rank: 3,
    achievements: 24,
    topSkills: ["R", "SQL", "Tableau"]
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "https://i.pravatar.cc/150?img=45",
    program: "Cybersecurity",
    year: "Junior",
    domain: "Network Security",
    department: "GCCIS",
    points: 802,
    rank: 4,
    achievements: 23,
    topSkills: ["Network Analysis", "Cryptography", "Penetration Testing"]
  },
  {
    id: "5",
    name: "Noah Taylor",
    avatar: "https://i.pravatar.cc/150?img=67",
    program: "Game Design",
    year: "Sophomore",
    domain: "3D Graphics",
    department: "GCCIS",
    points: 788,
    rank: 5,
    achievements: 22,
    topSkills: ["Unity", "3D Modeling", "Game Design"]
  }
];

const notificationData = [
  { 
    id: 1, 
    type: "like", 
    message: "Michael Chen liked your project review", 
    time: "Just now", 
    read: false,
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  { 
    id: 2, 
    type: "comment", 
    message: "Ava Williams commented on your achievement verification", 
    time: "2 hours ago", 
    read: false,
    avatar: "https://i.pravatar.cc/150?img=24"
  },
  { 
    id: 3, 
    type: "connection", 
    message: "Ethan Brown connected with you", 
    time: "Yesterday", 
    read: true,
    avatar: "https://i.pravatar.cc/150?img=59"
  },
  { 
    id: 4, 
    type: "achievement", 
    message: "Emily Davis earned a new achievement in your course", 
    time: "2 days ago", 
    read: true,
    avatar: "https://i.pravatar.cc/150?img=45"
  }
];

const campusLocations = [
  { id: 1, name: "Golisano College of Computing", description: "Building 70", type: "Academic" },
  { id: 2, name: "Wallace Library", description: "Building 5", type: "Resource" },
  { id: 3, name: "Student Alumni Union", description: "Building 4", type: "Service" },
  { id: 4, name: "Global Village", description: "Building 400-430", type: "Residential" },
  { id: 5, name: "Innovation Center", description: "Building 87", type: "Research" },
];

export default function Faculty() {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  
  // Filter students based on search and filters
  const filteredStudents = studentData.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || student.department === selectedDepartment;
    const matchesDomain = selectedDomain === "all" || student.domain === selectedDomain;
    const matchesYear = selectedYear === "all" || student.year === selectedYear;
    
    return matchesSearch && matchesDepartment && matchesDomain && matchesYear;
  });
  
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-4 border-b flex items-center space-x-2">
          <Book className="h-6 w-6 text-uprit-indigo" />
          <span className="font-display font-bold text-lg text-uprit-indigo">
            Faculty Portal
          </span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarMenu.map((item) => (
              <li key={item.label}>
                <button
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm w-full font-medium ${
                    selectedMenu === item.label
                      ? "bg-uprit-indigo text-white"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                  onClick={() => setSelectedMenu(item.label)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t text-xs text-gray-500">
          <a href="#" className="hover:underline">Help Resources</a> •{" "}
          <a href="#" className="hover:underline">Documentation</a>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <Helmet>
          <title>Faculty Portal | UpRIT</title>
        </Helmet>
        <header className="p-4 border-b flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Faculty Member</h1>
            <p className="text-muted-foreground">Department of Computer Science</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block">
                {/* Notification dropdown content would go here */}
              </div>
            </div>
            <span className="text-sm text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </header>
        <section className="flex-1 p-4 md:p-8 overflow-auto">
          {selectedMenu === "Dashboard" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-6 flex flex-col items-start">
                  <span className="text-xs text-gray-500 mb-1">Department Activity</span>
                  <span className="text-2xl font-bold">52 Achievements</span>
                  <span className="text-xs text-green-600 mt-2">+8% this month</span>
                </Card>
                <Card className="p-6 flex flex-col items-start">
                  <span className="text-xs text-gray-500 mb-1">Top Performer</span>
                  <span className="text-2xl font-bold">Jane Doe</span>
                  <span className="text-xs text-muted-foreground mt-2">CS Major</span>
                </Card>
                <Card className="p-6 flex flex-col items-start">
                  <span className="text-xs text-gray-500 mb-1">Upcoming Events</span>
                  <ul className="text-sm mt-2">
                    <li>• HackRIT 2025 - May 13</li>
                    <li>• Capstone Expo - May 18</li>
                  </ul>
                </Card>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <span className="text-sm font-semibold">Recent Student Achievements</span>
                  <ul className="mt-2 space-y-1">
                    <li>✓ Emma Brown completed AWS Certification</li>
                    <li>✓ Michael Johnson published research paper</li>
                    <li>✓ Sarah Lee led Hackathon team</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <span className="text-sm font-semibold">Notable Projects</span>
                  <ul className="mt-2 space-y-1">
                    <li>• AI-Powered Campus Navigation</li>
                    <li>• Accessibility Web Tools</li>
                    <li>• Cybersecurity Risk Dashboard</li>
                  </ul>
                </Card>
              </div>
              <Card className="p-6">
                <span className="text-sm font-semibold">Activity Timeline</span>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>[Today] Jane Doe awarded "Most Innovative Project"</li>
                  <li>[Yesterday] John Smith climbed to #2 in the leaderboard</li>
                  <li>[2 days ago] New Capstone projects published</li>
                </ul>
              </Card>
            </div>
          )}

          {selectedMenu === "Leaderboard" && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold">Student Leaderboard</h2>
                  <p className="text-muted-foreground">Track and analyze student performance metrics</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search students..."
                      className="pl-8 w-full md:w-64 bg-gray-50 border-gray-200 focus-visible:bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <Select
                        value={selectedDepartment}
                        onValueChange={setSelectedDepartment}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="GCCIS">Computing & Information Sciences</SelectItem>
                          <SelectItem value="KGCOE">Engineering</SelectItem>
                          <SelectItem value="COS">Science</SelectItem>
                          <SelectItem value="CIAS">Art & Design</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500">Domain</label>
                      <Select
                        value={selectedDomain}
                        onValueChange={setSelectedDomain}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Domains" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Domains</SelectItem>
                          <SelectItem value="AI/ML">AI/Machine Learning</SelectItem>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                          <SelectItem value="Network Security">Network Security</SelectItem>
                          <SelectItem value="3D Graphics">3D Graphics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500">Year</label>
                      <Select
                        value={selectedYear}
                        onValueChange={setSelectedYear}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Years</SelectItem>
                          <SelectItem value="Freshman">Freshman</SelectItem>
                          <SelectItem value="Sophomore">Sophomore</SelectItem>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16 text-center">Rank</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Domain</TableHead>
                          <TableHead className="text-center">Achievements</TableHead>
                          <TableHead className="text-right">Points</TableHead>
                          <TableHead className="w-24"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="text-center">
                              <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                                student.rank === 1 ? 'bg-yellow-400 text-white' : 
                                student.rank === 2 ? 'bg-gray-300 text-gray-700' :
                                student.rank === 3 ? 'bg-amber-600 text-white' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {student.rank}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={student.avatar} alt={student.name} />
                                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{student.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{student.program}</TableCell>
                            <TableCell>{student.year}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {student.domain}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{student.achievements}</TableCell>
                            <TableCell className="text-right font-bold">{student.points}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">View Profile</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {selectedMenu === "Navigation" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Campus Navigation</h2>
                <p className="text-muted-foreground">Explore campus facilities and resources</p>
              </div>
              
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Campus Map</CardTitle>
                    <CardDescription>Find your way around RIT campus</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-md h-64 flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Interactive campus map would display here</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="font-medium">Locations Directory</h3>
                          <p className="text-sm text-gray-500">Browse key campus facilities</p>
                        </div>
                        <div className="relative w-64">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                          <Input 
                            type="search"
                            placeholder="Search locations..."
                            className="pl-8 bg-gray-50 border-gray-200"
                          />
                        </div>
                      </div>
                      
                      <div className="border rounded-md divide-y">
                        {campusLocations.map((location) => (
                          <div key={location.id} className="flex justify-between items-center p-4">
                            <div>
                              <h4 className="font-medium">{location.name}</h4>
                              <p className="text-sm text-gray-500">{location.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{location.type}</Badge>
                              <Button size="sm" variant="outline">Details</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedMenu === "Communication" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Communication Center</h2>
                <p className="text-muted-foreground">Stay updated with important notifications</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Recent activity updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {notificationData.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`flex items-start space-x-4 p-3 rounded-md ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                      >
                        <Avatar>
                          <AvatarImage src={notification.avatar} alt="User" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className={`text-sm ${notification.read ? 'font-normal' : 'font-medium'}`}>
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        {!notification.read && (
                          <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    ))}
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm">View All Notifications</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Announcements</CardTitle>
                    <CardDescription>Important updates and information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-uprit-indigo p-3 bg-gray-50 rounded-md">
                      <h4 className="font-medium">Spring Quarter Registration</h4>
                      <p className="text-sm text-gray-600 mt-1">Registration for spring quarter courses begins next week. Please review student prerequisites.</p>
                      <span className="text-xs text-gray-500 mt-2 block">Posted April 20, 2025</span>
                    </div>
                    <div className="border-l-4 border-yellow-400 p-3 bg-yellow-50 rounded-md">
                      <h4 className="font-medium">Faculty Meeting Reminder</h4>
                      <p className="text-sm text-gray-600 mt-1">The monthly faculty meeting is scheduled for tomorrow at 3 PM in the Innovation Center.</p>
                      <span className="text-xs text-gray-500 mt-2 block">Posted April 25, 2025</span>
                    </div>
                    <div className="border-l-4 border-green-500 p-3 bg-green-50 rounded-md">
                      <h4 className="font-medium">Student Project Showcase</h4>
                      <p className="text-sm text-gray-600 mt-1">The end-of-term project showcase will be held on May 15. Please encourage your students to participate.</p>
                      <span className="text-xs text-gray-500 mt-2 block">Posted April 23, 2025</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {(selectedMenu !== "Dashboard" && 
            selectedMenu !== "Leaderboard" && 
            selectedMenu !== "Navigation" && 
            selectedMenu !== "Communication") && (
            <div className="flex items-center justify-center h-64 text-lg text-muted-foreground">
              {selectedMenu} - Coming Soon
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
