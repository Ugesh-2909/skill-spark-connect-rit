import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Users, 
  Layout as LayoutIcon, 
  ArrowRight, 
  Award,
  Star,
  Loader2
} from "lucide-react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAchievements } from "@/hooks/use-achievements";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AchievementForm } from "@/hooks/use-achievement-form";

const iconMap: Record<string, React.ElementType> = {
  'Hackathon': Trophy,
  'Certification': Award,
  'Research Publication': Star,
  'Course Completion': Award,
  'Community Leadership': Award,
  'Work Experience': Award,
  'default': Award,
};

const Index = () => {
  const { user } = useAuth();
  const { achievements, loading: achievementsLoading, fetchAllAchievements } = useAchievements();
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);
  const [stats, setStats] = useState({
    achievements: 0,
    projects: 0,
    connections: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get achievements count
      const { count: achievementsCount } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'verified');

      // Get projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id);

      // Get connections count
      const { count: connectionsCount } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .or(`follower_id.eq.${user.id},following_id.eq.${user.id}`)
        .eq('status', 'accepted');

      setStats({
        achievements: achievementsCount || 0,
        projects: projectsCount || 0,
        connections: connectionsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAchievements();
  }, []);

  useEffect(() => {
    if (achievements.length > 0) {
      const sorted = [...achievements]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);
      setRecentAchievements(sorted);
    }
  }, [achievements]);

  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-uprit-indigo to-uprit-purple rounded-xl text-white p-6 shadow-md">
            <h1 className="text-2xl font-display font-bold mb-2">Welcome to UpRIT</h1>
            <p className="text-white/90 mb-4">
              Document your achievements, build your portfolio, and connect with peers all in one place.
            </p>
            <div className="flex space-x-3">
              <AchievementForm 
                trigger={
                  <Button className="bg-white text-uprit-indigo hover:bg-white/90">
                    Add Achievement
                  </Button>
                }
              />
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link to="/projects">
                  Explore Projects
                </Link>
              </Button>
            </div>
          </section>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <Trophy className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Achievements</p>
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-uprit-indigo" />
                  ) : (
                    <p className="text-xl font-bold">{stats.achievements}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Connections</p>
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-uprit-indigo" />
                  ) : (
                    <p className="text-xl font-bold">{stats.connections}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="rounded-full bg-purple-100 p-2">
                  <LayoutIcon className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Projects</p>
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-uprit-indigo" />
                  ) : (
                    <p className="text-xl font-bold">{stats.projects}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Activity Tabs */}
          <Tabs defaultValue="feed" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="feed">Activity Feed</TabsTrigger>
                <TabsTrigger value="discover">Discover</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="feed" className="space-y-4">
              <ActivityFeed />
            </TabsContent>
            <TabsContent value="discover" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Trending Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="rounded-full bg-green-100 p-2 mt-1">
                        <Award className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">RIT Hackathon 2023 Winner</h4>
                        <p className="text-sm text-gray-500">
                          15 students earned this achievement recently
                        </p>
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="rounded-full bg-blue-100 p-2 mt-1">
                        <Star className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">AWS Certified Developer</h4>
                        <p className="text-sm text-gray-500">
                          8 students earned this achievement recently
                        </p>
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard Preview */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Leaderboard</CardTitle>
                <Button variant="ghost" size="sm" className="text-uprit-indigo hover:text-uprit-indigo/80 p-0">
                  <span>View All</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <LeaderboardPreview />
            </CardContent>
          </Card>
          
          {/* Recent Achievements */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Recent Achievements</CardTitle>
                <Button variant="ghost" size="sm" className="text-uprit-indigo hover:text-uprit-indigo/80 p-0" asChild>
                  <Link to="/achievements">
                    <span>View All</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {achievementsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-uprit-indigo" />
                </div>
              ) : recentAchievements.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No achievements yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAchievements.map((achievement) => {
                    const IconComponent = achievement.achievement_type && iconMap[achievement.achievement_type]
                      ? iconMap[achievement.achievement_type]
                      : iconMap.default;

                    const achievementColor = 
                      achievement.achievement_type === 'Hackathon' ? 'orange' :
                      achievement.achievement_type === 'Certification' ? 'green' :
                      achievement.achievement_type === 'Research Publication' ? 'blue' :
                      'gray';

                    return (
                      <div key={achievement.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-full bg-${achievementColor}-100 flex items-center justify-center`}>
                            <IconComponent className={`h-4 w-4 text-${achievementColor}-500`} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium">{achievement.title}</h4>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-sm font-medium text-uprit-indigo">
                                {achievement.profiles?.full_name || achievement.user?.full_name || 'Unknown User'}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(achievement.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium py-1 px-2 bg-${achievementColor}-50 text-${achievementColor}-700 rounded-full`}>
                          +{achievement.points} pts
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
