
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, MessageSquare, Share2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Achievement } from '@/types/project.types';

interface ActivityItem {
  id: string;
  type: 'achievement' | 'project' | 'connection';
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
    program: string | null;
  };
  content: string;
  achievement?: {
    title: string;
    type: string | null;
    points: number;
    difficulty?: string | null;
  };
  timestamp: string;
  likes: number;
  comments: number;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch all achievements and format them as activity items
  const fetchActivityItems = async () => {
    setLoading(true);
    
    try {
      // Fetch achievements with user profiles
      const { data: achievementsData, error } = await supabase
        .from('achievements')
        .select(`
          id, 
          title, 
          description, 
          points, 
          status, 
          created_at, 
          user_id,
          profiles:user_id(*)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      if (achievementsData) {
        const formattedActivities: ActivityItem[] = achievementsData.map(item => {
          const profile = item.profiles as any; // Type cast to access properties
          
          return {
            id: item.id,
            type: 'achievement',
            user: {
              id: item.user_id,
              name: profile?.full_name || 'Unknown User',
              username: profile?.username || 'unknown',
              avatar: profile?.avatar_url,
              program: profile?.department || 'Student'
            },
            content: `Added a new achievement: ${item.title}`,
            achievement: {
              title: item.title,
              // Use safe optional chaining for possibly undefined properties
              type: null, // We'll set this to null since achievement_type doesn't exist
              points: item.points,
              difficulty: null // Set to null since it doesn't exist
            },
            timestamp: item.created_at,
            likes: Math.floor(Math.random() * 20), // Mock data for likes
            comments: Math.floor(Math.random() * 10), // Mock data for comments
          };
        });
        
        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error('Error fetching activity items:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchActivityItems();
    
    // Set up real-time subscription for new achievements
    const channel = supabase
      .channel('public:achievements')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'achievements' 
        }, 
        () => {
          fetchActivityItems(); // Refresh when new achievements are added
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };
  
  // Mock like functionality
  const handleLike = (id: string) => {
    setActivities(prev => 
      prev.map(item => 
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  if (loading) {
    return <div className="flex justify-center py-10">Loading activities...</div>;
  }

  return (
    <div className="space-y-5">
      {activities.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No activities yet. Be the first to add an achievement!
        </div>
      ) : (
        activities.map((item) => (
          <Card key={item.id} className="overflow-hidden animate-scale-in">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex space-x-3">
                  <Avatar>
                    <AvatarImage src={item.user.avatar || ''} alt={item.user.name} />
                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-sm">{item.user.name}</h3>
                      <span className="text-xs text-gray-500">@{item.user.username}</span>
                    </div>
                    <p className="text-xs text-gray-500">{formatTimestamp(item.timestamp)}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm">{item.content}</p>
                
                {item.achievement && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Award className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.achievement.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {item.achievement.type && (
                            <span className="text-xs text-gray-500 capitalize">{item.achievement.type}</span>
                          )}
                          {item.achievement.difficulty && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                              {item.achievement.difficulty}
                            </span>
                          )}
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-blue-600"
                  onClick={() => handleLike(item.id)}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{item.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{item.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                  <Share2 className="h-4 w-4 mr-1" />
                  <span>Share</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
