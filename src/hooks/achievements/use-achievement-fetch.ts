
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types/project.types';
import { useToast } from '@/hooks/use-toast';

export function useAchievementFetch() {
  const { toast } = useToast();

  const fetchAchievements = useCallback(async (userId?: string): Promise<Achievement[]> => {
    try {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        throw error;
      }
      
      return data as Achievement[] || [];
    } catch (error: any) {
      console.error('Error in fetchAchievements hook:', error);
      toast({
        title: "Failed to load achievements",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const fetchAllAchievements = useCallback(async (): Promise<Achievement[]> => {
    try {
      // First, fetch all achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (achievementsError) {
        throw achievementsError;
      }
      
      if (!achievementsData || achievementsData.length === 0) {
        return [];
      }
      
      // For each achievement, fetch the user profile
      const achievementsWithProfiles = await Promise.all(
        achievementsData.map(async (achievement) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, department')
            .eq('id', achievement.user_id)
            .single();
            
          if (profileError) {
            console.error(`Error fetching profile for achievement ${achievement.id}:`, profileError);
          }
          
          return {
            ...achievement,
            user: profileData || {
              id: achievement.user_id,
              username: 'unknown',
              full_name: 'Unknown User',
              avatar_url: null,
              department: null
            }
          };
        })
      );
      
      return achievementsWithProfiles as Achievement[];
    } catch (error: any) {
      console.error('Error in fetchAllAchievements hook:', error);
      toast({
        title: "Failed to load achievements",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  return { fetchAchievements, fetchAllAchievements };
}
