
import { useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
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
  Mail, 
  MapPin, 
  Milestone, 
  Twitter, 
  User, 
  Users 
} from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const isOwnProfile = !id;
  
  // Mock data for demonstration purposes
  const userData = {
    name: "Jane Doe",
    username: "janedoe",
    role: "Computer Science Student",
    location: "Rochester, NY",
    bio: "Final year Computer Science student at RIT with a passion for full-stack development and AI. Hackathon enthusiast and open-source contributor.",
    email: "jane.doe@rit.edu",
    points: 423,
    rank: 15,
    skills: ["React", "TypeScript", "Node.js", "Python", "Machine Learning", "UX Design"],
    connections: 86,
    achievements: [
      { id: 1, title: "Hackathon Winner", date: "Mar 2023", points: 50 },
      { id: 2, title: "Open Source Contributor", date: "Jan 2023", points: 35 },
      { id: 3, title: "Research Publication", date: "Nov 2022", points: 75 },
      { id: 4, title: "Dean's List", date: "Sep 2022", points: 25 },
    ],
    projects: [
      { id: 1, title: "UpRIT Platform", description: "A gamified skills showcase platform for students", teamSize: 4 },
      { id: 2, title: "AI Tutor", description: "An AI-powered tutoring assistant for programming courses", teamSize: 2 },
      { id: 3, title: "Smart Campus", description: "IoT solution for campus resource management", teamSize: 5 },
    ],
    activity: [
      { id: 1, type: "achievement", title: "Earned the 'Hackathon Winner' badge", date: "2 days ago" },
      { id: 2, type: "project", title: "Started a new project: AI Tutor", date: "1 week ago" },
      { id: 3, type: "connection", title: "Connected with Alex Johnson", date: "2 weeks ago" },
    ]
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="https://i.pravatar.cc/150?img=5" alt={userData.name} />
                  <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                    <p className="text-gray-500">@{userData.username}</p>
                  </div>
                  
                  {!isOwnProfile && (
                    <Button className="mt-4 md:mt-0 bg-uprit-indigo hover:bg-uprit-indigo/90">
                      <Users className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="font-medium">{userData.role}</p>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{userData.email}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{userData.bio}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {userData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-uprit-indigo font-bold text-xl">{userData.points}</p>
                    <p className="text-gray-500 text-sm">Points</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-uprit-purple font-bold text-xl">#{userData.rank}</p>
                    <p className="text-gray-500 text-sm">Rank</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 font-bold text-xl">{userData.connections}</p>
                    <p className="text-gray-500 text-sm">Connections</p>
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
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-uprit-indigo" />
              Achievements
            </h2>
            
            {userData.achievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{achievement.date}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-uprit-indigo">
                      +{achievement.points} pts
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Code className="h-5 w-5 mr-2 text-uprit-indigo" />
              Projects
            </h2>
            
            {userData.projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                    </div>
                    <div className="flex items-center">
                      <AvatarGroup max={3}>
                        {[...Array(project.teamSize)].map((_, i) => (
                          <Avatar key={i} className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Milestone className="h-5 w-5 mr-2 text-uprit-indigo" />
              Recent Activity
            </h2>
            
            {userData.activity.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    {item.type === 'achievement' && <Award className="h-5 w-5 text-uprit-indigo" />}
                    {item.type === 'project' && <Code className="h-5 w-5 text-uprit-purple" />}
                    {item.type === 'connection' && <User className="h-5 w-5 text-gray-500" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
