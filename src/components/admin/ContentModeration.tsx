
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Flag, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  AlertOctagon,
  UserX,
  Filter
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const flaggedContent = [
  {
    id: "1",
    type: "Post",
    content: "Check out my new achievement! I just won the national coding competition without even trying. Everyone else was terrible!",
    user: {
      name: "James Wilson",
      id: "st54321",
      avatar: "https://i.pravatar.cc/150?img=33"
    },
    flagReason: "Inappropriate Conduct",
    flaggedBy: 3,
    flaggedDate: "2023-11-15T10:30:00",
    flagDetails: "Disrespectful to other participants"
  },
  {
    id: "2",
    type: "Comment",
    content: "This is completely fake. I know for a fact you didn't actually get this certification because I was monitoring all participants.",
    user: {
      name: "Olivia Taylor",
      id: "st98765",
      avatar: "https://i.pravatar.cc/150?img=47"
    },
    flagReason: "Harassment",
    flaggedBy: 5,
    flaggedDate: "2023-11-15T09:15:00",
    flagDetails: "Accusatory without evidence"
  },
  {
    id: "3",
    type: "Post",
    content: "Looking for team members for the upcoming hackathon. Only people with previous wins should apply. No beginners.",
    user: {
      name: "Ethan Brown",
      id: "st13579",
      avatar: "https://i.pravatar.cc/150?img=15"
    },
    flagReason: "Discriminatory",
    flaggedBy: 2,
    flaggedDate: "2023-11-14T16:45:00",
    flagDetails: "Exclusionary behavior"
  },
  {
    id: "4",
    type: "Comment",
    content: "Your project is just a copy of something that already exists. You should be ashamed of trying to pass this off as original work.",
    user: {
      name: "Lucas Martin",
      id: "st24680",
      avatar: "https://i.pravatar.cc/150?img=52"
    },
    flagReason: "Harassment",
    flaggedBy: 4,
    flaggedDate: "2023-11-14T11:20:00",
    flagDetails: "Accusatory and negative"
  }
];

export function ContentModeration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const filteredContent = flaggedContent.filter(item => {
    // Apply search filter
    const matchesSearch = 
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply type filter
    const matchesType = typeFilter === "all" || item.type.toLowerCase() === typeFilter.toLowerCase();
    
    // Apply reason filter
    const matchesReason = reasonFilter === "all" || item.flagReason.toLowerCase() === reasonFilter.toLowerCase();
    
    return matchesSearch && matchesType && matchesReason;
  });

  // Sort by most recent first
  const sortedContent = [...filteredContent].sort((a, b) => {
    return new Date(b.flaggedDate).getTime() - new Date(a.flaggedDate).getTime();
  });

  const selectedContentData = flaggedContent.find(item => item.id === selectedContent);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Content Moderation</h2>
      
      <Tabs defaultValue="flagged" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flagged">
            Flagged
            <Badge variant="outline" className="ml-2">
              {flaggedContent.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="removed">Removed</TabsTrigger>
          <TabsTrigger value="warnings">User Warnings</TabsTrigger>
          <TabsTrigger value="appeals">Appeals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flagged" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Search Content</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by content or username..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-40">
                <label className="text-sm font-medium mb-1 block">Content Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="post">Posts</SelectItem>
                    <SelectItem value="comment">Comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48">
                <label className="text-sm font-medium mb-1 block">Flag Reason</label>
                <Select value={reasonFilter} onValueChange={setReasonFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reasons</SelectItem>
                    <SelectItem value="inappropriate conduct">Inappropriate Conduct</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="discriminatory">Discriminatory</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
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
              <h3 className="font-medium">Flagged Content ({sortedContent.length})</h3>
              
              {sortedContent.length > 0 ? (
                sortedContent.map(item => (
                  <Card 
                    key={item.id} 
                    className={`cursor-pointer hover:border-red-300 transition-colors ${selectedContent === item.id ? 'border-red-300' : ''}`}
                    onClick={() => setSelectedContent(item.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2 items-center">
                          <Badge variant={item.type === "Post" ? "default" : "outline"} className="uppercase text-xs">
                            {item.type}
                          </Badge>
                          <Badge variant="outline" className="text-red-500 border-red-300 flex items-center gap-1">
                            <Flag className="h-3 w-3" />
                            {item.flaggedBy}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-amber-500 border-amber-300">
                          {item.flagReason}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.user.avatar} alt={item.user.name} />
                          <AvatarFallback>{item.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{item.user.name}</p>
                          <p className="text-xs line-clamp-2">{item.content}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 text-xs text-muted-foreground">
                      Flagged {new Date(item.flaggedDate).toLocaleDateString()} at {new Date(item.flaggedDate).toLocaleTimeString()}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No flagged content matches your search criteria.
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              {selectedContentData ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedContentData.type === "Post" ? "default" : "outline"} className="uppercase">
                          {selectedContentData.type}
                        </Badge>
                        <span>Review</span>
                      </div>
                      <Badge variant="outline" className="text-red-500 border-red-300 flex items-center gap-1">
                        <Flag className="h-3 w-3" />
                        {selectedContentData.flaggedBy} flags
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedContentData.user.avatar} alt={selectedContentData.user.name} />
                          <AvatarFallback>{selectedContentData.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedContentData.user.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {selectedContentData.user.id}</p>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="text-red-500">
                        <UserX className="h-4 w-4 mr-1" />
                        View User
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <div className="flex gap-2 items-center mb-2">
                        {selectedContentData.type === "Post" ? (
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm font-medium">{selectedContentData.type} Content</span>
                      </div>
                      <p className="text-sm">{selectedContentData.content}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <h4 className="text-sm font-medium">Flag Reason: {selectedContentData.flagReason}</h4>
                      </div>
                      <p className="text-sm pl-6">{selectedContentData.flagDetails}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Moderation Comment (Optional)</h4>
                      <Input placeholder="Add a comment about this moderation decision..." />
                    </div>
                  </CardContent>
                  <CardFooter className="space-x-2">
                    <Button variant="outline" className="flex-1">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Content
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="mr-2 h-4 w-4" />
                      Remove Content
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <AlertOctagon className="mr-2 h-4 w-4" />
                      Warn User
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <Flag className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-1">Select Flagged Content</h3>
                    <p className="text-sm">
                      Click on an item from the list to review and moderate
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="removed">
          <Card>
            <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
              <h3 className="font-medium mb-1">Removed Content</h3>
              <p className="text-sm">
                This tab will show content that has been removed by moderators
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="warnings">
          <Card>
            <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
              <h3 className="font-medium mb-1">User Warnings</h3>
              <p className="text-sm">
                This tab will show warnings issued to users
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appeals">
          <Card>
            <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
              <h3 className="font-medium mb-1">Content Appeals</h3>
              <p className="text-sm">
                This tab will show appeals from users regarding moderation decisions
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
