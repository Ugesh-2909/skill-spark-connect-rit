
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
    // First fetch achievements
    const { data: achievementsData, error: achievementsError } = await supabase
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
        image_url
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (achievementsError) {
      console.error('Supabase error fetching achievements:', achievementsError);
      throw achievementsError;
    }
    
    if (!achievementsData || achievementsData.length === 0) {
      return [];
    }
    
    // For each achievement, get the user profile
    const activityItems: ActivityItem[] = await Promise.all(achievementsData.map(async (item) => {
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, department')
        .eq('id', item.user_id)
        .single();
        
      if (profileError) {
        console.error(`Error fetching profile for achievement ${item.id}:`, profileError);
      }
      
      const profile = profileData || { 
        id: item.user_id, 
        username: 'unknown', 
        full_name: 'Unknown User', 
        avatar_url: null, 
        department: null 
      };
      
      return {
        id: item.id,
        type: 'achievement',
        user: {
          id: profile.id,
          name: profile.full_name || 'Unknown User',
          username: profile.username || 'unknown',
          avatar: profile.avatar_url,
          program: profile.department || 'Student'
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
    }));
    
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
