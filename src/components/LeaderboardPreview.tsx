
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  program: string;
  points: number;
  rank: number;
}

const leaderboardUsers: LeaderboardUser[] = [
  {
    id: "1",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    program: "Computer Science",
    points: 875,
    rank: 1
  },
  {
    id: "2",
    name: "Ava Williams",
    avatar: "https://i.pravatar.cc/150?img=24",
    program: "Software Engineering",
    points: 842,
    rank: 2
  },
  {
    id: "3",
    name: "Ethan Brown",
    avatar: "https://i.pravatar.cc/150?img=59",
    program: "Data Science",
    points: 816,
    rank: 3
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "https://i.pravatar.cc/150?img=45",
    program: "Cybersecurity",
    points: 802,
    rank: 4
  },
  {
    id: "5",
    name: "Noah Taylor",
    avatar: "https://i.pravatar.cc/150?img=67",
    program: "Game Design",
    points: 788,
    rank: 5
  },
];

export function LeaderboardPreview() {
  return (
    <div className="space-y-3">
      {leaderboardUsers.map((user) => (
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
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-medium">{user.name}</h4>
              <p className="text-xs text-gray-500">{user.program}</p>
            </div>
          </div>
          <div className="text-sm font-medium">{user.points}</div>
        </div>
      ))}
    </div>
  );
}
