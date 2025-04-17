
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight,
  Github,
  ExternalLink,
  Calendar,
  Users,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/AvatarGroup";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  date: string;
  demoUrl?: string;
  repoUrl?: string;
  team: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: "1",
    title: "EcoCampus - Sustainability Tracker",
    description: "A mobile-first web application that helps students track and reduce their carbon footprint on campus through gamification and community challenges.",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
    tags: ["React", "Firebase", "Sustainability"],
    date: "March 2025",
    demoUrl: "https://example.com",
    repoUrl: "https://github.com",
    team: [
      { id: "1", name: "Alex Chen", avatar: "https://i.pravatar.cc/150?img=3" },
      { id: "2", name: "Maria Lopez", avatar: "https://i.pravatar.cc/150?img=5" },
      { id: "3", name: "David Kim", avatar: "https://i.pravatar.cc/150?img=8" }
    ],
    featured: true
  },
  {
    id: "2",
    title: "StudyConnect - Peer Learning Platform",
    description: "A platform that connects students for study sessions, project collaborations, and skill sharing based on course schedules and learning preferences.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop",
    tags: ["Vue.js", "Node.js", "MongoDB"],
    date: "February 2025",
    demoUrl: "https://example.com",
    repoUrl: "https://github.com",
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
    date: "January 2025",
    demoUrl: "https://example.com",
    team: [
      { id: "6", name: "Emily Chang", avatar: "https://i.pravatar.cc/150?img=32" },
      { id: "7", name: "Michael Scott", avatar: "https://i.pravatar.cc/150?img=15" },
      { id: "8", name: "Jessica Lee", avatar: "https://i.pravatar.cc/150?img=41" }
    ],
    featured: true
  },
  {
    id: "4",
    title: "EventHub - Campus Event Aggregator",
    description: "A centralized platform for discovering campus events, club activities, and academic talks with personalized recommendations and calendar integration.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop",
    tags: ["React", "Express", "PostgreSQL"],
    date: "December 2024",
    demoUrl: "https://example.com",
    repoUrl: "https://github.com",
    team: [
      { id: "9", name: "Ryan Thompson", avatar: "https://i.pravatar.cc/150?img=50" },
      { id: "10", name: "Olivia Martin", avatar: "https://i.pravatar.cc/150?img=44" }
    ]
  },
  {
    id: "5",
    title: "GradPath - Degree Progress Tracker",
    description: "An interactive tool that helps students visualize their degree progress, plan future courses, and explore potential career paths based on their academic choices.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    tags: ["TypeScript", "D3.js", "Express"],
    date: "November 2024",
    demoUrl: "https://example.com",
    team: [
      { id: "11", name: "Daniel Rodriguez", avatar: "https://i.pravatar.cc/150?img=60" },
      { id: "12", name: "Sophia Adams", avatar: "https://i.pravatar.cc/150?img=47" }
    ]
  },
  {
    id: "6",
    title: "MentorMatch - Student-Alumni Connection",
    description: "A platform that connects current students with alumni mentors based on career interests, skills, and industry experience for guidance and networking.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    tags: ["React", "Firebase", "Algolia"],
    date: "October 2024",
    demoUrl: "https://example.com",
    repoUrl: "https://github.com",
    team: [
      { id: "13", name: "Thomas Wilson", avatar: "https://i.pravatar.cc/150?img=40" },
      { id: "14", name: "Emma Garcia", avatar: "https://i.pravatar.cc/150?img=25" }
    ]
  }
];

const Projects = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold">Projects</h1>
            <p className="text-gray-500">Showcase your work and discover projects from other students</p>
          </div>
          <Button className="bg-uprit-indigo hover:bg-uprit-indigo/90">
            <Plus className="h-4 w-4 mr-1" />
            Add Project
          </Button>
        </div>
        
        {/* Featured Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects
            .filter(project => project.featured)
            .map(project => (
              <Card key={project.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.image})` }}
                >
                  <div className="h-full w-full bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 flex flex-col justify-end">
                    <div className="bg-uprit-indigo text-white text-xs font-medium py-1 px-2 rounded-full inline-block mb-2 w-fit">
                      Featured Project
                    </div>
                    <h2 className="text-white text-xl font-bold">{project.title}</h2>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <AvatarGroup>
                        {project.team.map(member => (
                          <Avatar key={member.id}>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <div className="text-sm text-gray-500">
                        {project.team.length} members
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {project.demoUrl && (
                        <Button variant="outline" size="sm" className="text-uprit-indigo">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Demo
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button variant="outline" size="sm" className="text-uprit-indigo">
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
        
        {/* Project Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8 w-full bg-gray-50 border-gray-200 focus-visible:bg-white"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-gray-500">
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            <Select defaultValue="recent">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* All Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow project-card">
              <div 
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${project.image})` }}
              ></div>
              <CardContent className="p-5">
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{project.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Users className="h-3.5 w-3.5" />
                    <span>{project.team.length} members</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 px-5 pb-5 flex justify-between">
                <AvatarGroup max={3}>
                  {project.team.map(member => (
                    <Avatar key={member.id} className="h-7 w-7">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
                <Button variant="outline" size="sm" className="bg-white">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  View Project
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Projects;
