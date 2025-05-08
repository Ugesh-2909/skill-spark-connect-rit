
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Point values for different activities
export const POINT_VALUES = {
  ACHIEVEMENT_CREATED: 5,
  ACHIEVEMENT_VERIFIED: 10,
  PROJECT_CREATED: 15, 
  PROJECT_COMPLETED: 25,
  CONNECTION_MADE: 3
};

// Achievement type point multipliers
export const ACHIEVEMENT_TYPE_MULTIPLIERS = {
  'Hackathon': 3.0,
  'Certification': 2.5,
  'Research Publication': 5.0,
  'Community Leadership': 2.0,
  'Course Completion': 1.0
};

// Difficulty multipliers
export const DIFFICULTY_MULTIPLIERS = {
  'Beginner': 1.0,
  'Intermediate': 1.5,
  'Advanced': 2.0,
  'Expert': 3.0
};

// Type definitions for our points_log table
interface PointsLog {
  id?: string;
  user_id: string;
  points: number;
  activity: string;
  created_at?: string;
  verified_by?: string | null;
}

export function usePoints() {
  const { toast } = useToast();
  const { user } = useAuth();

  const calculateUserPoints = async (userId: string): Promise<number> => {
    try {
      if (!userId) {
        return 0;
      }
      
      const { data, error } = await supabase
        .rpc('calculate_user_points', { user_uuid: userId });

      if (error) {
        throw error;
      }

      return data || 0;
    } catch (error: any) {
      console.error('Error calculating points:', error);
      return 0;
    }
  };

  const calculateAchievementPoints = (
    achievementType: string = 'Course Completion', 
    difficulty: string = 'Beginner'
  ): number => {
    // Default base points
    const basePoints = 10;
    
    // Get multipliers (with fallbacks to default values)
    const typeMultiplier = ACHIEVEMENT_TYPE_MULTIPLIERS[achievementType as keyof typeof ACHIEVEMENT_TYPE_MULTIPLIERS] || 1.0;
    const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty as keyof typeof DIFFICULTY_MULTIPLIERS] || 1.0;
    
    // Calculate total points
    const calculatedPoints = Math.round(basePoints * typeMultiplier * difficultyMultiplier);
    
    return calculatedPoints;
  };

  const awardPointsForNewAchievement = async (
    userId: string, 
    achievementType: string = 'Course Completion',
    difficulty: string = 'Beginner'
  ): Promise<number> => {
    try {
      // Calculate points based on type and difficulty
      const points = calculateAchievementPoints(achievementType, difficulty);
      
      // Award points for the new achievement
      const pointsData: PointsLog = {
        user_id: userId,
        points: points,
        activity: 'achievement_created'
      };
      
      const { error } = await supabase
        .from('points_log')
        .insert([pointsData]);
      
      if (error) throw error;
      
      toast({
        title: "Points awarded",
        description: `${points} points awarded for your new achievement`,
      });
      
      return points;
    } catch (error: any) {
      console.error('Error awarding points:', error);
      return 0;
    }
  };

  const awardPointsForAchievement = async (userId: string, status: 'pending' | 'verified' | 'rejected') => {
    if (status !== 'verified') return;
    
    try {
      if (!user) return;
      
      // Award points for verified achievement
      const pointsData: PointsLog = {
        user_id: userId,
        points: POINT_VALUES.ACHIEVEMENT_VERIFIED,
        activity: 'achievement_verified',
        verified_by: user.id
      };
      
      const { error } = await supabase
        .from('points_log')
        .insert([pointsData]);
      
      if (error) throw error;
      
      toast({
        title: "Points awarded",
        description: `${POINT_VALUES.ACHIEVEMENT_VERIFIED} points awarded for verified achievement`,
      });
    } catch (error: any) {
      console.error('Error awarding points:', error);
    }
  };

  const awardPointsForProject = async (userId: string, status: string) => {
    try {
      if (status === 'completed') {
        // Award points for completing a project
        const pointsData: PointsLog = {
          user_id: userId,
          points: POINT_VALUES.PROJECT_COMPLETED,
          activity: 'project_completed'
        };
        
        const { error } = await supabase
          .from('points_log')
          .insert([pointsData]);
        
        if (error) throw error;
        
        toast({
          title: "Points awarded",
          description: `${POINT_VALUES.PROJECT_COMPLETED} points awarded for completing a project`,
        });
      } else if (status === 'planning') {
        // Award points for creating a new project
        const pointsData: PointsLog = {
          user_id: userId,
          points: POINT_VALUES.PROJECT_CREATED,
          activity: 'project_created'
        };
        
        const { error } = await supabase
          .from('points_log')
          .insert([pointsData]);
        
        if (error) throw error;
        
        toast({
          title: "Points awarded",
          description: `${POINT_VALUES.PROJECT_CREATED} points awarded for creating a new project`,
        });
      }
    } catch (error: any) {
      console.error('Error awarding points:', error);
    }
  };

  return {
    calculateUserPoints,
    awardPointsForAchievement,
    awardPointsForNewAchievement,
    calculateAchievementPoints,
    awardPointsForProject,
    POINT_VALUES,
    ACHIEVEMENT_TYPE_MULTIPLIERS,
    DIFFICULTY_MULTIPLIERS
  };
}
