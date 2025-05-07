
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  created_at: string;
  members: string[] | null;
  status: 'planning' | 'in_progress' | 'completed' | 'archived';
  creator?: Profile;
  team_members?: Profile[];
}

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // First fetch the projects
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is defined, filter by user_id
      if (user) {
        query = query.or(`created_by.eq.${user.id},members.cs.{${user.id}}`);
      }

      const { data: projectsData, error: projectsError } = await query;

      if (projectsError) throw projectsError;
      
      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        return [];
      }
      
      // Update the status field to match the allowed types in the interface
      const typedProjects = projectsData.map(project => {
        // Map database status to one of the allowed Project interface status values
        let typedStatus: 'planning' | 'in_progress' | 'completed' | 'archived';
        switch(project.status) {
          case 'in_progress':
            typedStatus = 'in_progress';
            break;
          case 'completed':
            typedStatus = 'completed';
            break;
          case 'archived':
            typedStatus = 'archived';
            break;
          default:
            typedStatus = 'planning';
        }
        
        return {
          ...project,
          status: typedStatus
        } as Project;
      });
      
      // For each project, fetch the creator profile
      const creatorIds = Array.from(new Set(typedProjects.map(project => project.created_by)));
      
      if (creatorIds.length === 0) {
        setProjects(typedProjects);
        return typedProjects;
      }
      
      const { data: creatorProfiles, error: creatorsError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', creatorIds);
      
      if (creatorsError) throw creatorsError;
      
      // For each project, fetch the member profiles
      const projectsWithProfiles = await Promise.all(typedProjects.map(async (project) => {
        // Find the creator profile
        const creator = creatorProfiles?.find(profile => profile.id === project.created_by);
        
        if (!project.members || project.members.length === 0) {
          return { 
            ...project,
            creator: creator || undefined, 
            team_members: [] 
          } as Project;
        }
        
        const { data: memberProfiles, error: memberError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', project.members);
        
        if (memberError) {
          console.error('Error fetching member profiles:', memberError);
          return { 
            ...project, 
            creator: creator || undefined, 
            team_members: [] 
          } as Project;
        }
        
        return { 
          ...project,
          creator: creator || undefined,
          team_members: memberProfiles || []
        } as Project;
      }));
      
      setProjects(projectsWithProfiles);
      return projectsWithProfiles;
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Failed to load projects",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      
      // First fetch all projects without filtering
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      
      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        return [];
      }
      
      // Update the status field to match the allowed types in the interface
      const typedProjects = projectsData.map(project => {
        // Map database status to one of the allowed Project interface status values
        let typedStatus: 'planning' | 'in_progress' | 'completed' | 'archived';
        switch(project.status) {
          case 'in_progress':
            typedStatus = 'in_progress';
            break;
          case 'completed':
            typedStatus = 'completed';
            break;
          case 'archived':
            typedStatus = 'archived';
            break;
          default:
            typedStatus = 'planning';
        }
        
        return {
          ...project,
          status: typedStatus
        } as Project;
      });
      
      // For each project, fetch the creator profile
      const creatorIds = Array.from(new Set(typedProjects.map(project => project.created_by)));
      
      if (creatorIds.length === 0) {
        setProjects(typedProjects);
        return typedProjects;
      }
      
      const { data: creatorProfiles, error: creatorsError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', creatorIds);
      
      if (creatorsError) throw creatorsError;
      
      // For each project, fetch the member profiles
      const projectsWithProfiles = await Promise.all(typedProjects.map(async (project) => {
        // Find the creator profile
        const creator = creatorProfiles?.find(profile => profile.id === project.created_by);
        
        if (!project.members || project.members.length === 0) {
          return { 
            ...project, 
            creator: creator || undefined, 
            team_members: [] 
          } as Project;
        }
        
        const { data: memberProfiles, error: memberError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', project.members);
        
        if (memberError) {
          console.error('Error fetching member profiles:', memberError);
          return { 
            ...project, 
            creator: creator || undefined, 
            team_members: [] 
          } as Project;
        }
        
        return { 
          ...project,
          creator: creator || undefined,
          team_members: memberProfiles || []
        } as Project;
      }));
      
      setProjects(projectsWithProfiles);
      return projectsWithProfiles;
    } catch (error: any) {
      console.error('Error fetching all projects:', error);
      toast({
        title: "Failed to load projects",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (
    title: string, 
    description: string, 
    members: string[] = [],
    status: 'planning' | 'in_progress' | 'completed' | 'archived' = 'planning'
  ) => {
    try {
      if (!user) throw new Error("You must be logged in to create a project");

      const { data, error } = await supabase
        .from('projects')
        .insert([
          { 
            title, 
            description, 
            created_by: user.id,
            members,
            status
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      if (!data) throw new Error("No data returned from project creation");
      
      // Fetch creator profile
      const { data: creatorProfile, error: creatorError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (creatorError) throw creatorError;
      
      // Fetch member profiles
      let team_members: Profile[] = [];
      if (members.length > 0) {
        const { data: memberProfiles, error: memberError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', members);
        
        if (memberError) throw memberError;
        team_members = memberProfiles || [];
      }
      
      // Cast status to the valid enum type
      let typedStatus: 'planning' | 'in_progress' | 'completed' | 'archived';
      switch(data.status) {
        case 'in_progress':
          typedStatus = 'in_progress';
          break;
        case 'completed':
          typedStatus = 'completed';
          break;
        case 'archived':
          typedStatus = 'archived';
          break;
        default:
          typedStatus = 'planning';
      }
      
      const newProject: Project = {
        ...data,
        status: typedStatus,
        creator: creatorProfile,
        team_members
      };
      
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

  const updateProject = async (
    id: string,
    updates: {
      title?: string;
      description?: string;
      members?: string[];
      status?: 'planning' | 'in_progress' | 'completed' | 'archived';
    }
  ) => {
    try {
      if (!user) throw new Error("You must be logged in to update a project");

      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (!data) throw new Error("No data returned from project update");
      
      // Cast status to the valid enum type
      let typedStatus: 'planning' | 'in_progress' | 'completed' | 'archived';
      switch(data.status) {
        case 'in_progress':
          typedStatus = 'in_progress';
          break;
        case 'completed':
          typedStatus = 'completed';
          break;
        case 'archived':
          typedStatus = 'archived';
          break;
        default:
          typedStatus = 'planning';
      }
      
      const updatedData = {
        ...data,
        status: typedStatus
      };
      
      // Fetch member profiles if members were updated
      let team_members: Profile[] = [];
      if (updates.members && updates.members.length > 0) {
        const { data: memberProfiles, error: memberError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', updates.members);
        
        if (memberError) throw memberError;
        team_members = memberProfiles || [];
      }
      
      // Update projects state
      setProjects(prev => 
        prev.map(project => 
          project.id === id 
            ? { 
                ...project, 
                ...updatedData, 
                ...(team_members.length > 0 ? { team_members } : {})
              } 
            : project
        )
      );
      
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully",
      });
      
      return updatedData as Project;
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

  const deleteProject = async (id: string) => {
    try {
      if (!user) throw new Error("You must be logged in to delete a project");

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(prev => 
        prev.filter(project => project.id !== id)
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

  const addMember = async (projectId: string, userId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");
      
      const members = [...(project.members || [])];
      if (members.includes(userId)) {
        toast({
          title: "User already a member",
          description: "This user is already a member of the project",
        });
        return project;
      }
      
      members.push(userId);
      
      return await updateProject(projectId, { members });
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast({
        title: "Failed to add member",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const removeMember = async (projectId: string, userId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");
      
      const members = [...(project.members || [])];
      const updatedMembers = members.filter(id => id !== userId);
      
      return await updateProject(projectId, { members: updatedMembers });
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast({
        title: "Failed to remove member",
        description: error.message,
        variant: "destructive",
      });
      return null;
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
          table: 'projects',
          filter: `created_by=eq.${user.id}`
        }, 
        () => {
          fetchProjects();
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects',
          filter: `members=cs.{${user.id}}`
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
    fetchAllProjects,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
  };
}
