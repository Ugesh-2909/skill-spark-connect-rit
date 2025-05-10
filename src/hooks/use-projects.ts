
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Project, ProjectData, ProjectStatus } from '@/types/project.types';
import { Profile } from '@/types/message.types';
import { 
  fetchAllProjects, 
  fetchUserProjects as fetchUserProjectsService, 
  createNewProject, 
  updateProjectStatus,
  deleteProject as deleteProjectService
} from '@/services/project.service';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const projectsWithMembers = await fetchAllProjects();
      setProjects(projectsWithMembers);
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

  const fetchUserProjectsData = async () => {
    try {
      if (!user) return;
      
      setLoadingProjects(true);
      const projectsWithMembers = await fetchUserProjectsService(user.id);
      setUserProjects(projectsWithMembers);
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
      
      // Ensure required fields are present
      if (!projectData.title) {
        toast({
          title: "Missing required field",
          description: "Project title is required",
          variant: "destructive",
        });
        return null;
      }

      const data = await createNewProject(user.id, projectData);
      
      // Update projects lists
      setProjects((prev) => {
        const userProfile = {
          id: user.id,
          username: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || '',
          avatar_url: user.user_metadata?.avatar_url || null
        };
        
        const createdProject = {
          ...data,
          creator: userProfile,
          team_members: [] as Profile[],
          status: data.status as ProjectStatus
        };
        
        return [createdProject, ...prev];
      });
      
      setUserProjects((prev) => {
        const userProfile = {
          id: user.id,
          username: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || '',
          avatar_url: user.user_metadata?.avatar_url || null
        };
        
        const createdProject = {
          ...data,
          creator: userProfile,
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

  const updateProjectStatusLocal = async (projectId: string, status: ProjectStatus) => {
    try {
      const data = await updateProjectStatus(projectId, status);
      
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

  const deleteProject = async (projectId: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to delete projects",
          variant: "destructive",
        });
        return false;
      }
      
      const success = await deleteProjectService(projectId);
      
      if (success) {
        // Remove project from state
        setProjects(prev => prev.filter(project => project.id !== projectId));
        setUserProjects(prev => prev.filter(project => project.id !== projectId));
        
        toast({
          title: "Project deleted",
          description: "The project has been successfully deleted",
        });
      }
      
      return success;
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
    fetchProjects();
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchUserProjectsData();
    }
  }, [user]);
  
  return {
    projects,
    userProjects,
    loadingProjects,
    fetchProjects,
    fetchUserProjects: fetchUserProjectsData,
    createProject,
    updateProjectStatus: updateProjectStatusLocal,
    deleteProject
  };
}

export type { Project, ProjectData, ProjectStatus } from '@/types/project.types';
export type { Profile } from '@/types/message.types';
