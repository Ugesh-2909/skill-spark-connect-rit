
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/hooks/use-points';

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  points: number;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  user_id: string;
  verified_at: string | null;
  verified_by: string | null;
  achievement_type?: string;
  difficulty?: string;
}

interface NewAchievement {
  title: string;
  description: string;
  achievement_type?: string;
  difficulty?: string;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { awardPointsForNewAchievement, calculateAchievementPoints } = usePoints();

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is defined, filter by user_id
      if (user) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      // Cast the data to ensure it matches the Achievement type
      setAchievements((data || []) as Achievement[]);
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      toast({
        title: "Failed to load achievements",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAchievements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('achievements')
        .select('*, profiles!inner(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Cast the data to ensure it matches the Achievement type
      setAchievements((data || []) as unknown as Achievement[]);
    } catch (error: any) {
      console.error('Error fetching all achievements:', error);
      toast({
        title: "Failed to load achievements",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAchievement = async (
    title: string, 
    description: string, 
    achievementType: string = 'Course Completion',
    difficulty: string = 'Beginner'
  ) => {
    try {
      if (!user) throw new Error("You must be logged in to add an achievement");

      // Calculate points based on type and difficulty
      const points = calculateAchievementPoints(achievementType, difficulty);

      const { data, error } = await supabase
        .from('achievements')
        .insert([
          { 
            title, 
            description, 
            points,
            user_id: user.id,
            status: 'verified' as const, // Auto-verify achievements
            verified_at: new Date().toISOString(),
            verified_by: user.id, // Self-verify for now
            achievement_type: achievementType,
            difficulty: difficulty
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Award points for the new achievement
      await awardPointsForNewAchievement(user.id, achievementType, difficulty);
      
      // Cast the data and add it to the achievements state
      setAchievements(prev => [(data as Achievement), ...prev]);
      
      toast({
        title: "Achievement added",
        description: `Your achievement has been added and awarded ${points} points`,
      });
      
      return data as Achievement;
    } catch (error: any) {
      console.error('Error adding achievement:', error);
      toast({
        title: "Failed to add achievement",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const verifyAchievement = async (id: string, verified: boolean) => {
    try {
      if (!user) throw new Error("You must be logged in to verify an achievement");

      const status = verified ? 'verified' as const : 'rejected' as const;

      const { data, error } = await supabase
        .from('achievements')
        .update({ 
          status,
          verified_at: verified ? new Date().toISOString() : null,
          verified_by: verified ? user.id : null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update achievements with properly typed data
      setAchievements(prev => 
        prev.map(achievement => 
          achievement.id === id ? (data as Achievement) : achievement
        )
      );
      
      toast({
        title: verified ? "Achievement verified" : "Achievement rejected",
        description: verified ? "The achievement has been verified" : "The achievement has been rejected",
      });
      
      return data as Achievement;
    } catch (error: any) {
      console.error('Error verifying achievement:', error);
      toast({
        title: "Failed to update achievement",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      if (!user) throw new Error("You must be logged in to delete an achievement");

      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAchievements(prev => 
        prev.filter(achievement => achievement.id !== id)
      );
      
      toast({
        title: "Achievement deleted",
        description: "Your achievement has been deleted",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting achievement:', error);
      toast({
        title: "Failed to delete achievement",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  // Subscribe to real-time changes for achievements
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:achievements')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'achievements',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchAchievements();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    achievements,
    loading,
    fetchAchievements,
    fetchAllAchievements,
    addAchievement,
    verifyAchievement,
    deleteAchievement,
  };
}
