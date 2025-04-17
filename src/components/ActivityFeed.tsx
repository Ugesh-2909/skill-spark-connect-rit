
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, MessageSquare, Share2 } from "lucide-react";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    program: string;
  };
  content: string;
  achievement?: {
    title: string;
    type: string;
    points: number;
  };
  timestamp: string;
  likes: number;
  comments: number;
}

const activityItems: ActivityItem[] = [
  {
    id: "1",
    user: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=3",
      program: "Computer Science"
    },
    content: "Just earned my AWS Cloud Practitioner certification! Excited to keep building my cloud skills.",
    achievement: {
      title: "AWS Certified Cloud Practitioner",
      type: "certification",
      points: 45
    },
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5
  },
  {
    id: "2",
    user: {
      name: "Sophia Martinez",
      avatar: "https://i.pravatar.cc/150?img=25",
      program: "Software Engineering"
    },
    content: "Our team won 2nd place at the RIT Hackathon! We built a sustainability tracking app using React and Firebase.",
    achievement: {
      title: "Hackathon Runner-Up",
      type: "competition",
      points: 75
    },
    timestamp: "5 hours ago",
    likes: 52,
    comments: 12
  },
  {
    id: "3",
    user: {
      name: "David Kim",
      avatar: "https://i.pravatar.cc/150?img=8",
      program: "Game Design & Development"
    },
    content: "Just published my first game on Steam! Check it out if you're interested in puzzle games with a sci-fi twist.",
    timestamp: "1 day ago",
    likes: 86,
    comments: 17
  }
];

export function ActivityFeed() {
  return (
    <div className="space-y-5">
      {activityItems.map((item) => (
        <Card key={item.id} className="overflow-hidden animate-scale-in">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex space-x-3">
                <Avatar>
                  <AvatarImage src={item.user.avatar} alt={item.user.name} />
                  <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-sm">{item.user.name}</h3>
                    <span className="text-xs text-gray-500">{item.user.program}</span>
                  </div>
                  <p className="text-xs text-gray-500">{item.timestamp}</p>
                </div>
              </div>
              <p className="mt-3 text-sm">{item.content}</p>
              
              {item.achievement && (
                <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Award className="h-4 w-4 text-uprit-indigo" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{item.achievement.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 capitalize">{item.achievement.type}</span>
                        <span className="text-xs font-medium py-0.5 px-2 bg-blue-100 text-blue-800 rounded-full">
                          +{item.achievement.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-100 px-4 py-2 flex justify-between text-sm">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-uprit-indigo">
                <Heart className="h-4 w-4 mr-1" />
                <span>{item.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-uprit-indigo">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{item.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-uprit-indigo">
                <Share2 className="h-4 w-4 mr-1" />
                <span>Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
