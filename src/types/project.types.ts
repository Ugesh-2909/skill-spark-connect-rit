
import { Profile } from './message.types';

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'archived';

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

export interface ProjectData {
  title: string;
  description: string;
  members?: string[];
}
