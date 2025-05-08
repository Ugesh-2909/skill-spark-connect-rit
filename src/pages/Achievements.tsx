
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Award, 
  Search, 
  Filter, 
  Calendar, 
  Trophy, 
  GraduationCap,
  Briefcase,
  Cog,
  Trash2,
  Heart
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAchievements } from "@/hooks/use-achievements";
import { AchievementForm } from "@/hooks/use-achievement-form";
import { useAuth } from "@/contexts/AuthContext";
import { usePoints } from "@/hooks/use-points";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Achievement, AchievementType } from "@/types/project.types";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
  'Hackathon': Trophy,
  'Certification': Award,
  'Research Publication': GraduationCap,
  'Course Completion': GraduationCap,
  'Community Leadership': Cog,
  'Work Experience': Briefcase,
  'default': Award,
};

const Achievements = () => {
  const { user } = useAuth();
  const { achievements, loading, fetchAchievements, deleteAchievement } = useAchievements();
  const { calculateUserPoints } = usePoints();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("recent");
  const [userPoints, setUserPoints] = useState<number>(0);
  
  useEffect(() => {
    fetchAchievements();
    if (user?.id) {
      calculateUserPoints(user.id).then(setUserPoints);
    }
  }, [user]);
  
  // Filter achievements based on search and filter criteria
  const filterAchievements = (achievements: Achievement[]) => {
    return achievements.filter(achievement => {
      const matchesSearch = 
        achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (achievement.description && achievement.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesCategory = selectedCategory === "all" || 
        achievement.achievement_type === selectedCategory;
        
      const matchesDifficulty = selectedDifficulty === "all" || 
        achievement.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  };
  
  // Sort achievements based on sort order
  const sortAchievements = (achievements: Achievement[]) => {
    return [...achievements].sort((a, b) => {
      switch (sortOrder) {
        case "recent":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "points-high":
          return b.points - a.points;
        case "points-low":
          return a.points - b.points;
        default:
          return 0;
      }
    });
  };
  
  const handleDeleteAchievement = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      const success = await deleteAchievement(id);
      if (success) {
        // Update points after deletion
        if (user?.id) {
          const newPoints = await calculateUserPoints(user.id);
          setUserPoints(newPoints);
        }
      }
    }
  };
  
  const filteredAchievements = sortAchievements(filterAchievements(achievements));
  
  // Calculate stats
  const totalAchievements = achievements.length;
  const verifiedAchievements = achievements.filter(a => a.status === 'verified').length;
  
  // Get unique categories and difficulties for filtering
  const categories = Array.from(new Set(achievements.map(a => a.achievement_type).filter(Boolean)));
  const difficulties = Array.from(new Set(achievements.map(a => a.difficulty).filter(Boolean)));
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold">Achievements</h1>
            <p className="text-gray-500">Track and showcase your academic and professional milestones</p>
          </div>
          <AchievementForm />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Points</p>
                    {loading ? (
                      <Skeleton className="h-8 w-28 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-uprit-indigo">{userPoints}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-xs text-gray-500">Achievements</p>
                      {loading ? (
                        <Skeleton className="h-6 w-10 mt-1" />
                      ) : (
                        <p className="text-xl font-semibold">{totalAchievements}</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-xs text-gray-500">Verified</p>
                      {loading ? (
                        <Skeleton className="h-6 w-10 mt-1" />
                      ) : (
                        <p className="text-xl font-semibold">{verifiedAchievements}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant={selectedCategory === "all" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory("all")}
                  >
                    <div className="w-4 h-4 rounded-full bg-gray-500 mr-2" />
                    All Categories
                  </Button>
                  
                  {categories.map((category) => {
                    const categoryName = category as string;
                    const color = 
                      categoryName === 'Hackathon' ? 'blue-500' : 
                      categoryName === 'Certification' ? 'green-500' : 
                      categoryName === 'Research Publication' ? 'purple-500' : 
                      categoryName === 'Community Leadership' ? 'red-500' : 
                      categoryName === 'Course Completion' ? 'indigo-500' : 
                      'gray-500';
                      
                    return (
                      <Button 
                        key={categoryName} 
                        variant={selectedCategory === categoryName ? "default" : "ghost"} 
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(categoryName)}
                      >
                        <div className={`w-4 h-4 rounded-full bg-${color} mr-2`} />
                        {categoryName}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant={selectedDifficulty === "all" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedDifficulty("all")}
                  >
                    All Difficulties
                  </Button>
                  
                  {difficulties.map((difficulty) => (
                    <Button 
                      key={difficulty as string} 
                      variant={selectedDifficulty === difficulty ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setSelectedDifficulty(difficulty as string)}
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                  <CardTitle className="text-lg font-medium">Your Achievements</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search achievements..."
                        className="pl-8 w-full md:w-64 bg-gray-50 border-gray-200 focus-visible:bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="points-high">Highest Points</SelectItem>
                        <SelectItem value="points-low">Lowest Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-0">
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <Card key={i}>
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-5 w-40" />
                                  <Skeleton className="h-4 w-full" />
                                  <div className="flex space-x-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : filteredAchievements.length === 0 ? (
                      <div className="text-center py-10">
                        <Award className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium">No achievements found</h3>
                        <p className="text-gray-500 mb-4">
                          {searchTerm || selectedCategory !== "all" || selectedDifficulty !== "all"
                            ? "Try adjusting your search or filters"
                            : "Add your first achievement to start tracking your progress"}
                        </p>
                        <AchievementForm />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredAchievements.map((achievement) => {
                          const IconComponent = achievement.achievement_type && iconMap[achievement.achievement_type]
                            ? iconMap[achievement.achievement_type]
                            : iconMap.default;
                            
                          const achievementColor = 
                            achievement.achievement_type === 'Hackathon' ? 'blue' :
                            achievement.achievement_type === 'Certification' ? 'green' :
                            achievement.achievement_type === 'Research Publication' ? 'purple' :
                            achievement.achievement_type === 'Community Leadership' ? 'red' :
                            achievement.achievement_type === 'Course Completion' ? 'indigo' :
                            'gray';
                            
                          return (
                            <div key={achievement.id} className="achievement-card">
                              <div className="flex items-start space-x-4">
                                <div className={`rounded-full p-3 bg-${achievementColor}-100`}>
                                  <IconComponent className={`h-5 w-5 text-${achievementColor}-600`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                      <h3 className="font-medium">{achievement.title}</h3>
                                      <div className="flex items-center flex-wrap space-x-2 mt-1">
                                        {achievement.achievement_type && (
                                          <span className="text-xs font-medium py-0.5 px-2 bg-gray-100 text-gray-700 rounded-full">
                                            {achievement.achievement_type}
                                          </span>
                                        )}
                                        {achievement.difficulty && (
                                          <span className={`text-xs font-medium py-0.5 px-2 bg-${achievementColor}-50 text-${achievementColor}-700 rounded-full`}>
                                            {achievement.difficulty}
                                          </span>
                                        )}
                                        <span className={`text-xs font-medium py-0.5 px-2 bg-${
                                          achievement.status === 'verified' ? 'green-50 text-green-700' :
                                          achievement.status === 'pending' ? 'yellow-50 text-yellow-700' :
                                          'red-50 text-red-700'
                                        } rounded-full`}>
                                          {achievement.status.charAt(0).toUpperCase() + achievement.status.slice(1)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center mt-2 sm:mt-0">
                                      <div className="flex items-center space-x-1 mr-3">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs text-gray-500">
                                          {new Date(achievement.created_at).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="text-sm font-medium py-1 px-2 bg-uprit-indigo/10 text-uprit-indigo rounded-full">
                                        +{achievement.points} pts
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {achievement.description && (
                                    <p className="text-gray-600 text-sm mt-2">{achievement.description}</p>
                                  )}
                                  
                                  {achievement.image_url && (
                                    <div className="mt-3">
                                      <img 
                                        src={achievement.image_url} 
                                        alt={achievement.title}
                                        className="w-full max-h-48 object-cover rounded-md" 
                                      />
                                    </div>
                                  )}
                                  
                                  <div className="mt-3 flex justify-between">
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                    <div className="flex space-x-2">
                                      <Button variant="ghost" size="sm">
                                        <Heart className="h-4 w-4 mr-1" />
                                        Like
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleDeleteAchievement(achievement.id)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="verified" className="mt-0">
                    <div className="space-y-4">
                      {loading ? (
                        <div className="space-y-4">
                          {[...Array(2)].map((_, i) => (
                            <Card key={i}>
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-4">
                                  <Skeleton className="h-12 w-12 rounded-full" />
                                  <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-full" />
                                    <div className="flex space-x-2">
                                      <Skeleton className="h-4 w-20" />
                                      <Skeleton className="h-4 w-20" />
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : filteredAchievements.filter(a => a.status === 'verified').length === 0 ? (
                        <div className="text-center py-10">
                          <Award className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <h3 className="text-lg font-medium">No verified achievements</h3>
                          <p className="text-gray-500">Add achievements to get them verified</p>
                        </div>
                      ) : (
                        filteredAchievements
                          .filter(a => a.status === 'verified')
                          .map((achievement) => {
                            // Same achievement rendering as in "all" tab
                            const IconComponent = achievement.achievement_type && iconMap[achievement.achievement_type]
                              ? iconMap[achievement.achievement_type]
                              : iconMap.default;
                              
                            const achievementColor = 
                              achievement.achievement_type === 'Hackathon' ? 'blue' :
                              achievement.achievement_type === 'Certification' ? 'green' :
                              achievement.achievement_type === 'Research Publication' ? 'purple' :
                              achievement.achievement_type === 'Community Leadership' ? 'red' :
                              achievement.achievement_type === 'Course Completion' ? 'indigo' :
                              'gray';
                              
                            return (
                              <div key={achievement.id} className="achievement-card">
                                {/* Same content as in the "all" tab */}
                                <div className="flex items-start space-x-4">
                                  <div className={`rounded-full p-3 bg-${achievementColor}-100`}>
                                    <IconComponent className={`h-5 w-5 text-${achievementColor}-600`} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                      <div>
                                        <h3 className="font-medium">{achievement.title}</h3>
                                        <div className="flex items-center flex-wrap space-x-2 mt-1">
                                          {achievement.achievement_type && (
                                            <span className="text-xs font-medium py-0.5 px-2 bg-gray-100 text-gray-700 rounded-full">
                                              {achievement.achievement_type}
                                            </span>
                                          )}
                                          {achievement.difficulty && (
                                            <span className="text-xs font-medium py-0.5 px-2 bg-green-50 text-green-700 rounded-full">
                                              {achievement.difficulty}
                                            </span>
                                          )}
                                          <span className="text-xs font-medium py-0.5 px-2 bg-green-50 text-green-700 rounded-full">
                                            Verified
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center mt-2 sm:mt-0">
                                        <div className="flex items-center space-x-1 mr-3">
                                          <Calendar className="h-4 w-4 text-gray-500" />
                                          <span className="text-xs text-gray-500">
                                            {new Date(achievement.created_at).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="text-sm font-medium py-1 px-2 bg-uprit-indigo/10 text-uprit-indigo rounded-full">
                                          +{achievement.points} pts
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {achievement.description && (
                                      <p className="text-gray-600 text-sm mt-2">{achievement.description}</p>
                                    )}
                                    
                                    {achievement.image_url && (
                                      <div className="mt-3">
                                        <img 
                                          src={achievement.image_url} 
                                          alt={achievement.title}
                                          className="w-full max-h-48 object-cover rounded-md" 
                                        />
                                      </div>
                                    )}
                                    
                                    <div className="mt-3 flex justify-between">
                                      <Button variant="outline" size="sm">
                                        View Details
                                      </Button>
                                      <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm">
                                          <Heart className="h-4 w-4 mr-1" />
                                          Like
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => handleDeleteAchievement(achievement.id)}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <Trash2 className="h-4 w-4 mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pending" className="mt-0">
                    <div className="space-y-4">
                      {loading ? (
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-5 w-40" />
                                  <Skeleton className="h-4 w-full" />
                                  <div className="flex space-x-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ) : filteredAchievements.filter(a => a.status === 'pending').length === 0 ? (
                        <div className="text-center py-10">
                          <Award className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <h3 className="text-lg font-medium">No pending achievements</h3>
                          <p className="text-gray-500">All your achievements have been processed</p>
                        </div>
                      ) : (
                        filteredAchievements
                          .filter(a => a.status === 'pending')
                          .map((achievement) => {
                            // Same achievement rendering logic as above
                            const IconComponent = achievement.achievement_type && iconMap[achievement.achievement_type]
                              ? iconMap[achievement.achievement_type]
                              : iconMap.default;
                              
                            return (
                              <div key={achievement.id} className="achievement-card">
                                {/* Same content structure as above */}
                                <div className="flex items-start space-x-4">
                                  <div className="rounded-full p-3 bg-yellow-100">
                                    <IconComponent className="h-5 w-5 text-yellow-600" />
                                  </div>
                                  <div className="flex-1">
                                    {/* Similar content as above, with status "Pending" */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                      <div>
                                        <h3 className="font-medium">{achievement.title}</h3>
                                        <div className="flex items-center flex-wrap space-x-2 mt-1">
                                          {achievement.achievement_type && (
                                            <span className="text-xs font-medium py-0.5 px-2 bg-gray-100 text-gray-700 rounded-full">
                                              {achievement.achievement_type}
                                            </span>
                                          )}
                                          {achievement.difficulty && (
                                            <span className="text-xs font-medium py-0.5 px-2 bg-yellow-50 text-yellow-700 rounded-full">
                                              {achievement.difficulty}
                                            </span>
                                          )}
                                          <span className="text-xs font-medium py-0.5 px-2 bg-yellow-50 text-yellow-700 rounded-full">
                                            Pending
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center mt-2 sm:mt-0">
                                        <div className="flex items-center space-x-1 mr-3">
                                          <Calendar className="h-4 w-4 text-gray-500" />
                                          <span className="text-xs text-gray-500">
                                            {new Date(achievement.created_at).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="text-sm font-medium py-1 px-2 bg-uprit-indigo/10 text-uprit-indigo rounded-full">
                                          +{achievement.points} pts
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {achievement.description && (
                                      <p className="text-gray-600 text-sm mt-2">{achievement.description}</p>
                                    )}
                                    
                                    {achievement.image_url && (
                                      <div className="mt-3">
                                        <img 
                                          src={achievement.image_url} 
                                          alt={achievement.title}
                                          className="w-full max-h-48 object-cover rounded-md" 
                                        />
                                      </div>
                                    )}
                                    
                                    <div className="mt-3 flex justify-between">
                                      <Button variant="outline" size="sm">
                                        View Details
                                      </Button>
                                      <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm">
                                          <Heart className="h-4 w-4 mr-1" />
                                          Like
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => handleDeleteAchievement(achievement.id)}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <Trash2 className="h-4 w-4 mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Achievements;
