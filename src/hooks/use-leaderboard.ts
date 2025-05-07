
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LeaderboardUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  department: string | null;
  points: number;
  rank: number;
  achievements_count: number;
  projects_count: number;
  connections_count: number;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLeaderboard = async (filter?: { 
    department?: string, 
    limit?: number,
    timeframe?: 'all' | 'monthly' | 'weekly' | 'daily'
  }) => {
    try {
      setLoading(true);
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, department')
        .order('username');
      
      if (profilesError) throw profilesError;
      
      if (!profiles || profiles.length === 0) {
        setLeaderboard([]);
        return [];
      }
      
      // Filter by department if specified
      let filteredProfiles = profiles;
      if (filter?.department) {
        filteredProfiles = profiles.filter(profile => profile.department === filter.department);
      }
      
      // For each profile, calculate points
      const leaderboardData = await Promise.all(filteredProfiles.map(async (profile) => {
        // Call our calculate_user_points function
        const { data, error } = await supabase
          .rpc('calculate_user_points', { user_uuid: profile.id });
        
        if (error) {
          console.error('Error calculating points for user:', profile.id, error);
          return null;
        }
        
        // Get achievement count
        const { count: achievementsCount, error: achievementsError } = await supabase
          .from('achievements')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', profile.id)
          .eq('status', 'verified');
        
        if (achievementsError) {
          console.error('Error counting achievements for user:', profile.id, achievementsError);
        }
        
        // Get project count
        const { count: projectsCount, error: projectsError } = await supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('created_by', profile.id);
        
        if (projectsError) {
          console.error('Error counting projects for user:', profile.id, projectsError);
        }
        
        // Get connections count - this needs to be fixed to not use string interpolation in .or()
        const { count: connectionsCount, error: connectionsError } = await supabase
          .from('connections')
          .select('id', { count: 'exact', head: true })
          .or(`follower_id.eq.${profile.id},following_id.eq.${profile.id}`)
          .eq('status', 'accepted');
        
        if (connectionsError) {
          console.error('Error counting connections for user:', profile.id, connectionsError);
        }
        
        return {
          ...profile,
          points: data || 0,
          achievements_count: achievementsCount || 0,
          projects_count: projectsCount || 0,
          connections_count: connectionsCount || 0,
        };
      }));
      
      // Filter out null values and sort by points
      const validLeaderboardData = leaderboardData
        .filter(Boolean)
        .sort((a, b) => b!.points - a!.points);
      
      // Apply ranking
      const rankedLeaderboard = validLeaderboardData.map((user, index) => ({
        ...user!,
        rank: index + 1
      }));
      
      // Apply limit if specified
      const limitedLeaderboard = filter?.limit 
        ? rankedLeaderboard.slice(0, filter.limit)
        : rankedLeaderboard;
      
      setLeaderboard(limitedLeaderboard as LeaderboardUser[]);
      return limitedLeaderboard as LeaderboardUser[];
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Failed to load leaderboard",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getUserRank = async (userId: string) => {
    try {
      // Get all leaderboard users
      const allUsers = await fetchLeaderboard();
      
      // Find the user in the leaderboard
      const userRank = allUsers.find(u => u.id === userId)?.rank;
      
      return userRank || null;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return null;
    }
  };

  const getTopPerformers = async (limit: number = 3) => {
    return await fetchLeaderboard({ limit });
  };

  const getDepartmentLeaders = async () => {
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('department')
        .not('department', 'is', null);
      
      if (profilesError) throw profilesError;
      
      if (!profiles || profiles.length === 0) {
        return [];
      }
      
      // Get unique departments
      const departments = [...new Set(profiles.map(p => p.department))];
      
      // For each department, get the top performer
      const departmentLeaders = await Promise.all(departments.map(async (department) => {
        const leaders = await fetchLeaderboard({ department: department as string, limit: 1 });
        return leaders.length > 0 ? leaders[0] : null;
      }));
      
      // Filter out null values
      return departmentLeaders.filter(Boolean) as LeaderboardUser[];
    } catch (error: any) {
      console.error('Error fetching department leaders:', error);
      toast({
        title: "Failed to load department leaders",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    leaderboard,
    loading,
    fetchLeaderboard,
    getUserRank,
    getTopPerformers,
    getDepartmentLeaders,
  };
}
