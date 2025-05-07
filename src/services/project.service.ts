
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
  
  const newProject = {
    title: projectData.title,
    description: projectData.description,
    status: 'planning' as ProjectStatus,
    created_by: userId,
    members: projectData.members || []
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
