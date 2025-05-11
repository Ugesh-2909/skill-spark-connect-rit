
import { fetchAllProjects, fetchUserProjects } from './project/project-fetch.service';
import { createNewProject, updateProjectStatus, updateProject, deleteProject } from './project/project-mutation.service';
import { uploadProjectImage, deleteProjectImage } from './project/project-image.service';

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
