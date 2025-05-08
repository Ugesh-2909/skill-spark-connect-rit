
import { useState } from "react";
import { Heart, Calendar, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/types/project.types";

interface AchievementCardProps {
  achievement: Achievement;
  isOwnProfile: boolean;
  isLiked: boolean;
  onToggleLike: (id: string, type: 'achievement' | 'project') => void;
  onDeleteAchievement: (id: string) => void;
}

export function AchievementCard({
  achievement,
  isOwnProfile,
  isLiked,
  onToggleLike,
  onDeleteAchievement
}: AchievementCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {achievement.image_url && (
          <div className="mb-3">
            <img 
              src={achievement.image_url} 
              alt={achievement.title}
              className="w-full h-32 object-cover rounded-md" 
            />
          </div>
        )}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{achievement.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{new Date(achievement.created_at).toLocaleDateString()}</span>
              </div>
              
              {achievement.achievement_type && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {achievement.achievement_type}
                </span>
              )}
              
              {achievement.difficulty && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  {achievement.difficulty}
                </span>
              )}
              
              {isOwnProfile && (
                <Badge className="ml-2" variant={achievement.status === 'verified' ? 'default' : 'outline'}>
                  {achievement.status}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-uprit-indigo">
              +{achievement.points} pts
            </Badge>
            {isOwnProfile && (
              <Button 
                size="icon" 
                variant="ghost"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDeleteAchievement(achievement.id)}
                title="Delete achievement"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => onToggleLike(achievement.id, 'achievement')}
              className={isLiked ? 'text-red-500' : ''}
            >
              <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
