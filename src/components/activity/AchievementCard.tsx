
import { Award } from 'lucide-react';

interface AchievementCardProps {
  achievement: {
    title: string;
    type: string | null;
    points: number;
    difficulty?: string | null;
    image_url?: string | null;
  };
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      {achievement.image_url && (
        <div className="mb-3">
          <img 
            src={achievement.image_url} 
            alt={achievement.title}
            className="w-full h-40 object-cover rounded-md" 
          />
        </div>
      )}
      <div className="flex items-center space-x-3">
        <div className="rounded-full bg-blue-100 p-2">
          <Award className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium">{achievement.title}</h4>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {achievement.type && (
              <span className="text-xs text-gray-500 capitalize">{achievement.type}</span>
            )}
            {achievement.difficulty && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {achievement.difficulty}
              </span>
            )}
            <span className="text-xs font-medium py-0.5 px-2 bg-blue-100 text-blue-800 rounded-full">
              +{achievement.points} pts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
