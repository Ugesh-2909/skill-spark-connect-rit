
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectData, ProjectStatus } from '@/types/project.types';
import { Profile } from '@/types/message.types';
import { createSafeProfile } from '@/utils/project.utils';

/**
 * Fetch all projects with creator profiles
 */
export const fetchAllProjects = async (): Promise<Project[]> => {
  // Get all projects and their creator's info
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      creator:created_by(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  if (!data) {
    return [];
  }

  // For each project, get team member profile details
  const projectsWithMembers = await Promise.all(data.map(async (project) => {
    let teamMembers: Profile[] = [];
    
    if (project.members && project.members.length > 0) {
      const { data: memberProfiles } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', project.members);
      
      if (memberProfiles) {
        teamMembers = memberProfiles;
      }
    }
    
    // Create a safe creator profile object with fallbacks
    const creatorProfile = createSafeProfile(project.creator);
    
    return {
      ...project,
      status: project.status as ProjectStatus,
      creator: creatorProfile,
      team_members: teamMembers
    };
  }));
  
  return projectsWithMembers as Project[];
};

/**
 * Fetch projects for a specific user
 */
export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
  if (!userId) return [];
  
  // Get projects where user is creator or member
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      creator:created_by(*)
    `)
    .or(`created_by.eq.${userId},members.cs.{${userId}}`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  if (!data) {
    return [];
  }
  
  // For each project, get team member profile details
  const projectsWithMembers = await Promise.all(data.map(async (project) => {
    let teamMembers: Profile[] = [];
    
    if (project.members && project.members.length > 0) {
      const { data: memberProfiles } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', project.members);
      
      if (memberProfiles) {
        teamMembers = memberProfiles;
      }
    }
    
    // Create a safe creator profile object with fallbacks
    const creatorProfile = createSafeProfile(project.creator);
    
    return {
      ...project,
      status: project.status as ProjectStatus,
      creator: creatorProfile,
      team_members: teamMembers
    };
  }));
  
  return projectsWithMembers as Project[];
};

/**
 * Create a new project
 */
export const createNewProject = async (userId: string, projectData: ProjectData): Promise<any> => {
  if (!userId) throw new Error("User ID is required to create a project");
  
  // Upload image if provided
  let imageUrl = null;
  if (projectData.image) {
    const fileExt = projectData.image.name.split('.').pop();
    const filePath = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('project-images')
      .upload(filePath, projectData.image);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
    } else {
      const { data } = supabase
        .storage
        .from('project-images')
        .getPublicUrl(filePath);
      
      imageUrl = data.publicUrl;
    }
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
    .select('image_url')
    .eq('id', projectId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching project for deletion:', fetchError);
    throw fetchError;
  }
  
  // If project has an image, delete it from storage
  if (project?.image_url) {
    try {
      // Extract the file path from the URL
      const urlParts = project.image_url.split('/');
      const filePath = urlParts.slice(-2).join('/');
      
      const { error: storageError } = await supabase
        .storage
        .from('project-images')
        .remove([filePath]);
      
      if (storageError) {
        console.error('Error deleting project image:', storageError);
        // Continue with project deletion even if image deletion fails
      }
    } catch (error) {
      console.error('Error extracting image path:', error);
      // Continue with project deletion
    }
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
