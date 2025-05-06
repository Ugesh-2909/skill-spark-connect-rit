
import { MainLayout } from "@/layouts/MainLayout";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Filter, Trophy, Medal, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const { leaderboard, loading, fetchLeaderboard, getTopPerformers } = useLeaderboard();
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  
  // Filter users based on search
  const filteredUsers = leaderboard.filter((user) => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesProgram = selectedProgram === "all" || user.department === selectedProgram;
    // For now, we'll use departments for filtering
    
    // We don't have a year field, so we'll skip this filter
    // const matchesYear = selectedYear === "all" || user.year === selectedYear;
    
    return matchesSearch && matchesProgram;
  });
  
  // Get unique departments for filters
  const departments = Array.from(new Set(leaderboard.map(user => user.department))).filter(Boolean);
  
  useEffect(() => {
    // Get top performers for the cards
    getTopPerformers(3).then(setTopPerformers);
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Leaderboard</h1>
          <p className="text-gray-500">Discover top performing students across various categories</p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-uprit-indigo" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPerformers.length > 0 && (
                <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-yellow-400 p-3">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">#1 Overall</h3>
                          <p className="text-gray-700">{topPerformers[0]?.full_name}</p>
                        </div>
                      </div>
                      <div className="text-xl font-bold">{topPerformers[0]?.points} pts</div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {topPerformers.length > 0 && (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-blue-500 p-3">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Most Achievements</h3>
                          <p className="text-gray-700">
                            {topPerformers.sort((a, b) => b.achievements_count - a.achievements_count)[0]?.full_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-xl font-bold">
                        {topPerformers.sort((a, b) => b.achievements_count - a.achievements_count)[0]?.achievements_count}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {topPerformers.length > 0 && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-purple-500 p-3">
                          <Medal className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Most Projects</h3>
                          <p className="text-gray-700">
                            {topPerformers.sort((a, b) => b.projects_count - a.projects_count)[0]?.full_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-xl font-bold">
                        {topPerformers.sort((a, b) => b.projects_count - a.projects_count)[0]?.projects_count}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle className="text-xl font-bold">Student Rankings</CardTitle>
                    <CardDescription>
                      Showing {filteredUsers.length} students sorted by total points
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search students..."
                        className="pl-8 w-full md:w-64 bg-gray-50 border-gray-200 focus-visible:bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Select
                        value={selectedProgram}
                        onValueChange={setSelectedProgram}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((department) => (
                            <SelectItem key={department as string} value={department as string}>
                              {department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overall" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overall">Overall</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="department">By Department</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overall" className="mt-0">
                    <div className="relative overflow-x-auto rounded-md border">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 w-16 text-center">Rank</th>
                            <th scope="col" className="px-6 py-3">Student</th>
                            <th scope="col" className="px-6 py-3">Department</th>
                            <th scope="col" className="px-6 py-3 text-center">Achievements</th>
                            <th scope="col" className="px-6 py-3 text-center">Projects</th>
                            <th scope="col" className="px-6 py-3 text-center">Connections</th>
                            <th scope="col" className="px-6 py-3 text-right">Points</th>
                            <th scope="col" className="px-6 py-3 w-24"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user, index) => (
                            <tr key={user.id} className={`${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            } hover:bg-gray-100`}>
                              <td className="px-4 py-4 text-center">
                                <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                                  user.rank === 1 ? 'bg-yellow-400 text-white' : 
                                  user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                                  user.rank === 3 ? 'bg-amber-600 text-white' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {user.rank}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
                                    <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="font-medium">{user.full_name}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">{user.department || 'Not specified'}</td>
                              <td className="px-6 py-4 text-center">{user.achievements_count}</td>
                              <td className="px-6 py-4 text-center">{user.projects_count}</td>
                              <td className="px-6 py-4 text-center">{user.connections_count}</td>
                              <td className="px-6 py-4 text-right font-bold">{user.points}</td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/profile/${user.id}`}>View</Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="monthly" className="mt-0">
                    <div className="p-8 text-center">
                      <h3 className="text-lg font-medium mb-2">Monthly Rankings</h3>
                      <p className="text-gray-500 mb-4">Coming soon - Monthly rankings will be available soon</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="department" className="mt-0">
                    <div className="p-8 text-center">
                      <h3 className="text-lg font-medium mb-2">Department Rankings</h3>
                      <p className="text-gray-500 mb-4">Coming soon - Filter and view rankings by specific departments</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Leaderboard;
