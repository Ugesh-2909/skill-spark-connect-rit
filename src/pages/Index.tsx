
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Users, 
  Layout as LayoutIcon, 
  ArrowRight, 
  Award,
  Star
} from "lucide-react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
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
              <Button className="bg-white text-uprit-indigo hover:bg-white/90">
                Add Achievement
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Explore Projects
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
                  <p className="text-xl font-bold">12</p>
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
                  <p className="text-xl font-bold">36</p>
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
                  <p className="text-xl font-bold">5</p>
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
                <Button variant="ghost" size="sm" className="text-uprit-indigo hover:text-uprit-indigo/80 p-0">
                  <span>View All</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Hackathon Participant</h4>
                      <p className="text-xs text-gray-500">April 10, 2025</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium py-1 px-2 bg-orange-50 text-orange-700 rounded-full">
                    +15 pts
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Award className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Python Certification</h4>
                      <p className="text-xs text-gray-500">March 28, 2025</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium py-1 px-2 bg-green-50 text-green-700 rounded-full">
                    +30 pts
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Star className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Dean's List</h4>
                      <p className="text-xs text-gray-500">March 15, 2025</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium py-1 px-2 bg-blue-50 text-blue-700 rounded-full">
                    +25 pts
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
