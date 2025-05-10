
import { supabase } from '@/integrations/supabase/client';

/**
 * Upload an achievement image and return the URL
 */
export const uploadAchievementImage = async (userId: string, imageFile: File): Promise<string | null> => {
  try {
    if (!imageFile) return null;
    
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
  } catch (storageError) {
    console.error('Error uploading image:', storageError);
    return null;
  }
};

/**
 * Delete an achievement image by URL
 */
export const deleteAchievementImage = async (imageUrl: string | null): Promise<boolean> => {
  if (!imageUrl || typeof imageUrl !== 'string') return true;
  
  try {
    // Extract the file path from the URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(-2).join('/');
    
    const { error } = await supabase
      .storage
      .from('achievement-images')
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting achievement image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error extracting image path:', error);
    return false;
  }
};
