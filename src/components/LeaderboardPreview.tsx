import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function LeaderboardPreview() {
  const { leaderboard, loading } = useLeaderboard();
  const [topUsers, setTopUsers] = useState<any[]>([]);

  useEffect(() => {
    if (leaderboard.length > 0) {
      // Sort by points and take top 10
      const sortedUsers = [...leaderboard]
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);
      setTopUsers(sortedUsers);
    }
  }, [leaderboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-uprit-indigo" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topUsers.map((user) => (
        <div 
          key={user.id} 
          className={`flex items-center justify-between p-2 rounded-lg ${
            user.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 flex items-center justify-center rounded-full ${
              user.rank === 1 ? 'bg-yellow-400 text-white' : 
              user.rank === 2 ? 'bg-gray-300 text-gray-700' :
              user.rank === 3 ? 'bg-amber-600 text-white' :
              'bg-gray-100 text-gray-700'
            } text-xs font-medium`}>
              {user.rank}
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
              <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-medium">{user.full_name}</h4>
              <p className="text-xs text-gray-500">{user.department || 'Not specified'}</p>
            </div>
          </div>
          <div className="text-sm font-medium">{user.points}</div>
        </div>
      ))}
    </div>
  );
}
