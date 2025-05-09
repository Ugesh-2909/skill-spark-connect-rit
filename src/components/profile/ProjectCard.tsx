
import { Heart, Calendar, Share, Trash, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/AvatarGroup";
import { Project } from "@/types/project.types";
import { ProjectDeleteDialog } from "@/components/project/ProjectDeleteDialog";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectCardProps {
  project: Project;
  isLiked: boolean;
  onToggleLike: (id: string, type: 'achievement' | 'project') => void;
  onDeleteProject?: (id: string) => Promise<void>;
}

export function ProjectCard({ project, isLiked, onToggleLike, onDeleteProject }: ProjectCardProps) {
  const { user } = useAuth();
  const isOwnProject = project.created_by === user?.id;
  const formattedDate = new Date(project.created_at).toLocaleDateString();
  
  const formatTimelineStatus = (status: string | undefined) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {project.image_url && (
          <div className="mb-3">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-32 object-cover rounded-md" 
            />
          </div>
        )}
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{project.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{project.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{formattedDate}</span>
              </div>
              
              <Badge className="ml-2" variant="outline">
                {project.status.replace('_', ' ')}
              </Badge>
              
              {project.timeline_status && (
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{formatTimelineStatus(project.timeline_status)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              {isOwnProject && onDeleteProject && (
                <ProjectDeleteDialog 
                  projectTitle={project.title}
                  onDelete={async () => onDeleteProject(project.id)}
                />
              )}
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onToggleLike(project.id, 'project')}
                className={isLiked ? 'text-red-500' : ''}
              >
                <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
              </Button>
              <Button size="icon" variant="ghost">
                <Share className="h-4 w-4" />
              </Button>
            </div>
            <AvatarGroup max={3}>
              {(project.team_members || []).map((member, i) => (
                <Avatar key={i} className="h-8 w-8">
                  <AvatarImage src={member.avatar_url || undefined} />
                  <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
