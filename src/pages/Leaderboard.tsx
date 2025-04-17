
import { MainLayout } from "@/layouts/MainLayout";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Filter, Trophy, Medal, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  program: string;
  year: string;
  points: number;
  rank: number;
  achievements: number;
  topCategory: string;
}

const leaderboardUsers: LeaderboardUser[] = [
  {
    id: "1",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    program: "Computer Science",
    year: "Senior",
    points: 875,
    rank: 1,
    achievements: 28,
    topCategory: "Hackathons"
  },
  {
    id: "2",
    name: "Ava Williams",
    avatar: "https://i.pravatar.cc/150?img=24",
    program: "Software Engineering",
    year: "Junior",
    points: 842,
    rank: 2,
    achievements: 25,
    topCategory: "Certifications"
  },
  {
    id: "3",
    name: "Ethan Brown",
    avatar: "https://i.pravatar.cc/150?img=59",
    program: "Data Science",
    year: "Senior",
    points: 816,
    rank: 3,
    achievements: 24,
    topCategory: "Research"
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "https://i.pravatar.cc/150?img=45",
    program: "Cybersecurity",
    year: "Junior",
    points: 802,
    rank: 4,
    achievements: 23,
    topCategory: "CTF Competitions"
  },
  {
    id: "5",
    name: "Noah Taylor",
    avatar: "https://i.pravatar.cc/150?img=67",
    program: "Game Design",
    year: "Sophomore",
    points: 788,
    rank: 5,
    achievements: 22,
    topCategory: "Game Jams"
  },
  {
    id: "6",
    name: "Sophia Martinez",
    avatar: "https://i.pravatar.cc/150?img=25",
    program: "Software Engineering",
    year: "Senior",
    points: 775,
    rank: 6,
    achievements: 21,
    topCategory: "Open Source"
  },
  {
    id: "7",
    name: "William Johnson",
    avatar: "https://i.pravatar.cc/150?img=30",
    program: "Computer Science",
    year: "Junior",
    points: 752,
    rank: 7,
    achievements: 20,
    topCategory: "Algorithms"
  },
  {
    id: "8",
    name: "Olivia Anderson",
    avatar: "https://i.pravatar.cc/150?img=47",
    program: "Digital Media",
    year: "Senior",
    points: 739,
    rank: 8,
    achievements: 19,
    topCategory: "UI/UX Design"
  },
  {
    id: "9",
    name: "James Wilson",
    avatar: "https://i.pravatar.cc/150?img=50",
    program: "Computer Engineering",
    year: "Junior",
    points: 721,
    rank: 9,
    achievements: 18,
    topCategory: "Hardware"
  },
  {
    id: "10",
    name: "Emma Garcia",
    avatar: "https://i.pravatar.cc/150?img=44",
    program: "Information Technology",
    year: "Senior",
    points: 705,
    rank: 10,
    achievements: 17,
    topCategory: "Networking"
  }
];

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  
  // Filter users based on search and filters
  const filteredUsers = leaderboardUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = selectedProgram === "all" || user.program === selectedProgram;
    const matchesYear = selectedYear === "all" || user.year === selectedYear;
    
    return matchesSearch && matchesProgram && matchesYear;
  });
  
  // Get unique programs and years for filters
  const programs = Array.from(new Set(leaderboardUsers.map(user => user.program)));
  const years = Array.from(new Set(leaderboardUsers.map(user => user.year)));
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Leaderboard</h1>
          <p className="text-gray-500">Discover top performing students across various categories</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-yellow-400 p-3">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">#1 Overall</h3>
                    <p className="text-gray-700">Michael Chen</p>
                  </div>
                </div>
                <div className="text-xl font-bold">875 pts</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-blue-500 p-3">
                    <Medal className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">#1 CS Program</h3>
                    <p className="text-gray-700">Michael Chen</p>
                  </div>
                </div>
                <div className="text-xl font-bold">875 pts</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-purple-500 p-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Most Achievements</h3>
                    <p className="text-gray-700">Michael Chen (28)</p>
                  </div>
                </div>
                <div className="text-xl font-bold">28</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
              <div>
                <CardTitle className="text-xl font-bold">Student Rankings</CardTitle>
                <CardDescription>
                  Showing {filteredUsers.length} students sorted by total points
                </CardDescription>
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
                <div className="flex space-x-2">
                  <Select
                    value={selectedProgram}
                    onValueChange={setSelectedProgram}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overall" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overall">Overall</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="department">By Department</TabsTrigger>
                <TabsTrigger value="freshman">Freshman Only</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overall" className="mt-0">
                <div className="relative overflow-x-auto rounded-md border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 w-16 text-center">Rank</th>
                        <th scope="col" className="px-6 py-3">Student</th>
                        <th scope="col" className="px-6 py-3">Program</th>
                        <th scope="col" className="px-6 py-3">Year</th>
                        <th scope="col" className="px-6 py-3">Top Category</th>
                        <th scope="col" className="px-6 py-3 text-center">Achievements</th>
                        <th scope="col" className="px-6 py-3 text-right">Points</th>
                        <th scope="col" className="px-6 py-3 w-24"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr key={user.id} className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-gray-100`}>
                          <td className="px-4 py-4 text-center">
                            <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                              user.rank === 1 ? 'bg-yellow-400 text-white' : 
                              user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                              user.rank === 3 ? 'bg-amber-600 text-white' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {user.rank}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{user.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{user.program}</td>
                          <td className="px-6 py-4">{user.year}</td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {user.topCategory}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">{user.achievements}</td>
                          <td className="px-6 py-4 text-right font-bold">{user.points}</td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="monthly" className="mt-0">
                <div className="p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">April 2025 Rankings</h3>
                  <p className="text-gray-500 mb-4">Coming soon - Monthly rankings will reset at the beginning of each month</p>
                  <Button>
                    Subscribe to Updates
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="department" className="mt-0">
                <div className="p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Department Rankings</h3>
                  <p className="text-gray-500 mb-4">Coming soon - Filter and view rankings by specific departments</p>
                  <Button>
                    Subscribe to Updates
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="freshman" className="mt-0">
                <div className="p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Freshman Rankings</h3>
                  <p className="text-gray-500 mb-4">Coming soon - View rankings for freshman students only</p>
                  <Button>
                    Subscribe to Updates
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Leaderboard;
