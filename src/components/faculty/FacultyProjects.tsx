import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/AvatarGroup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpRight, Calendar, Users, Check, Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  status: "In Progress" | "Completed" | "Needs Review";
  date: string;
  team: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  course: string;
}

const projectsData: Project[] = [
  {
    id: "1",
    title: "EcoCampus - Sustainability Tracker",
    description: "A mobile-first web application that helps students track and reduce their carbon footprint on campus through gamification and community challenges.",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
    tags: ["React", "Firebase", "Sustainability"],
    status: "Completed",
    date: "March 2025",
    course: "Web Application Development",
    team: [
      { id: "1", name: "Alex Chen", avatar: "https://i.pravatar.cc/150?img=3" },
      { id: "2", name: "Maria Lopez", avatar: "https://i.pravatar.cc/150?img=5" },
      { id: "3", name: "David Kim", avatar: "https://i.pravatar.cc/150?img=8" }
    ]
  },
  {
    id: "2",
    title: "StudyConnect - Peer Learning Platform",
    description: "A platform that connects students for study sessions, project collaborations, and skill sharing based on course schedules and learning preferences.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop",
    tags: ["Vue.js", "Node.js", "MongoDB"],
    status: "In Progress",
    date: "February 2025",
    course: "Full Stack Development",
    team: [
      { id: "4", name: "Sarah Williams", avatar: "https://i.pravatar.cc/150?img=24" },
      { id: "5", name: "James Brown", avatar: "https://i.pravatar.cc/150?img=12" }
    ]
  },
  {
    id: "3",
    title: "CampusNav - AR Navigation",
    description: "An augmented reality application that helps new students navigate campus, find classrooms, and discover resources using their smartphone camera.",
    image: "https://images.unsplash.com/photo-1484626004579-c6e53d6896d8?q=80&w=1974&auto=format&fit=crop",
    tags: ["AR", "Unity", "Mobile"],
    status: "Needs Review",
    date: "January 2025",
    course: "Mobile Computing",
    team: [
      { id: "6", name: "Emily Chang", avatar: "https://i.pravatar.cc/150?img=32" },
      { id: "7", name: "Michael Scott", avatar: "https://i.pravatar.cc/150?img=15" },
      { id: "8", name: "Jessica Lee", avatar: "https://i.pravatar.cc/150?img=41" }
    ]
  },
  {
    id: "4",
    title: "EventHub - Campus Event Aggregator",
    description: "A centralized platform for discovering campus events, club activities, and academic talks with personalized recommendations and calendar integration.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop",
    tags: ["React", "Express", "PostgreSQL"],
    status: "In Progress",
    date: "December 2024",
    course: "Advanced Database Systems",
    team: [
      { id: "9", name: "Ryan Thompson", avatar: "https://i.pravatar.cc/150?img=50" },
      { id: "10", name: "Olivia Martin", avatar: "https://i.pravatar.cc/150?img=44" }
    ]
  }
];

export function FacultyProjects() {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Student Projects</h2>
          <p className="text-muted-foreground mb-6">Monitor and review student projects across your courses</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8 w-full bg-gray-50 border-gray-200 focus-visible:bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select defaultValue="all-courses">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-courses">All Courses</SelectItem>
                <SelectItem value="web-dev">Web Application Development</SelectItem>
                <SelectItem value="full-stack">Full Stack Development</SelectItem>
                <SelectItem value="mobile">Mobile Computing</SelectItem>
                <SelectItem value="db">Advanced Database Systems</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all-status">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Statuses</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="review">Needs Review</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="h-10">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          {projectsData.map(project => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${project.image})` }}
              >
                <div className="h-full bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 flex items-end">
                  <Badge className={
                    project.status === "Completed" ? "bg-green-500" :
                    project.status === "In Progress" ? "bg-blue-500" : 
                    "bg-amber-500"
                  }>
                    {project.status === "Completed" && <Check className="h-3 w-3 mr-1" />}
                    {project.status === "Needs Review" && <Flag className="h-3 w-3 mr-1" />}
                    {project.status}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <p className="text-sm text-gray-500">{project.course}</p>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{project.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{project.team.length} members</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center">
                <AvatarGroup>
                  {project.team.map(member => (
                    <Avatar key={member.id} className="h-7 w-7">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Review Project
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
