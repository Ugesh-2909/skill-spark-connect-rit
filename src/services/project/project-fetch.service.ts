
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus } from '@/types/project.types';
import { Profile } from '@/types/message.types';
import { createSafeProfile } from '@/utils/project.utils';

/**
 * Fetch all projects with creator profiles
 */
export const fetchAllProjects = async (): Promise<Project[]> => {
  try {
    // Get all projects and their creator's info
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles!created_by(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    if (!data) {
      return [];
    }

    // For each project, get team member profile details
    const projectsWithMembers = await Promise.all(data.map(async (project) => {
      let teamMembers: Profile[] = [];
      
      if (project.members && project.members.length > 0) {
        const { data: memberProfiles, error: membersError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', project.members);
        
        if (membersError) {
          console.error('Error fetching team members:', membersError);
        }
        
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
    
    // Get projects where user is creator or member
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles!created_by(*)
      `)
      .or(`created_by.eq.${userId},members.cs.{${userId}}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user projects:', error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    // For each project, get team member profile details
    const projectsWithMembers = await Promise.all(data.map(async (project) => {
      let teamMembers: Profile[] = [];
      
      if (project.members && project.members.length > 0) {
        const { data: memberProfiles, error: membersError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', project.members);
        
        if (membersError) {
          console.error('Error fetching team members:', membersError);
        }
        
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
  } catch (error) {
    console.error('Error in fetchUserProjects:', error);
    throw error;
  }
};
