
import { supabase } from '@/integrations/supabase/client';

export interface ActivityUser {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  program: string | null;
}

export interface ActivityItem {
  id: string;
  type: 'achievement' | 'project' | 'connection';
  user: ActivityUser;
  content: string;
  achievement?: {
    title: string;
    type: string | null;
    points: number;
    difficulty?: string | null;
    image_url?: string | null;
  };
  project?: {
    title: string;
    status: string;
    image_url?: string | null;
  };
  timestamp: string;
  likes: number;
  comments: number;
}

/**
 * Fetch recent activity items
 */
export const fetchActivityItems = async (limit: number = 10): Promise<ActivityItem[]> => {
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
        achievement_type,
        difficulty,
        image_url,
        profiles(id, full_name, username, avatar_url, department)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    if (!achievementsData || achievementsData.length === 0) {
      return [];
    }
    
    // Transform achievements into activity items
    const activityItems: ActivityItem[] = achievementsData.map(item => {
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
          type: item.achievement_type || null,
          points: item.points,
          difficulty: item.difficulty || null,
          image_url: item.image_url || null
        },
        timestamp: item.created_at,
        likes: Math.floor(Math.random() * 20), // Mock data for likes
        comments: Math.floor(Math.random() * 10), // Mock data for comments
      };
    });
    
    return activityItems;
  } catch (error) {
    console.error('Error fetching activity items:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time activity updates
 */
export const subscribeToActivityUpdates = (callback: () => void) => {
  const channel = supabase
    .channel('public:achievements')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'achievements' 
      }, 
      () => {
        callback();
      }
    )
    .subscribe();
    
  return channel;
};
