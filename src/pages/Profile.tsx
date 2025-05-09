import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAchievements } from "@/hooks/use-achievements";
import { useProjects } from "@/hooks/use-projects";
import { useConnections } from "@/hooks/use-connections";
import { useLikes } from "@/hooks/use-likes";
import { useToast } from "@/hooks/use-toast";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { usePoints } from "@/hooks/use-points";
import { ExtendedProfileData } from "@/types/project.types";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { AchievementCard } from "@/components/profile/AchievementCard";
import { ProjectCard } from "@/components/profile/ProjectCard";
import { ProjectDeleteDialog } from "@/components/project/ProjectDeleteDialog";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isOwnProfile = !id || id === user?.id;
  const profileId = id || user?.id;
  
  const [profileData, setProfileData] = useState<ExtendedProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [points, setPoints] = useState<number>(0);
  
  const { toast } = useToast();
  const { achievements, fetchAchievements, deleteAchievement } = useAchievements();
  const { projects, userProjects, deleteProject } = useProjects();
  const { sendConnectionRequest, checkConnectionStatus, acceptConnectionRequest, removeConnection } = useConnections();
  const { likeItem, unlikeItem, checkIfUserLiked } = useLikes();
  const { getUserRank } = useLeaderboard();
  const { calculateUserPoints } = usePoints();

  // State for likes
  const [achievementLikes, setAchievementLikes] = useState<{[key: string]: boolean}>({});
  const [projectLikes, setProjectLikes] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!profileId) return;
        
        setLoading(true);
        
        // Fetch profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
        
        if (error) throw error;
        
        setProfileData(data);
        
        // Fetch achievements and projects for this profile
        await fetchAchievements();
        
        // Check connection status if not own profile
        if (!isOwnProfile && user) {
          const status = await checkConnectionStatus(profileId);
          setConnectionStatus(status);
          
          // If there's a connection, get the connection ID
          if (status) {
            const { data: connectionData } = await supabase
              .from('connections')
              .select('id')
              .or(`and(follower_id.eq.${user.id},following_id.eq.${profileId}),and(follower_id.eq.${profileId},following_id.eq.${user.id})`)
              .single();
            
            if (connectionData) {
              setConnectionId(connectionData.id);
            }
          }
        }
        
        // Get user rank and points
        if (profileId) {
          const rank = await getUserRank(profileId);
          setUserRank(rank);
          
          // Get user points
          const userPoints = await calculateUserPoints(profileId);
          setPoints(userPoints);
        }
        
        // Initialize likes status
        await initializeLikesStatus();
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [profileId, user]);

  const initializeLikesStatus = async () => {
    // Initialize likes status for achievements
    const achievementLikesStatus: {[key: string]: boolean} = {};
    for (const achievement of achievements) {
      const isLiked = await checkIfUserLiked(achievement.id, 'achievement');
      achievementLikesStatus[achievement.id] = isLiked;
    }
    setAchievementLikes(achievementLikesStatus);
    
    // Initialize likes status for projects
    const projectLikesStatus: {[key: string]: boolean} = {};
    for (const project of projects) {
      const isLiked = await checkIfUserLiked(project.id, 'project');
      projectLikesStatus[project.id] = isLiked;
    }
    setProjectLikes(projectLikesStatus);
  };

  const handleProfileUpdated = (newProfileData: ExtendedProfileData) => {
    setProfileData(newProfileData);
    // Refresh points after profile update in case they changed
    if (profileId) {
      calculateUserPoints(profileId).then(newPoints => setPoints(newPoints));
    }
  };

  const handleSendConnectionRequest = async () => {
    if (!user || !profileId) return;
    
    const result = await sendConnectionRequest(profileId);
    if (result) {
      setConnectionStatus('pending');
      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent successfully",
      });
    }
  };

  const handleAcceptConnectionRequest = async () => {
    if (!connectionId) return;
    
    const result = await acceptConnectionRequest(connectionId);
    if (result) {
      setConnectionStatus('accepted');
      toast({
        title: "Connection accepted",
        description: "You are now connected with this user",
      });
    }
  };

  const handleRemoveConnection = async () => {
    if (!profileId) return;
    
    const result = await removeConnection(profileId);
    if (result) {
      setConnectionStatus(null);
      setConnectionId(null);
      toast({
        title: "Connection removed",
        description: "You are no longer connected with this user",
      });
    }
  };

  const handleToggleLike = async (itemId: string, itemType: 'achievement' | 'project') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to like items",
        variant: "destructive",
      });
      return;
    }
    
    const likesState = itemType === 'achievement' ? achievementLikes : projectLikes;
    const setLikesState = itemType === 'achievement' ? setAchievementLikes : setProjectLikes;
    
    if (likesState[itemId]) {
      // Unlike
      const result = await unlikeItem(itemId, itemType);
      if (result) {
        setLikesState({
          ...likesState,
          [itemId]: false
        });
      }
    } else {
      // Like
      const result = await likeItem(itemId, itemType);
      if (result) {
        setLikesState({
          ...likesState,
          [itemId]: true
        });
      }
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this achievement? This action cannot be undone and will remove the associated points.')) {
      const result = await deleteAchievement(id);
      if (result) {
        toast({
          title: "Achievement deleted",
          description: "Your achievement has been successfully deleted",
        });
        
        // Refresh points after deletion
        if (profileId) {
          const updatedPoints = await calculateUserPoints(profileId);
          setPoints(updatedPoints);
        }
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!user) return;
    
    const result = await deleteProject(id);
    if (result) {
      toast({
        title: "Project deleted",
        description: "Your project has been successfully deleted",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-uprit-indigo" />
        </div>
      </MainLayout>
    );
  }

  if (!profileData) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
              <p className="text-gray-500 mb-4">The profile you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Filter achievements to only show verified ones for other profiles
  const visibleAchievements = isOwnProfile 
    ? achievements 
    : achievements.filter(achievement => achievement.status === 'verified');

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <ProfileHeader 
              profileData={profileData}
              isOwnProfile={isOwnProfile}
              connectionStatus={connectionStatus}
              connectionId={connectionId}
              points={points}
              userRank={userRank}
              achievementCount={achievements.filter(a => a.status === 'verified').length}
              onProfileUpdated={handleProfileUpdated}
              onSendConnectionRequest={handleSendConnectionRequest}
              onAcceptConnectionRequest={handleAcceptConnectionRequest}
              onRemoveConnection={handleRemoveConnection}
            />
          </CardContent>
        </Card>
        
        {/* Profile Content Tabs */}
        <ProfileTabs 
          isOwnProfile={isOwnProfile}
          achievementsCount={visibleAchievements.length}
          projectsCount={projects.length}
          achievementsContent={
            <div className="space-y-4">
              {visibleAchievements.map((achievement) => (
                <AchievementCard 
                  key={achievement.id}
                  achievement={achievement}
                  isOwnProfile={isOwnProfile}
                  isLiked={achievementLikes[achievement.id] || false}
                  onToggleLike={handleToggleLike}
                  onDeleteAchievement={handleDeleteAchievement}
                />
              ))}
            </div>
          }
          projectsContent={
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  isLiked={projectLikes[project.id] || false}
                  onToggleLike={handleToggleLike}
                  onDeleteProject={isOwnProfile ? handleDeleteProject : undefined}
                />
              ))}
            </div>
          }
        />
      </div>
    </MainLayout>
  );
};

export default Profile;
