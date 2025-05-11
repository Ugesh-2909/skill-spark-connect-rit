
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types/project.types';
import { uploadAchievementImage, deleteAchievementImage } from '@/services/achievement/achievement-image.service';

/**
 * Fetch achievements for a specific user
 */
export const fetchUserAchievements = async (userId: string): Promise<Achievement[]> => {
  try {
    if (!userId) throw new Error("User ID is required");
    
    let query = supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    
    return data as Achievement[] || [];
  } catch (error: any) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
};

/**
 * Fetch all achievements with user profiles
 */
export const fetchAllAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*, profiles!inner(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data as unknown as Achievement[] || [];
  } catch (error: any) {
    console.error('Error fetching all achievements:', error);
    throw error;
  }
};

/**
 * Add a new achievement
 */
export const addAchievement = async (
  userId: string,
  title: string, 
  description: string, 
  achievementType: string = 'Course Completion',
  difficulty: string = 'Beginner',
  points: number,
  imageFile?: File
): Promise<Achievement | null> => {
  try {
    if (!userId) throw new Error("User ID is required to add an achievement");

    let imageUrl = null;
    
    // Upload image if provided
    if (imageFile) {
      try {
        imageUrl = await uploadAchievementImage(userId, imageFile);
      } catch (storageError) {
        console.error('Error uploading image:', storageError);
        // Continue with achievement creation even if image upload fails
      }
    }

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
    
    return data as Achievement;
  } catch (error: any) {
    console.error('Error adding achievement:', error);
    throw error;
  }
};

/**
 * Verify an achievement
 */
export const verifyAchievement = async (
  userId: string,
  achievementId: string, 
  verified: boolean
): Promise<Achievement | null> => {
  try {
    if (!userId) throw new Error("User ID is required to verify an achievement");

    const status = verified ? 'verified' as const : 'rejected' as const;

    const { data, error } = await supabase
      .from('achievements')
      .update({ 
        status,
        verified_at: verified ? new Date().toISOString() : null,
        verified_by: verified ? userId : null
      })
      .eq('id', achievementId)
      .select()
      .single();

    if (error) throw error;
    
    return data as Achievement;
  } catch (error: any) {
    console.error('Error verifying achievement:', error);
    throw error;
  }
};

/**
 * Delete an achievement
 */
export const deleteAchievement = async (achievementId: string): Promise<boolean> => {
  try {
    // First check if the achievement has an image to delete
    const { data: achievement, error: fetchError } = await supabase
      .from('achievements')
      .select('image_url')
      .eq('id', achievementId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching achievement for deletion:', fetchError);
      throw fetchError;
    }
    
    // If achievement has an image, delete it from storage
    if (achievement && achievement.image_url) {
      await deleteAchievementImage(achievement.image_url);
    }
    
    // Delete the achievement
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', achievementId);
    
    if (error) {
      console.error('Error deleting achievement:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in achievement deletion process:', error);
    return false;
  }
};
