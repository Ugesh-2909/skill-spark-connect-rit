
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types/project.types';
import { usePoints } from '@/hooks/use-points';

export function useAchievementCreate() {
  const { toast } = useToast();
  const { awardPointsForNewAchievement, calculateAchievementPoints } = usePoints();

  const uploadImage = async (userId: string, imageFile: File): Promise<string | null> => {
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
      const filePath = `${userId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('achievement-images')
        .upload(filePath, imageFile);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('achievement-images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const addAchievement = async (
    userId: string,
    title: string, 
    description: string, 
    achievementType: string = 'Course Completion',
    difficulty: string = 'Beginner',
    imageFile?: File
  ): Promise<Achievement | null> => {
    try {
      if (!userId) throw new Error("User ID is required to add an achievement");

      let imageUrl = null;
      
      // Upload image if provided
      if (imageFile) {
        imageUrl = await uploadImage(userId, imageFile);
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
            user_id: userId,
            status: 'verified' as const,
            verified_at: new Date().toISOString(),
            verified_by: userId,
            achievement_type: achievementType,
            difficulty: difficulty,
            image_url: imageUrl
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Award points for the new achievement
      await awardPointsForNewAchievement(userId, achievementType, difficulty);
      
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

  return { addAchievement };
}
