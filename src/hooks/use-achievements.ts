
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/hooks/use-points';
import { Achievement } from '@/types/project.types';
import { useAchievementDeletion } from '@/hooks/use-achievement-deletion';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { awardPointsForNewAchievement, calculateAchievementPoints } = usePoints();
  const { deleteAchievement: removeAchievement } = useAchievementDeletion();

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
      
      if (data) {
        // Make sure we're setting the correct data type
        setAchievements(data as Achievement[]);
      }
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
      
      if (data) {
        setAchievements(data as unknown as Achievement[]);
      }
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
    difficulty: string = 'Beginner',
    imageFile?: File
  ) => {
    try {
      if (!user) throw new Error("You must be logged in to add an achievement");

      let imageUrl = null;
      
      // Upload image if provided
      if (imageFile) {
        try {
          // Check if storage bucket exists, create if not
          const { data: buckets } = await supabase.storage.listBuckets();
          if (!buckets?.find(b => b.name === 'achievement-images')) {
            await supabase.storage.createBucket('achievement-images', {
              public: true,
              fileSizeLimit: 5242880 // 5MB
            });
          }
          
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('achievement-images')
            .upload(filePath, imageFile);
            
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage
            .from('achievement-images')
            .getPublicUrl(filePath);
            
          imageUrl = data.publicUrl;
        } catch (storageError) {
          console.error('Error uploading image:', storageError);
          // Continue with achievement creation even if image upload fails
        }
      }

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
            status: 'verified' as const,
            verified_at: new Date().toISOString(),
            verified_by: user.id,
            achievement_type: achievementType,
            difficulty: difficulty,
            image_url: imageUrl
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Award points for the new achievement
      await awardPointsForNewAchievement(user.id, achievementType, difficulty);
      
      // Add the new achievement to state
      if (data) {
        setAchievements(prev => [data as Achievement, ...prev]);
      }
      
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
      if (data) {
        setAchievements(prev => 
          prev.map(achievement => 
            achievement.id === id ? (data as Achievement) : achievement
          )
        );
      }
      
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

  // Use our new dedicated hook for deletion and update the UI accordingly
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
