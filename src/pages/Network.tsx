
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  UserPlus, 
  Mail, 
  Flag,
  MessagesSquare,
  Briefcase,
  GraduationCap,
  Award,
  Tag
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  avatar: string;
  program: string;
  year: string;
  bio: string;
  skills: string[];
  connections: number;
  achievements: number;
  isConnected?: boolean;
  isPending?: boolean;
}

const users: User[] = [
  {
    id: "1",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    program: "Computer Science",
    year: "Senior",
    bio: "Full stack developer with a passion for AI and machine learning projects. Looking to connect with students interested in research opportunities.",
    skills: ["Python", "TensorFlow", "React", "Node.js"],
    connections: 87,
    achievements: 28,
    isConnected: true
  },
  {
    id: "2",
    name: "Ava Williams",
    avatar: "https://i.pravatar.cc/150?img=24",
    program: "Software Engineering",
    year: "Junior",
    bio: "Mobile app developer specializing in cross-platform solutions. Currently working on a health tech startup and seeking UI/UX collaborators.",
    skills: ["React Native", "Flutter", "Firebase", "UX Design"],
    connections: 64,
    achievements: 25
  },
  {
    id: "3",
    name: "Ethan Brown",
    avatar: "https://i.pravatar.cc/150?img=59",
    program: "Data Science",
    year: "Senior",
    bio: "Data scientist with research experience in NLP and computer vision. Looking for teammates for upcoming hackathons.",
    skills: ["Python", "R", "Computer Vision", "Jupyter"],
    connections: 93,
    achievements: 24,
    isPending: true
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "https://i.pravatar.cc/150?img=45",
    program: "Cybersecurity",
    year: "Junior",
    bio: "Security enthusiast with experience in penetration testing and vulnerability assessment. Interested in connecting with CTF teams.",
    skills: ["Network Security", "Kali Linux", "OWASP", "Cryptography"],
    connections: 58,
    achievements: 23
  },
  {
    id: "5",
    name: "Noah Taylor",
    avatar: "https://i.pravatar.cc/150?img=67",
    program: "Game Design",
    year: "Sophomore",
    bio: "Game designer and developer with a portfolio of indie games. Looking for artists and composers for upcoming game jam projects.",
    skills: ["Unity", "C#", "3D Modeling", "Game Design"],
    connections: 71,
    achievements: 22,
    isConnected: true
  },
  {
    id: "6",
    name: "Sophia Martinez",
    avatar: "https://i.pravatar.cc/150?img=25",
    program: "Software Engineering",
    year: "Senior",
    bio: "Open source contributor and full stack developer. Passionate about web accessibility and inclusive design practices.",
    skills: ["JavaScript", "React", "GraphQL", "Accessibility"],
    connections: 102,
    achievements: 21
  },
  {
    id: "7",
    name: "William Johnson",
    avatar: "https://i.pravatar.cc/150?img=30",
    program: "Computer Science",
    year: "Junior",
    bio: "Algorithm specialist with experience in competitive programming. Looking to mentor students interested in ACM ICPC competitions.",
    skills: ["C++", "Algorithms", "Data Structures", "Problem Solving"],
    connections: 85,
    achievements: 20
  },
  {
    id: "8",
    name: "Olivia Anderson",
    avatar: "https://i.pravatar.cc/150?img=47",
    program: "Digital Media",
    year: "Senior",
    bio: "UI/UX designer with industry experience at major tech companies. Looking to collaborate on social impact projects.",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    connections: 117,
    achievements: 19,
    isPending: true
  }
];

