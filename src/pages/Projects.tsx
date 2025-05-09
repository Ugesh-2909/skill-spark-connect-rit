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
  Clock
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/hooks/use-projects";
import { useState, useEffect } from "react";
import { ProjectForm } from "@/components/project/ProjectForm";
import { Badge } from "@/components/ui/badge";
import { ProjectDeleteDialog } from "@/components/project/ProjectDeleteDialog";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const Projects = () => {
  const { projects, userProjects, loadingProjects, fetchProjects, deleteProject } = useProjects();
  const { user } = useAuth();
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timelineFilter, setTimelineFilter] = useState<string | null>(null);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Filter projects based on search term and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm 
      ? project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      : true;
      
    const matchesStatusFilter = filter ? project.status === filter : true;
    
    const matchesTimelineFilter = timelineFilter 
      ? project.timeline_status === timelineFilter 
      : true;
      
    return matchesSearch && matchesStatusFilter && matchesTimelineFilter;
  });
  
  const featuredProjects = filteredProjects.filter(project => project.status === 'completed').slice(0, 2);
  
  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
  };

  return (
    <MainLayout>
      <ScrollArea className="h-full">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-display font-bold">Projects</h1>
              <p className="text-gray-500">Showcase your work and discover projects from other students</p>
            </div>
            <ProjectForm onSuccess={fetchProjects} />
          </div>
          
          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredProjects.map(project => (
                  <Card key={project.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                    {project.image_url ? (
                      <div 
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${project.image_url})` }}
                      >
                        <div className="h-full w-full bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 flex flex-col justify-end">
                          <div className="bg-uprit-indigo text-white text-xs font-medium py-1 px-2 rounded-full inline-block mb-2 w-fit">
                            Featured Project
                          </div>
                          <h2 className="text-white text-xl font-bold">{project.title}</h2>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600 p-6 flex flex-col justify-end">
                        <div className="bg-uprit-indigo text-white text-xs font-medium py-1 px-2 rounded-full inline-block mb-2 w-fit">
                          Featured Project
                        </div>
                        <h2 className="text-white text-xl font-bold">{project.title}</h2>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">
                          {project.status.replace('_', ' ')}
                        </Badge>
                        {project.timeline_status && (
                          <Badge variant="secondary">
                            {project.timeline_status.charAt(0).toUpperCase() + project.timeline_status.slice(1)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <AvatarGroup>
                            {project.team_members?.map((member, index) => (
                              <Avatar key={index}>
                                <AvatarImage src={member.avatar_url || undefined} />
                                <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                          </AvatarGroup>
                          <div className="text-sm text-gray-500">
                            {project.team_members?.length ?? 0} members
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="text-uprit-indigo">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Demo
                          </Button>
                          <Button variant="outline" size="sm" className="text-uprit-indigo">
                            <Github className="h-4 w-4 mr-1" />
                            Code
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Project Filter Tabs */}
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="my">My Projects</TabsTrigger>
              </TabsList>
              <div className="flex space-x-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-8 w-full bg-gray-50 border-gray-200 focus-visible:bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Select value={filter || "all-statuses"} onValueChange={(val) => setFilter(val === "all-statuses" ? null : val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timelineFilter || "all-timelines"} onValueChange={(val) => setTimelineFilter(val === "all-timelines" ? null : val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-timelines">All Timelines</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                  <SelectItem value="future">Future</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-gray-500">No projects found. Try adjusting your filters.</p>
                  </div>
                ) : (
                  filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      user={user} 
                      onDelete={handleDeleteProject} 
                    />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="my" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.length === 0 ? (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-gray-500">You haven't created any projects yet.</p>
                    <ProjectForm onSuccess={fetchProjects} />
                  </div>
                ) : (
                  userProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      user={user} 
                      onDelete={handleDeleteProject}
                      isOwnProject={true}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </MainLayout>
  );
};

// Project Card component specifically for the Projects page
const ProjectCard = ({ project, user, onDelete, isOwnProject = false }) => {
  const isOwner = isOwnProject || project.created_by === user?.id;
  const formattedDate = new Date(project.created_at).toLocaleDateString();

  return (
    <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      {project.image_url ? (
        <div 
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.image_url})` }}
        ></div>
      ) : (
        <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No image</span>
        </div>
      )}
      <CardContent className="p-5 flex-grow">
        <h3 className="font-bold text-lg mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="outline">
            {project.status.replace('_', ' ')}
          </Badge>
          {project.timeline_status && (
            <Badge variant="secondary" className="capitalize">
              {project.timeline_status}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span className="capitalize">{project.timeline_status || 'ongoing'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 px-5 pb-5 flex justify-between">
        <AvatarGroup max={3}>
          {project.team_members?.map((member, i) => (
            <Avatar key={i} className="h-7 w-7">
              <AvatarImage src={member.avatar_url || undefined} />
              <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
        <div className="flex items-center space-x-2">
          {isOwner && (
            <ProjectDeleteDialog
              projectTitle={project.title}
              onDelete={async () => onDelete(project.id)}
            />
          )}
          <Button variant="outline" size="sm" className="bg-white">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            View Project
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Projects;
