
import { supabase } from '@/integrations/supabase/client';
import { ProjectData, ProjectStatus } from '@/types/project.types';
import { uploadProjectImage, deleteProjectImage } from './project-image.service';

/**
 * Create a new project
 */
export const createNewProject = async (userId: string, projectData: ProjectData): Promise<any> => {
  if (!userId) throw new Error("User ID is required to create a project");
  
  // Upload image if provided
  let imageUrl = null;
  if (projectData.image) {
    imageUrl = await uploadProjectImage(userId, projectData.image);
  }
  
  const newProject = {
    title: projectData.title,
    description: projectData.description,
    status: projectData.status || 'planning',
    timeline_status: projectData.timeline_status || 'ongoing',
    start_date: projectData.start_date || null,
    end_date: projectData.end_date || null,
    created_by: userId,
    members: projectData.members || [],
    image_url: imageUrl
  };
  
  const { data, error } = await supabase
    .from('projects')
    .insert([newProject])
    .select('*')
    .single();
  
  if (error) throw error;
  
  return data;
};

/**
 * Update the status of a project
 */
export const updateProjectStatus = async (projectId: string, status: ProjectStatus): Promise<any> => {
  const { data, error } = await supabase
    .from('projects')
    .update({ status })
    .match({ id: projectId })
    .select('*')
    .single();
  
  if (error) throw error;
  
  return data;
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId: string): Promise<boolean> => {
  // First check if the project has an image to delete
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();
  
  if (fetchError) {
    console.error('Error fetching project for deletion:', fetchError);
    throw fetchError;
  }
  
  // If project has an image, delete it from storage
  if (project && project.image_url && typeof project.image_url === 'string') {
    await deleteProjectImage(project.image_url);
  }
  
  // Delete the project
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
  
  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
  
  return true;
};
