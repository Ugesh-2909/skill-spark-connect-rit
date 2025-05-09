
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

export function useAchievementDeletion() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const deleteAchievement = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete achievements",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsDeleting(true);

      // Get the achievement to check if it has an image and to get points value
      const { data: achievement, error: fetchError } = await supabase
        .from('achievements')
        .select('image_url, points, user_id')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;

      // Make sure this user owns the achievement
      if (achievement.user_id !== user.id) {
        throw new Error("You can only delete your own achievements");
      }
      
      // Get current user points
      const { data: pointsData, error: pointsError } = await supabase
        .from('points_log')
        .select('points')
        .eq('user_id', user.id);
        
      if (pointsError) throw pointsError;
      
      // Calculate total points
      const userPoints = pointsData.reduce((total, entry) => total + entry.points, 0);
      
      // Only deduct points if user has enough points (don't go below zero)
      if (achievement && achievement.points && achievement.points <= userPoints) {
        // Insert negative points entry to counteract the achievement points
        await supabase
          .from('points_log')
          .insert([
            {
              user_id: user.id,
              points: -achievement.points, // Negative points to deduct
              activity: 'achievement_deleted'
            }
          ]);
      } else {
        console.log('Not deducting points as it would result in negative balance');
      }
        
      // Delete the achievement's image if it exists
      if (achievement?.image_url) {
        try {
          const imagePath = achievement.image_url.split('/').slice(-2).join('/');
          await supabase.storage
            .from('achievement-images')
            .remove([imagePath]);
        } catch (deleteImageError) {
          console.error('Error deleting image:', deleteImageError);
          // Continue with achievement deletion even if image deletion fails
        }
      }

      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Achievement deleted",
        description: "Your achievement has been deleted and points have been adjusted",
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
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAchievement,
    isDeleting
  };
}
