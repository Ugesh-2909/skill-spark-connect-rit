
import { fetchAllProjects, fetchUserProjects } from './project/project-fetch.service';
import { createNewProject, updateProjectStatus, updateProject, deleteProject } from './project/project-mutation.service';
import { uploadProjectImage, deleteProjectImage } from './project/project-image.service';

// Add a real-time subscription for projects
import { supabase } from '@/integrations/supabase/client';

/**
 * Subscribe to real-time project updates
 */
export const subscribeToProjectUpdates = (callback: () => void) => {
  const channel = supabase
    .channel('public:projects')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'projects' 
      }, 
      () => {
        callback();
      }
    )
    .subscribe();
    
  return channel;
};

// Export all functions from the modular services
export {
  fetchAllProjects,
  fetchUserProjects,
  createNewProject,
  updateProjectStatus,
  updateProject,
  deleteProject,
  uploadProjectImage,
  deleteProjectImage
};
