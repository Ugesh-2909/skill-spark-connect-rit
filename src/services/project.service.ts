
import { fetchAllProjects, fetchUserProjects } from './project/project-fetch.service';
import { createNewProject, updateProjectStatus, updateProject, deleteProject } from './project/project-mutation.service';
import { uploadProjectImage, deleteProjectImage } from './project/project-image.service';
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

/**
 * Subscribe to real-time project updates for a specific user
 */
export const subscribeToUserProjectUpdates = (userId: string, callback: () => void) => {
  const channel = supabase
    .channel(`public:projects:user:${userId}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'projects',
        filter: `created_by=eq.${userId}`
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
