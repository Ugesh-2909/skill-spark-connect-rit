
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, CheckCircle, XCircle, Clock, Filter, ChevronRight, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const pendingAchievements = [
  {
    id: "1",
    title: "HackRIT 2023 Winner",
    category: "Competition",
    studentName: "Jane Doe",
    studentId: "st12345",
    department: "Computer Science",
    submittedDate: "2023-11-15",
    evidence: "Certificate of Achievement, Project Repository Link",
    description: "First place winner in the HackRIT 2023 hackathon for developing an innovative accessibility application.",
    proposedCredits: 50,
  },
  {
    id: "2",
    title: "AWS Certified Solutions Architect",
    category: "Certification",
    studentName: "John Smith",
    studentId: "st67890",
    department: "Software Engineering",
    submittedDate: "2023-11-14",
    evidence: "Certification ID, Digital Badge",
    description: "Completed the AWS Certified Solutions Architect - Associate certification.",
    proposedCredits: 40,
  },
  {
    id: "3",
    title: "Research Paper Publication",
    category: "Academic",
    studentName: "Emma Brown",
    studentId: "st24680",
    department: "Computer Engineering",
    submittedDate: "2023-11-12",
    evidence: "Published Paper Link, Journal Reference",
    description: "Published a research paper titled 'Advances in Neural Network Optimization' in the Journal of Computer Science Research.",
    proposedCredits: 75,
  },
  {
    id: "4",
    title: "Google Developer Student Club Leadership",
    category: "Leadership",
    studentName: "Michael Johnson",
    studentId: "st13579",
    department: "Information Technology",
    submittedDate: "2023-11-10",
    evidence: "Appointment Letter, Event Documentation",
    description: "Served as the Lead for the Google Developer Student Club for the Fall 2023 semester, organizing 5 workshops and 2 major events.",
    proposedCredits: 60,
  }
];

export function AchievementVerification() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  const filteredAchievements = pendingAchievements.filter(achievement => {
    // Apply search filter
    const matchesSearch = 
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = categoryFilter === "all" || achievement.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Sort achievements
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
    } else if (sortBy === "credits-high") {
      return b.proposedCredits - a.proposedCredits;
    } else if (sortBy === "credits-low") {
      return a.proposedCredits - b.proposedCredits;
    }
    return 0;
  });

  const selectedAchievementData = pendingAchievements.find(a => a.id === selectedAchievement);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Achievement Verification</h2>
      
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="outline" className="ml-2">
              {pendingAchievements.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Search Achievements</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by title, student name, or ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48">
                <label className="text-sm font-medium mb-1 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort achievements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="credits-high">Highest Credits</SelectItem>
                    <SelectItem value="credits-low">Lowest Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-medium">Pending Verification ({sortedAchievements.length})</h3>
              
              {sortedAchievements.length > 0 ? (
                sortedAchievements.map(achievement => (
                  <Card 
                    key={achievement.id} 
                    className={`cursor-pointer hover:border-uprit-indigo transition-colors ${selectedAchievement === achievement.id ? 'border-uprit-indigo' : ''}`}
                    onClick={() => setSelectedAchievement(achievement.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <CardDescription>{achievement.category}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-uprit-purple border-uprit-purple">
                          {achievement.proposedCredits} Credits
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${achievement.studentId}`} alt={achievement.studentName} />
                          <AvatarFallback>{achievement.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{achievement.studentName}</p>
                          <p className="text-xs text-muted-foreground">{achievement.department}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between items-center">
                      <span>Submitted on {new Date(achievement.submittedDate).toLocaleDateString()}</span>
                      <ChevronRight className="h-4 w-4" />
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No achievements match your search criteria.
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              {selectedAchievementData ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Achievement Details</span>
                      <Badge variant="outline" className="text-uprit-purple border-uprit-purple">
                        {selectedAchievementData.proposedCredits} Credits
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Review and verify the submitted achievement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedAchievementData.title}</h3>
                      <Badge variant="outline" className="mt-1">
                        {selectedAchievementData.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedAchievementData.studentId}`} alt={selectedAchievementData.studentName} />
                        <AvatarFallback>{selectedAchievementData.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{selectedAchievementData.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedAchievementData.department} • ID: {selectedAchievementData.studentId}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-1">Description</h4>
                      <p className="text-sm">{selectedAchievementData.description}</p>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-1">Evidence Provided</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAchievementData.evidence.split(',').map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item.trim()}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-1">Credit Adjustment</h4>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          defaultValue={selectedAchievementData.proposedCredits}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">
                          (Proposed: {selectedAchievementData.proposedCredits})
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-1">Verification Notes (Optional)</h4>
                      <Input placeholder="Add notes about this verification..." />
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="default" className="flex-1">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button variant="ghost">
                      <Clock className="mr-2 h-4 w-4" />
                      Defer
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <ChevronRight className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-1">Select an Achievement</h3>
                    <p className="text-sm">
                      Click on an achievement from the list to view details and verify
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="verified">
          <Card>
            <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
              <h3 className="font-medium mb-1">Verified Achievements</h3>
              <p className="text-sm">
                This tab will show all verified achievements with filterable options
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected">
          <Card>
            <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
              <h3 className="font-medium mb-1">Rejected Achievements</h3>
              <p className="text-sm">
                This tab will show all rejected achievements with reason and details
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
              <h3 className="font-medium mb-1">All Achievements</h3>
              <p className="text-sm">
                This tab will show all achievements with comprehensive filtering options
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
