
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Award, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Trophy, 
  GraduationCap,
  Briefcase,
  Cog
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

interface Achievement {
  id: string;
  title: string;
  category: string;
  date: string;
  status: 'verified' | 'pending' | 'rejected';
  points: number;
  icon: keyof typeof iconMap;
}

const iconMap = {
  trophy: Trophy,
  award: Award,
  graduation: GraduationCap,
  briefcase: Briefcase,
  cog: Cog,
};

const achievements: Achievement[] = [
  {
    id: "1",
    title: "Hackathon Winner - RIT Codefest",
    category: "Competition",
    date: "April 15, 2025",
    status: "verified",
    points: 100,
    icon: "trophy"
  },
  {
    id: "2",
    title: "AWS Certified Developer",
    category: "Certification",
    date: "March 20, 2025",
    status: "verified",
    points: 75,
    icon: "award"
  },
  {
    id: "3",
    title: "Published Research Paper",
    category: "Academic",
    date: "February 10, 2025",
    status: "verified",
    points: 120,
    icon: "graduation"
  },
  {
    id: "4",
    title: "Summer Internship - Google",
    category: "Work Experience",
    date: "January 30, 2025",
    status: "verified",
    points: 85,
    icon: "briefcase"
  },
  {
    id: "5",
    title: "Project Team Lead - Robotics Club",
    category: "Leadership",
    date: "January 15, 2025",
    status: "verified",
    points: 60,
    icon: "cog"
  },
  {
    id: "6",
    title: "Advanced Machine Learning Course",
    category: "Course",
    date: "April 8, 2025",
    status: "pending",
    points: 50,
    icon: "graduation"
  }
];

