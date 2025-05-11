
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types/project.types';

export function useAchievementVerification() {
  const { toast } = useToast();

  const verifyAchievement = async (
    userId: string,
    achievementId: string, 
    verified: boolean
  ): Promise<Achievement | null> => {
    try {
      if (!userId) throw new Error("User ID is required to verify an achievement");

      const status = verified ? 'verified' as const : 'rejected' as const;

      const { data, error } = await supabase
        .from('achievements')
        .update({ 
          status,
          verified_at: verified ? new Date().toISOString() : null,
          verified_by: verified ? userId : null
        })
        .eq('id', achievementId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: verified ? "Achievement verified" : "Achievement rejected",
        description: verified ? "The achievement has been verified" : "The achievement has been rejected",
      });
      
      return data as Achievement;
    } catch (error: any) {
      console.error('Error verifying achievement:', error);
      toast({
        title: "Failed to update achievement",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  return { verifyAchievement };
}
