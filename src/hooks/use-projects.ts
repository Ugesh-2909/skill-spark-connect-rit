import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'archived';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  created_by: string;
  created_at: string;
  members: string[] | null;
  creator?: Profile;
  team_members?: Profile[];
}

interface ProjectData {
  title: string;
  description: string;
  members?: string[];
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      
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
        setProjects([]);
        return;
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
        
        // Ensure creator is properly typed
        let creatorProfile: Profile | undefined = undefined;
        
        if (project.creator && typeof project.creator === 'object') {
          creatorProfile = {
            // Use nullish coalescing to handle potentially null values
            id: project.creator?.id ?? '',
            username: project.creator?.username ?? '',
            full_name: project.creator?.full_name ?? '',
            avatar_url: project.creator?.avatar_url
          };
        }
        
        return {
          ...project,
          status: project.status as ProjectStatus,
          creator: creatorProfile,
          team_members: teamMembers
        };
      }));
      
      setProjects(projectsWithMembers as Project[]);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Failed to load projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchUserProjects = async () => {
    try {
      if (!user) return;
      
      setLoadingProjects(true);
      
      // Get projects where user is creator or member
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          creator:created_by(*)
        `)
        .or(`created_by.eq.${user.id},members.cs.{${user.id}}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data) {
        setUserProjects([]);
        return;
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
        
        // Ensure creator is properly typed
        let creatorProfile: Profile | undefined = undefined;
        
        if (project.creator && typeof project.creator === 'object') {
          creatorProfile = {
            // Use nullish coalescing to handle potentially null values
            id: project.creator?.id ?? '',
            username: project.creator?.username ?? '',
            full_name: project.creator?.full_name ?? '',
            avatar_url: project.creator?.avatar_url
          };
        }
        
        return {
          ...project,
          status: project.status as ProjectStatus,
          creator: creatorProfile,
          team_members: teamMembers
        };
      }));
      
      setUserProjects(projectsWithMembers as Project[]);
    } catch (error: any) {
      console.error('Error fetching user projects:', error);
      toast({
        title: "Failed to load your projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingProjects(false);
    }
  };

  const createProject = async (projectData: ProjectData) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create projects",
          variant: "destructive",
        });
        return null;
      }
      
      const newProject = {
        title: projectData.title,
        description: projectData.description,
        status: 'planning' as ProjectStatus,
        created_by: user.id,
        members: projectData.members || []
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Update projects lists
      setProjects((prev) => {
        const createdProject = {
          ...data,
          creator: {
            id: user.id,
            username: user.email || '',
            full_name: user.user_metadata?.full_name || user.email || '',
            avatar_url: user.user_metadata?.avatar_url || null
          },
          team_members: [] as Profile[],
          status: data.status as ProjectStatus
        };
        
        return [createdProject, ...prev];
      });
      
      setUserProjects((prev) => {
        const createdProject = {
          ...data,
          creator: {
            id: user.id,
            username: user.email || '',
            full_name: user.user_metadata?.full_name || user.email || '',
            avatar_url: user.user_metadata?.avatar_url || null
          },
          team_members: [] as Profile[],
          status: data.status as ProjectStatus
        };
        
        return [createdProject, ...prev];
      });
      
      toast({
        title: "Project created",
        description: `Successfully created "${projectData.title}"`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Failed to create project",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProjectStatus = async (projectId: string, status: ProjectStatus) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ status })
        .match({ id: projectId })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Update projects lists with the modified project
      const projectStatusMapping = (project: Project) => {
        if (project.id === projectId) {
          return { ...project, status: data.status as ProjectStatus };
        }
        return project;
      };
      
      setProjects(prev => prev.map(projectStatusMapping));
      setUserProjects(prev => prev.map(projectStatusMapping));
      
      toast({
        title: "Project updated",
        description: `Project status changed to ${status}`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating project status:', error);
      toast({
        title: "Failed to update project",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchUserProjects();
    }
  }, [user]);
  
  return {
    projects,
    userProjects,
    loadingProjects,
    fetchProjects,
    fetchUserProjects,
    createProject,
    updateProjectStatus
  };
}
