
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/hooks/use-points';
import { Achievement } from '@/types/project.types';
import { useAchievementDeletion } from '@/hooks/use-achievement-deletion';
import { useAchievementFetch } from '@/hooks/achievements/use-achievement-fetch';
import { useAchievementCreate } from '@/hooks/achievements/use-achievement-create';
import { useAchievementVerification } from '@/hooks/achievements/use-achievement-verification';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { deleteAchievement: removeAchievement } = useAchievementDeletion();
  
  // Import our refactored functionality
  const { 
    fetchAchievements: fetchAchievementsData, 
    fetchAllAchievements: fetchAllAchievementsData 
  } = useAchievementFetch();
  
  const { addAchievement: createAchievement } = useAchievementCreate();
  const { verifyAchievement: verifyAchievementStatus } = useAchievementVerification();

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAchievementsData(user?.id);
      setAchievements(data || []);
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
  }, [user, toast, fetchAchievementsData]);

  const fetchAllAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllAchievementsData();
      setAchievements(data || []);
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
  }, [toast, fetchAllAchievementsData]);

  const addAchievement = async (
    title: string, 
    description: string, 
    achievementType: string = 'Course Completion',
    difficulty: string = 'Beginner',
    imageFile?: File
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add an achievement",
        variant: "destructive",
      });
      return null;
    }
    
    const achievement = await createAchievement(
      user.id,
      title,
      description,
      achievementType,
      difficulty,
      imageFile
    );
    
    if (achievement) {
      setAchievements(prev => [achievement, ...prev]);
    }
    
    return achievement;
  };

  const verifyAchievement = async (id: string, verified: boolean) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to verify an achievement",
        variant: "destructive",
      });
      return null;
    }
    
    const achievement = await verifyAchievementStatus(user.id, id, verified);
    
    if (achievement) {
      setAchievements(prev => 
        prev.map(item => 
          item.id === id ? achievement : item
        )
      );
    }
    
    return achievement;
  };

  const deleteAchievement = async (id: string) => {
    const success = await removeAchievement(id);
    
    if (success) {
      // Remove the achievement from state to update UI immediately
      setAchievements(prev => 
        prev.filter(achievement => achievement.id !== id)
      );
    }
    
    return success;
  };

  // Fetch user achievements on component mount
  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user, fetchAchievements]);

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
  }, [user, fetchAchievements]);

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
