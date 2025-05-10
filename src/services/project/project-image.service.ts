
import { supabase } from '@/integrations/supabase/client';

/**
 * Upload a project image and return the URL
 */
export const uploadProjectImage = async (userId: string, imageFile: File): Promise<string | null> => {
  try {
    if (!imageFile) return null;
    
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('project-images')
      .upload(filePath, imageFile);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    if (uploadData) {
      const { data } = supabase
        .storage
        .from('project-images')
        .getPublicUrl(uploadData.path);
      
      return data.publicUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error in image upload process:', error);
    return null;
  }
};

/**
 * Delete a project image by URL
 */
export const deleteProjectImage = async (imageUrl: string | null): Promise<boolean> => {
  if (!imageUrl || typeof imageUrl !== 'string') return true;
  
  try {
    // Extract the file path from the URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(-2).join('/');
    
    const { error: storageError } = await supabase
      .storage
      .from('project-images')
      .remove([filePath]);
    
    if (storageError) {
      console.error('Error deleting project image:', storageError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error extracting image path:', error);
    return false;
  }
};
