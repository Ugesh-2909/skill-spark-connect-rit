
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, MessageSquare, Share2, Loader2, RefreshCcw } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { ActivityItem, fetchActivityItems, subscribeToActivityUpdates } from '@/services/activity.service';
import { useToast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/activity/EmptyState';
import { AchievementCard } from '@/components/activity/AchievementCard';
import { ActivityActions } from '@/components/activity/ActivityActions';

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch all achievements and format them as activity items
  const loadActivityItems = useCallback(async () => {
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
  }, [toast]);
  
  useEffect(() => {
    loadActivityItems();
    
    // Set up real-time subscription for new achievements
    const channel = subscribeToActivityUpdates(loadActivityItems);
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadActivityItems]);

  if (loading) {
    return <ActivityLoadingState />;
  }

  if (error) {
    return <ActivityErrorState onRetry={loadActivityItems} />;
  }

  if (activities.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-5">
      {activities.map((item) => (
        <ActivityItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// Component for loading state
function ActivityLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className="h-8 w-8 animate-spin text-uprit-indigo mb-2" />
      <p className="text-gray-500">Loading activities...</p>
    </div>
  );
}

// Component for error state
function ActivityErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-10 text-gray-500">
      <p className="font-medium text-red-500 mb-2">Error loading activities</p>
      <Button variant="outline" onClick={onRetry} className="mt-2 gap-2">
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

// Component for each activity item
function ActivityItemCard({ item }: { item: ActivityItem }) {
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };
  
  return (
    <Card key={item.id} className="overflow-hidden animate-scale-in">
      <CardContent className="p-0">
        <div className="p-4">
          <ActivityHeader 
            user={item.user}
            timestamp={formatTimestamp(item.timestamp)}
          />
          <p className="mt-3 text-sm">{item.content}</p>
          
          {item.achievement && (
            <AchievementCard achievement={item.achievement} />
          )}
        </div>
        
        <ActivityActions 
          itemId={item.id}
          likes={item.likes}
          comments={item.comments} 
        />
      </CardContent>
    </Card>
  );
}

// Component for activity header with user info
function ActivityHeader({ user, timestamp }: { user: ActivityItem['user'], timestamp: string }) {
  return (
    <div className="flex space-x-3">
      <Avatar>
        <AvatarImage src={user.avatar || ''} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-sm">{user.name}</h3>
          <span className="text-xs text-gray-500">@{user.username}</span>
        </div>
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
}
