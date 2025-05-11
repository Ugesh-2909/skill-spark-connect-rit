
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus } from '@/types/project.types';
import { Profile } from '@/types/message.types';
import { createSafeProfile } from '@/utils/project.utils';

/**
 * Fetch all projects with creator profiles
 */
export const fetchAllProjects = async (): Promise<Project[]> => {
  try {
    // First fetch all projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      throw projectsError;
    }
    
    if (!projectsData || projectsData.length === 0) {
      return [];
    }

    // For each project, get the creator profile and team member profiles separately
    const projectsWithDetails = await Promise.all(projectsData.map(async (project) => {
      // Get creator profile
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', project.created_by)
        .single();
        
      if (creatorError) {
        console.error(`Error fetching creator for project ${project.id}:`, creatorError);
      }
      
      // Get team member profiles if any
      let teamMembers: Profile[] = [];
      if (project.members && project.members.length > 0) {
        const { data: memberProfiles, error: membersError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', project.members);
        
        if (membersError) {
          console.error(`Error fetching team members for project ${project.id}:`, membersError);
        }
        
        if (memberProfiles) {
          teamMembers = memberProfiles;
        }
      }
      
      // Create a safe creator profile object with fallbacks
      const creatorProfile = creatorData 
        ? createSafeProfile(creatorData) 
        : {
            id: project.created_by,
            username: 'unknown',
            full_name: 'Unknown User',
            avatar_url: null
          };
      
      return {
        ...project,
        status: project.status as ProjectStatus,
        creator: creatorProfile,
        team_members: teamMembers
      };
    }));
    
    return projectsWithDetails as Project[];
  } catch (error) {
    console.error('Error in fetchAllProjects:', error);
    throw error;
  }
};

/**
 * Fetch projects for a specific user
 */
export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    if (!userId) return [];
    
    // First fetch projects where user is creator or member
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .or(`created_by.eq.${userId},members.cs.{${userId}}`)
      .order('created_at', { ascending: false });
    
    if (projectsError) {
      console.error('Error fetching user projects:', projectsError);
      throw projectsError;
    }
    
    if (!projectsData || projectsData.length === 0) {
      return [];
    }
    
    // For each project, get the creator profile and team member profiles separately
    const projectsWithDetails = await Promise.all(projectsData.map(async (project) => {
      // Get creator profile
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', project.created_by)
        .single();
        
      if (creatorError) {
        console.error(`Error fetching creator for project ${project.id}:`, creatorError);
      }
      
      // Get team member profiles if any
      let teamMembers: Profile[] = [];
      if (project.members && project.members.length > 0) {
        const { data: memberProfiles, error: membersError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', project.members);
        
        if (membersError) {
          console.error(`Error fetching team members for project ${project.id}:`, membersError);
        }
        
        if (memberProfiles) {
          teamMembers = memberProfiles;
        }
      }
      
      // Create a safe creator profile object with fallbacks
      const creatorProfile = creatorData 
        ? createSafeProfile(creatorData) 
        : {
            id: project.created_by,
            username: 'unknown',
            full_name: 'Unknown User',
            avatar_url: null
          };
      
      return {
        ...project,
        status: project.status as ProjectStatus,
        creator: creatorProfile,
        team_members: teamMembers
      };
    }));
    
    return projectsWithDetails as Project[];
  } catch (error) {
    console.error('Error in fetchUserProjects:', error);
    throw error;
  }
};
