
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/AvatarGroup";
import { 
  Award, 
  Calendar, 
  Code, 
  Edit2, 
  Github, 
  Globe, 
  Linkedin, 
  MapPin, 
  Mail, 
  Milestone, 
  Twitter, 
  User, 
  Users,
  Heart, 
  Share, 
  Plus, 
  MessageSquare,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAchievements } from "@/hooks/use-achievements";
import { useProjects } from "@/hooks/use-projects";
import { useConnections } from "@/hooks/use-connections";
import { useLikes } from "@/hooks/use-likes";
import { useToast } from "@/hooks/use-toast";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AchievementForm } from "@/hooks/use-achievement-form";
import { ProjectForm } from "@/components/project/ProjectForm";
import { usePoints } from "@/hooks/use-points";

interface ProfileData {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  department: string | null;
  created_at: string;
}

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isOwnProfile = !id || id === user?.id;
  const profileId = id || user?.id;
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [points, setPoints] = useState<number>(0);
  
  const { toast } = useToast();
  const { achievements, fetchAchievements, deleteAchievement } = useAchievements();
  const { projects, fetchProjects } = useProjects();
  const { sendConnectionRequest, checkConnectionStatus, acceptConnectionRequest, removeConnection } = useConnections();
  const { likeItem, unlikeItem, checkIfUserLiked } = useLikes();
  const { getUserRank } = useLeaderboard();
  const { calculateUserPoints } = usePoints();

  // Handle likes for achievements
  const [achievementLikes, setAchievementLikes] = useState<{[key: string]: boolean}>({});
  
  // Handle likes for projects
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
        await fetchProjects();
        
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
          const rank = await getUserRank(profileId as string);
          setUserRank(rank);
          
          // Get user points
          const userPoints = await calculateUserPoints(profileId as string);
          setPoints(userPoints);
        }
        
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
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [profileId, user]);

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
    if (window.confirm('Are you sure you want to delete this achievement? This action cannot be undone.')) {
      const result = await deleteAchievement(id);
      if (result) {
        toast({
          title: "Achievement deleted",
          description: "Your achievement has been successfully deleted",
        });
      }
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
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profileData.avatar_url || undefined} alt={profileData.full_name} />
                  <AvatarFallback>{profileData.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                {isOwnProfile && (
                  <Button variant="outline" size="sm" className="mb-4">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                
                <div className="flex gap-2 mt-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{profileData.full_name}</h1>
                    <p className="text-gray-500">@{profileData.username}</p>
                  </div>
                  
                  {!isOwnProfile && user && (
                    <div className="mt-4 md:mt-0 flex space-x-2">
                      {connectionStatus === 'accepted' ? (
                        <>
                          <Button variant="outline" onClick={handleRemoveConnection}>
                            <Users className="h-4 w-4 mr-2" />
                            Connected
                          </Button>
                          <Button asChild>
                            <Link to={`/messages?user=${profileId}`}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Link>
                          </Button>
                        </>
                      ) : connectionStatus === 'pending' ? (
                        <Button variant="outline" disabled>
                          <Users className="h-4 w-4 mr-2" />
                          Connection Pending
                        </Button>
                      ) : (
                        <Button className="bg-uprit-indigo hover:bg-uprit-indigo/90" onClick={handleSendConnectionRequest}>
                          <Users className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="font-medium">{profileData.department || 'Student'}</p>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Rochester, NY</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{profileData.username}@rit.edu</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">
                  {/* Bio can be added to the profiles table in future */}
                  {profileData.department 
                    ? `Student in the ${profileData.department} department with a passion for learning and collaboration.` 
                    : 'Student with a passion for learning and collaboration.'}
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-uprit-indigo font-bold text-xl">{points}</p>
                    <p className="text-gray-500 text-sm">Points</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-uprit-purple font-bold text-xl">#{userRank || 'N/A'}</p>
                    <p className="text-gray-500 text-sm">Rank</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 font-bold text-xl">{achievements.filter(a => a.status === 'verified').length}</p>
                    <p className="text-gray-500 text-sm">Achievements</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile Content Tabs */}
        <Tabs defaultValue="achievements" className="mb-6">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Award className="h-5 w-5 mr-2 text-uprit-indigo" />
                Achievements
              </h2>
              
              {isOwnProfile && <AchievementForm />}
            </div>
            
            {visibleAchievements.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium">No achievements yet</h3>
                  <p className="text-gray-500 mt-1">
                    {isOwnProfile 
                      ? "Add your achievements to showcase your skills and accomplishments." 
                      : "This user hasn't added any achievements yet."}
                  </p>
                  {isOwnProfile && (
                    <AchievementForm />
                  )}
                </CardContent>
              </Card>
            ) : (
              visibleAchievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {achievement.image_url && (
                      <div className="mb-3">
                        <img 
                          src={achievement.image_url} 
                          alt={achievement.title}
                          className="w-full h-32 object-cover rounded-md" 
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>{new Date(achievement.created_at).toLocaleDateString()}</span>
                          </div>
                          
                          {achievement.achievement_type && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                              {achievement.achievement_type}
                            </span>
                          )}
                          
                          {achievement.difficulty && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              {achievement.difficulty}
                            </span>
                          )}
                          
                          {isOwnProfile && (
                            <Badge className="ml-2" variant={achievement.status === 'verified' ? 'default' : 'outline'}>
                              {achievement.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-uprit-indigo">
                          +{achievement.points} pts
                        </Badge>
                        {isOwnProfile && (
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteAchievement(achievement.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </Button>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleToggleLike(achievement.id, 'achievement')}
                          className={achievementLikes[achievement.id] ? 'text-red-500' : ''}
                        >
                          <Heart className="h-4 w-4" fill={achievementLikes[achievement.id] ? 'currentColor' : 'none'} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Code className="h-5 w-5 mr-2 text-uprit-indigo" />
                Projects
              </h2>
              
              {isOwnProfile && <ProjectForm />}
            </div>
            
            {projects.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Code className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium">No projects yet</h3>
                  <p className="text-gray-500 mt-1">
                    {isOwnProfile 
                      ? "Start a new project to showcase your work and collaborate with others." 
                      : "This user hasn't created any projects yet."}
                  </p>
                  {isOwnProfile && <ProjectForm />}
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                        <div className="flex items-center text-gray-500 text-sm mt-2">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{new Date(project.created_at).toLocaleDateString()}</span>
                          <Badge className="ml-2" variant="outline">
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleToggleLike(project.id, 'project')}
                            className={projectLikes[project.id] ? 'text-red-500' : ''}
                          >
                            <Heart className="h-4 w-4" fill={projectLikes[project.id] ? 'currentColor' : 'none'} />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                        <AvatarGroup max={3}>
                          {(project.team_members || []).map((member, i) => (
                            <Avatar key={i} className="h-8 w-8">
                              <AvatarImage src={member.avatar_url || undefined} />
                              <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </AvatarGroup>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Milestone className="h-5 w-5 mr-2 text-uprit-indigo" />
              Recent Activity
            </h2>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Milestone className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium">Activity feed coming soon</h3>
                <p className="text-gray-500 mt-1">
                  We're working on an activity feed to show your recent actions and updates.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
