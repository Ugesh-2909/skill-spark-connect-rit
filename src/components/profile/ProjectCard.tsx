
import { Heart, Calendar, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/AvatarGroup";
import { Project } from "@/types/project.types";

interface ProjectCardProps {
  project: Project;
  isLiked: boolean;
  onToggleLike: (id: string, type: 'achievement' | 'project') => void;
}

export function ProjectCard({ project, isLiked, onToggleLike }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{project.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{project.description}</p>
            <div className="flex items-center text-gray-500 text-sm mt-2">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
              <Badge className="ml-2" variant="outline">
                {project.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
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
