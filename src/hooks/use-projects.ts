
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Project, ProjectData, ProjectStatus } from '@/types/project.types';
import { Profile } from '@/types/message.types';
import { 
  fetchAllProjects, 
  fetchUserProjects, 
  createNewProject, 
  updateProjectStatus 
} from '@/services/project.service';
import { createSafeProfile } from '@/utils/project.utils';

export type { Project, ProjectData, ProjectStatus } from '@/types/project.types';
export type { Profile } from '@/types/message.types';

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
      const projectsWithMembers = await fetchUserProjects(user.id);
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
      
      const data = await createNewProject(user.id, projectData);
      
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
    updateProjectStatus: updateProjectStatusLocal
  };
}
