
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

// Achievement types for consistency
export type AchievementStatus = 'pending' | 'verified' | 'rejected';
export type AchievementDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type AchievementType = 
  'Hackathon' | 
  'Certification' | 
  'Research Publication' | 
  'Community Leadership' | 
  'Course Completion';

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  points: number;
  status: AchievementStatus;
  created_at: string;
  user_id: string;
  verified_at: string | null;
  verified_by: string | null;
  achievement_type?: string;
  difficulty?: string;
  user?: Profile;
}
