
import { useState } from "react";
import { Helmet } from "react-helmet";
import { FacultySidebar } from "@/components/faculty/FacultySidebar";
import { Analytics } from "@/components/faculty/Analytics";
import { Skills } from "@/components/faculty/Skills";
import { FacultyProjects } from "@/components/faculty/FacultyProjects";
import { Card, CardContent } from "@/components/ui/card";
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
  Search,
  Filter,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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

export default function Faculty() {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  
  const filteredStudents = studentData.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || student.department === selectedDepartment;
    const matchesDomain = selectedDomain === "all" || student.domain === selectedDomain;
    const matchesYear = selectedYear === "all" || student.year === selectedYear;
    
    return matchesSearch && matchesDepartment && matchesDomain && matchesYear;
  });
  
  // Dashboard component (existing content)
  const renderDashboard = () => (
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
  );
  
  // Leaderboard component (existing content)
  const renderLeaderboard = () => (
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
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
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
  );
  
  return (
    <div className="flex min-h-screen bg-background">
      <FacultySidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <main className="flex-1 flex flex-col">
        <Helmet>
          <title>Faculty Portal | UpRIT</title>
        </Helmet>
        <header className="p-4 border-b flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Prof. Thomas Wilson</h1>
            <p className="text-muted-foreground">Department of Computer Science</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </header>
        <section className="flex-1 p-4 md:p-8 overflow-auto">
          {selectedMenu === "Dashboard" && renderDashboard()}
          {selectedMenu === "Leaderboard" && renderLeaderboard()}
          {selectedMenu === "Analytics" && <Analytics />}
          {selectedMenu === "Projects" && <FacultyProjects />}
          {selectedMenu === "Skills" && <Skills />}
        </section>
      </main>
    </div>
  );
}
