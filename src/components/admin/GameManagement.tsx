
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Trophy, Award, Calendar, Star } from "lucide-react";

export function GameManagement() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gamification Management</h2>
      
      <Tabs defaultValue="credits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="credits">Credit System</TabsTrigger>
          <TabsTrigger value="categories">Achievement Categories</TabsTrigger>
          <TabsTrigger value="badges">Badges & Rewards</TabsTrigger>
          <TabsTrigger value="events">Special Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="credits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit System Configuration</CardTitle>
              <CardDescription>
                Define credit values for different types of achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Achievement Type</TableHead>
                      <TableHead>Base Credits</TableHead>
                      <TableHead>Participation/Win Modifier</TableHead>
                      <TableHead>Difficulty Multiplier</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { 
                        type: "Hackathon", 
                        base: 30, 
                        modifiers: "Win: 2x, Finalist: 1.5x, Participation: 1x", 
                        multiplier: "Local: 1x, Regional: 1.5x, National: 2x, International: 3x" 
                      },
                      { 
                        type: "Certification", 
                        base: 25, 
                        modifiers: "N/A", 
                        multiplier: "Beginner: 1x, Intermediate: 1.5x, Advanced: 2x, Expert: 3x" 
                      },
                      { 
                        type: "Research Publication", 
                        base: 50, 
                        modifiers: "First Author: 1.5x, Co-author: 1x", 
                        multiplier: "Journal Impact Factor Based" 
                      },
                      { 
                        type: "Community Leadership", 
                        base: 20, 
                        modifiers: "Organizer: 2x, Leader: 1.5x, Member: 1x", 
                        multiplier: "Duration-based" 
                      },
                      { 
                        type: "Course Completion", 
                        base: 10, 
                        modifiers: "Grade-based", 
                        multiplier: "Course Difficulty" 
                      },
                    ].map((credit, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{credit.type}</TableCell>
                        <TableCell>{credit.base}</TableCell>
                        <TableCell>{credit.modifiers}</TableCell>
                        <TableCell>{credit.multiplier}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Credit Type
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard Settings</CardTitle>
              <CardDescription>
                Configure how the leaderboard calculates and displays rankings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Leaderboard Refresh Interval</label>
                  <div className="flex gap-2">
                    <Input type="number" value="24" className="w-20" />
                    <span className="flex items-center text-sm text-muted-foreground">hours</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Featured Rankings Duration</label>
                  <div className="flex gap-2">
                    <Input type="number" value="7" className="w-20" />
                    <span className="flex items-center text-sm text-muted-foreground">days</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Credits for Ranking</label>
                  <Input type="number" value="10" className="w-full" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Inactivity Threshold</label>
                  <div className="flex gap-2">
                    <Input type="number" value="30" className="w-20" />
                    <span className="flex items-center text-sm text-muted-foreground">days</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Leaderboard Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Categories</CardTitle>
              <CardDescription>
                Manage and organize achievement types and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Achievement Types</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { 
                        name: "Technical Skills", 
                        description: "Achievements related to coding, development, and technical expertise", 
                        types: "Certification, Competition, Project Completion", 
                        status: "Active" 
                      },
                      { 
                        name: "Academic Excellence", 
                        description: "Achievements related to coursework and research", 
                        types: "Course Completion, Research, Publication, Award", 
                        status: "Active" 
                      },
                      { 
                        name: "Leadership & Community", 
                        description: "Achievements in leadership roles and community involvement", 
                        types: "Club Leadership, Event Organization, Mentorship", 
                        status: "Active" 
                      },
                      { 
                        name: "Professional Development", 
                        description: "Achievements related to career preparedness", 
                        types: "Internship, Industry Project, Networking", 
                        status: "Active" 
                      },
                      { 
                        name: "Creative Works", 
                        description: "Achievements in design, art, and creative fields", 
                        types: "Design Competition, Portfolio, Exhibition", 
                        status: "Draft" 
                      },
                    ].map((category, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{category.types}</TableCell>
                        <TableCell>
                          <Badge variant={category.status === "Active" ? "default" : "outline"}>
                            {category.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Badges & Rewards</CardTitle>
              <CardDescription>
                Create and manage badges, achievements, and special recognitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    name: "Rising Star", 
                    description: "Awarded to students who gain 100+ points in their first month", 
                    icon: <Star className="h-8 w-8 text-yellow-500" />,
                    criteria: "100+ points in first 30 days",
                    rarity: "Uncommon"
                  },
                  { 
                    name: "Code Master", 
                    description: "Awarded for winning 3+ coding competitions", 
                    icon: <Trophy className="h-8 w-8 text-blue-500" />,
                    criteria: "Win 3+ coding competitions",
                    rarity: "Rare"
                  },
                  { 
                    name: "Research Pioneer", 
                    description: "Awarded for publishing research in a peer-reviewed journal", 
                    icon: <Award className="h-8 w-8 text-purple-500" />,
                    criteria: "Published research paper",
                    rarity: "Epic"
                  },
                  { 
                    name: "Team Leader", 
                    description: "Awarded for leading a team of 5+ students on a major project", 
                    icon: <Trophy className="h-8 w-8 text-green-500" />,
                    criteria: "Lead team of 5+ on verified project",
                    rarity: "Rare"
                  },
                  { 
                    name: "Consistent Achiever", 
                    description: "Awarded for logging achievements for 10 consecutive weeks", 
                    icon: <Award className="h-8 w-8 text-orange-500" />,
                    criteria: "10 consecutive weeks with achievements",
                    rarity: "Uncommon"
                  },
                  { 
                    name: "Community Champion", 
                    description: "Awarded for organizing 3+ campus events with 50+ attendees", 
                    icon: <Trophy className="h-8 w-8 text-indigo-500" />,
                    criteria: "Organize 3+ events with 50+ attendees",
                    rarity: "Epic"
                  },
                ].map((badge, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{badge.name}</CardTitle>
                        <Badge variant="outline">
                          {badge.rarity}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {badge.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 pb-2">
                      <div className="flex justify-center py-2">
                        <div className="rounded-full bg-gray-100 p-4">
                          {badge.icon}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Criteria:</span> {badge.criteria}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Badge
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Special Events</CardTitle>
              <CardDescription>
                Configure special events, challenges, and competitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { 
                        name: "Winter Coding Challenge", 
                        description: "Special coding challenges with bonus points during winter break", 
                        duration: "Dec 15, 2023 - Jan 15, 2024", 
                        status: "Scheduled" 
                      },
                      { 
                        name: "Research Symposium", 
                        description: "Special event for showcasing research projects with bonus recognition", 
                        duration: "March 10-12, 2024", 
                        status: "Scheduled" 
                      },
                      { 
                        name: "Hackathon Week", 
                        description: "Week-long hackathon with special categories and bonus credits", 
                        duration: "April 5-12, 2024", 
                        status: "Draft" 
                      },
                      { 
                        name: "Leadership Summit", 
                        description: "Special recognition event for community leaders", 
                        duration: "May 15, 2024", 
                        status: "Draft" 
                      },
                      { 
                        name: "Fall Welcome Challenge", 
                        description: "Special onboarding challenges for new students with bonus points", 
                        duration: "Sep 1-15, 2024", 
                        status: "Planning" 
                      },
                    ].map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.description}</TableCell>
                        <TableCell>{event.duration}</TableCell>
                        <TableCell>
                          <Badge variant={
                            event.status === "Active" ? "default" :
                            event.status === "Scheduled" ? "outline" :
                            "secondary"
                          }>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Calendar className="h-4 w-4" />
                              <span className="sr-only">Schedule</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