const Network = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Network</h1>
          <p className="text-gray-500">Connect with students, form teams, and discover collaboration opportunities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-uprit-indigo p-3">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Connections</h3>
                    <p className="text-gray-700">36 total connections</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-uprit-purple p-3">
                    <MessagesSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Messages</h3>
                    <p className="text-gray-700">8 unread messages</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-uprit-pink p-3">
                    <Flag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Invitations</h3>
                    <p className="text-gray-700">3 pending invitations</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div>
                <CardTitle className="text-xl font-bold">Discover Students</CardTitle>
                <CardDescription>
                  Find and connect with students based on skills, interests, and programs
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search by name, skill, or program..."
                    className="pl-8 w-full md:w-64 bg-gray-50 border-gray-200 focus-visible:bg-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Select defaultValue="relevant">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevant">Most Relevant</SelectItem>
                      <SelectItem value="connections">Most Connections</SelectItem>
                      <SelectItem value="achievements">Most Achievements</SelectItem>
                      <SelectItem value="recent">Recently Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Students</TabsTrigger>
                <TabsTrigger value="connections">Your Connections</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((user) => (
                    <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{user.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {user.program} • {user.year}
                              </CardDescription>
                            </div>
                          </div>
                          <Button 
                            variant={user.isConnected ? "outline" : user.isPending ? "secondary" : "default"}
                            size="sm"
                            className={user.isConnected ? "text-green-600 border-green-200 bg-green-50" : ""}
                          >
                            {user.isConnected ? "Connected" : user.isPending ? "Pending" : "Connect"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {user.bio}
                        </p>
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4 text-gray-500" />
                            <span className="text-xs text-gray-600">{user.program}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-gray-500" />
                            <span className="text-xs text-gray-600">{user.achievements} achievements</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <UserPlus className="h-4 w-4 text-gray-500" />
                            <span className="text-xs text-gray-600">{user.connections} connections</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <div className="w-full">
                          <p className="text-xs text-gray-500 mb-2 flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            Skills
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {user.skills.map(skill => (
                              <span key={skill} className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="connections" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users
                    .filter(user => user.isConnected)
                    .map((user) => (
                      <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">{user.name}</CardTitle>
                                <CardDescription className="text-xs">
                                  {user.program} • {user.year}
                                </CardDescription>
                              </div>
                            </div>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 bg-green-50"
                            >
                              Connected
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {user.bio}
                          </p>
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-600">{user.program}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-600">{user.achievements} achievements</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <UserPlus className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-600">{user.connections} connections</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <div className="w-full">
                            <p className="text-xs text-gray-500 mb-2 flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              Skills
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {user.skills.map(skill => (
                                <span key={skill} className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users
                    .filter(user => user.isPending)
                    .map((user) => (
                      <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">{user.name}</CardTitle>
                                <CardDescription className="text-xs">
                                  {user.program} • {user.year}
                                </CardDescription>
                              </div>
                            </div>
                            <Button 
                              variant="secondary"
                              size="sm"
                            >
                              Pending
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {user.bio}
                          </p>
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-600">{user.program}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-600">{user.achievements} achievements</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <UserPlus className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-600">{user.connections} connections</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <div className="w-full">
                            <p className="text-xs text-gray-500 mb-2 flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              Skills
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {user.skills.map(skill => (
                                <span key={skill} className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recommended" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users
                    .filter((_, index) => index % 2 === 0 && !users[index].isConnected)
                    .map((user) => (
                      <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-1 px-4 text-xs font-medium text-uprit-indigo">
                          Recommended based on similar skills
                        </div>
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">{user.name}</CardTitle>
                                <CardDescription className="text-xs">
                                  {user.program} • {user.year}
                                </CardDescription>
                              </div>
                            </div>
                            <Button 
                              variant={user.isPending ? "secondary" : "default"}
                              size="sm"
                            >
                              {user.isPending ? "Pending" : "Connect"}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {user.bio}
                          </p>
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-600">{user.program}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-600">{user.achievements} achievements</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <UserPlus className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-600">{user.connections} connections</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <div className="w-full">
                            <p className="text-xs text-gray-500 mb-2 flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              Skills
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {user.skills.map(skill => (
                                <span key={skill} className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Network;
