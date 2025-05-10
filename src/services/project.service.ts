
import { fetchAllProjects, fetchUserProjects } from './project/project-fetch.service';
import { createNewProject, updateProjectStatus, deleteProject } from './project/project-mutation.service';
import { uploadProjectImage, deleteProjectImage } from './project/project-image.service';

// Export all functions from the new modular services
export {
  fetchAllProjects,
  fetchUserProjects,
  createNewProject,
  updateProjectStatus,
  deleteProject,
  uploadProjectImage,
  deleteProjectImage
};