const Achievements = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold">Achievements</h1>
            <p className="text-gray-500">Track and showcase your academic and professional milestones</p>
          </div>
          <Button className="bg-uprit-indigo hover:bg-uprit-indigo/90">
            <Plus className="h-4 w-4 mr-1" />
            Add Achievement
          </Button>
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
                    <p className="text-2xl font-bold text-uprit-indigo">490</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-xs text-gray-500">Achievements</p>
                      <p className="text-xl font-semibold">12</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-xs text-gray-500">Verified</p>
                      <p className="text-xl font-semibold">10</p>
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
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
                    Competition
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                    Certification
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="w-4 h-4 rounded-full bg-purple-500 mr-2" />
                    Academic
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="w-4 h-4 rounded-full bg-orange-500 mr-2" />
                    Work Experience
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2" />
                    Leadership
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="w-4 h-4 rounded-full bg-cyan-500 mr-2" />
                    Course
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Time Period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    All Time
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    This Year
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    This Semester
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Last 30 Days
                  </Button>
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
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Select defaultValue="recent">
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
                    <div className="space-y-4">
                      {achievements.map((achievement) => {
                        const IconComponent = iconMap[achievement.icon];
                        
                        return (
                          <div key={achievement.id} className="achievement-card">
                            <div className="flex items-start space-x-4">
                              <div className={`rounded-full p-3 ${
                                achievement.category === 'Competition' ? 'bg-blue-100' :
                                achievement.category === 'Certification' ? 'bg-green-100' :
                                achievement.category === 'Academic' ? 'bg-purple-100' :
                                achievement.category === 'Work Experience' ? 'bg-orange-100' :
                                achievement.category === 'Leadership' ? 'bg-red-100' :
                                'bg-cyan-100'
                              }`}>
                                <IconComponent className={`h-5 w-5 ${
                                  achievement.category === 'Competition' ? 'text-blue-600' :
                                  achievement.category === 'Certification' ? 'text-green-600' :
                                  achievement.category === 'Academic' ? 'text-purple-600' :
                                  achievement.category === 'Work Experience' ? 'text-orange-600' :
                                  achievement.category === 'Leadership' ? 'text-red-600' :
                                  'text-cyan-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                  <div>
                                    <h3 className="font-medium">{achievement.title}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-xs font-medium py-0.5 px-2 bg-gray-100 text-gray-700 rounded-full">
                                        {achievement.category}
                                      </span>
                                      <span className={`text-xs font-medium py-0.5 px-2 rounded-full ${
                                        achievement.status === 'verified' ? 'bg-green-50 text-green-700' :
                                        achievement.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                        'bg-red-50 text-red-700'
                                      }`}>
                                        {achievement.status.charAt(0).toUpperCase() + achievement.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center mt-2 sm:mt-0">
                                    <div className="flex items-center space-x-1 mr-3">
                                      <Calendar className="h-4 w-4 text-gray-500" />
                                      <span className="text-xs text-gray-500">{achievement.date}</span>
                                    </div>
                                    <div className="text-sm font-medium py-1 px-2 bg-uprit-indigo/10 text-uprit-indigo rounded-full">
                                      +{achievement.points} pts
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 flex justify-between">
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm">
                                      Share
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="verified" className="mt-0">
                    <div className="space-y-4">
                      {achievements
                        .filter(a => a.status === 'verified')
                        .map((achievement) => {
                          const IconComponent = iconMap[achievement.icon];
                          
                          return (
                            <div key={achievement.id} className="achievement-card">
                              <div className="flex items-start space-x-4">
                                <div className={`rounded-full p-3 ${
                                  achievement.category === 'Competition' ? 'bg-blue-100' :
                                  achievement.category === 'Certification' ? 'bg-green-100' :
                                  achievement.category === 'Academic' ? 'bg-purple-100' :
                                  achievement.category === 'Work Experience' ? 'bg-orange-100' :
                                  achievement.category === 'Leadership' ? 'bg-red-100' :
                                  'bg-cyan-100'
                                }`}>
                                  <IconComponent className={`h-5 w-5 ${
                                    achievement.category === 'Competition' ? 'text-blue-600' :
                                    achievement.category === 'Certification' ? 'text-green-600' :
                                    achievement.category === 'Academic' ? 'text-purple-600' :
                                    achievement.category === 'Work Experience' ? 'text-orange-600' :
                                    achievement.category === 'Leadership' ? 'text-red-600' :
                                    'text-cyan-600'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                      <h3 className="font-medium">{achievement.title}</h3>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-xs font-medium py-0.5 px-2 bg-gray-100 text-gray-700 rounded-full">
                                          {achievement.category}
                                        </span>
                                        <span className="text-xs font-medium py-0.5 px-2 bg-green-50 text-green-700 rounded-full">
                                          Verified
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center mt-2 sm:mt-0">
                                      <div className="flex items-center space-x-1 mr-3">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs text-gray-500">{achievement.date}</span>
                                      </div>
                                      <div className="text-sm font-medium py-1 px-2 bg-uprit-indigo/10 text-uprit-indigo rounded-full">
                                        +{achievement.points} pts
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-3 flex justify-between">
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                    <div className="flex space-x-2">
                                      <Button variant="ghost" size="sm">
                                        Share
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        Edit
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pending" className="mt-0">
                    <div className="space-y-4">
                      {achievements
                        .filter(a => a.status === 'pending')
                        .map((achievement) => {
                          const IconComponent = iconMap[achievement.icon];
                          
                          return (
                            <div key={achievement.id} className="achievement-card">
                              <div className="flex items-start space-x-4">
                                <div className={`rounded-full p-3 ${
                                  achievement.category === 'Competition' ? 'bg-blue-100' :
                                  achievement.category === 'Certification' ? 'bg-green-100' :
                                  achievement.category === 'Academic' ? 'bg-purple-100' :
                                  achievement.category === 'Work Experience' ? 'bg-orange-100' :
                                  achievement.category === 'Leadership' ? 'bg-red-100' :
                                  'bg-cyan-100'
                                }`}>
                                  <IconComponent className={`h-5 w-5 ${
                                    achievement.category === 'Competition' ? 'text-blue-600' :
                                    achievement.category === 'Certification' ? 'text-green-600' :
                                    achievement.category === 'Academic' ? 'text-purple-600' :
                                    achievement.category === 'Work Experience' ? 'text-orange-600' :
                                    achievement.category === 'Leadership' ? 'text-red-600' :
                                    'text-cyan-600'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                      <h3 className="font-medium">{achievement.title}</h3>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-xs font-medium py-0.5 px-2 bg-gray-100 text-gray-700 rounded-full">
                                          {achievement.category}
                                        </span>
                                        <span className="text-xs font-medium py-0.5 px-2 bg-yellow-50 text-yellow-700 rounded-full">
                                          Pending
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center mt-2 sm:mt-0">
                                      <div className="flex items-center space-x-1 mr-3">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs text-gray-500">{achievement.date}</span>
                                      </div>
                                      <div className="text-sm font-medium py-1 px-2 bg-uprit-indigo/10 text-uprit-indigo rounded-full">
                                        +{achievement.points} pts
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-3 flex justify-between">
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                    <div className="flex space-x-2">
                                      <Button variant="ghost" size="sm">
                                        Share
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        Edit
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
