
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, MessageSquare, Share2, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { ActivityItem, fetchActivityItems, subscribeToActivityUpdates } from '@/services/activity.service';
import { useToast } from '@/hooks/use-toast';

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch all achievements and format them as activity items
  const loadActivityItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const activityItems = await fetchActivityItems(10);
      setActivities(activityItems);
    } catch (err: any) {
      console.error('Error loading activity items:', err);
      setError(err.message || 'Failed to load activities');
      toast({
        title: "Error loading activities",
        description: err.message || 'Failed to load activities',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadActivityItems();
    
    // Set up real-time subscription for new achievements
    const channel = subscribeToActivityUpdates(loadActivityItems);
      
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
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-uprit-indigo mb-2" />
        <p className="text-gray-500">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p className="font-medium text-red-500 mb-2">Error loading activities</p>
        <Button variant="outline" onClick={loadActivityItems}>Try Again</Button>
      </div>
    );
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
                    {item.achievement.image_url && (
                      <div className="mb-3">
                        <img 
                          src={item.achievement.image_url} 
                          alt={item.achievement.title}
                          className="w-full h-40 object-cover rounded-md" 
                        />
                      </div>
                    )}
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
