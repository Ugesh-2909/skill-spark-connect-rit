
// Add type fixes for the use-projects.ts hook
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define types for the project status
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'archived';

// Define a type for Profile objects
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

// Define a type for Project objects
export interface Project {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  created_by: string;
  status: ProjectStatus;
  members: string[] | null;
  creator?: Profile;
  team_members?: Profile[];
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async (userId?: string) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('projects')
        .select(`
          *,
          creator:created_by(*)
        `)
        .order('created_at', { ascending: false });
      
      // If user ID is provided, filter by that user
      if (userId) {
        query = query.eq('created_by', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process the data and get team members for each project
      const projectsWithTeamMembers = await Promise.all((data || []).map(async (project) => {
        // If project has members, get their profiles
        let teamMembers: Profile[] = [];
        if (project.members && project.members.length > 0) {
          const { data: membersData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', project.members);
          
          teamMembers = membersData || [];
        }
        
        // Ensure the status is one of our expected values
        let typedStatus: ProjectStatus;
        switch(project.status) {
          case 'planning':
          case 'in_progress':
          case 'completed':
          case 'archived':
            typedStatus = project.status;
            break;
          default:
            typedStatus = 'planning'; // Default value if unexpected
        }

        return {
          ...project,
          status: typedStatus,
          team_members: teamMembers,
          creator: project.creator as Profile
        } as Project;
      }));
      
      setProjects(projectsWithTeamMembers);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Failed to load projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    if (!user) return;
    await fetchProjects(user.id);
  };

  const createProject = async (
    title: string,
    description: string,
    teamMembers: string[],
    status: ProjectStatus
  ) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create a project",
          variant: "destructive",
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title,
            description,
            created_by: user.id,
            members: teamMembers,
            status
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Get the created project with creator info
      const createdProject = data![0];
      
      // Get creator profile
      const { data: creatorData } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      // Update projects state
      const newProject = {
        ...createdProject,
        creator: creatorData as Profile,
        team_members: [] as Profile[]
      } as Project;

      setProjects(prev => [newProject, ...prev]);
      
      toast({
        title: "Project created",
        description: "Your project has been created successfully",
      });
      
      return newProject;
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

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to update a project",
          variant: "destructive",
        });
        return null;
      }
      
      // Remove non-updatable fields
      const { id, created_at, created_by, creator, team_members, ...updateData } = updates;
      
      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId)
        .select();
      
      if (error) throw error;
      
      // Update projects state
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, ...updateData } as Project
            : project
        )
      );
      
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully",
      });
      
      return data![0] as Project;
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Failed to update project",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to delete a project",
          variant: "destructive",
        });
        return false;
      }
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      // Update projects state
      setProjects(prev => 
        prev.filter(project => project.id !== projectId)
      );
      
      toast({
        title: "Project deleted",
        description: "Your project has been deleted",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Failed to delete project",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Subscribe to real-time changes for projects
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('public:projects')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects'
        }, 
        () => {
          fetchProjects();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    projects,
    loading,
    fetchProjects,
    fetchUserProjects,
    createProject,
    updateProject,
    deleteProject
  };
}
