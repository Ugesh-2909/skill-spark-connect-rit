
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
    awardPointsForProject,
    POINT_VALUES
  };
}
