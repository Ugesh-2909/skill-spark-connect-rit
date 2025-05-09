
import { Profile } from './message.types';

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'archived';
export type TimelineStatus = 'ongoing' | 'past' | 'future';

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
  image_url?: string | null;
  timeline_status?: TimelineStatus;
  start_date?: string | null;
  end_date?: string | null;
}

export interface ProjectData {
  title: string;
  description: string;
  status?: ProjectStatus;
  timeline_status?: TimelineStatus;
  start_date?: string;
  end_date?: string;
  image?: File;
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
  image_url?: string | null;
  user?: Profile;
  profiles?: any; // Added to handle the profiles relation
}

// Extended profile data for user profiles
export interface ExtendedProfileData {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  department: string | null;
  location?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
  role?: string;
}
