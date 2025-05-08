
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Code, Milestone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AchievementForm } from "@/hooks/use-achievement-form";
import { ProjectForm } from "@/components/project/ProjectForm";

interface ProfileTabsProps {
  isOwnProfile: boolean;
  achievementsContent: ReactNode;
  projectsContent: ReactNode;
  achievementsCount: number;
  projectsCount: number;
}

export function ProfileTabs({
  isOwnProfile,
  achievementsContent,
  projectsContent,
  achievementsCount,
  projectsCount
}: ProfileTabsProps) {
  return (
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
        
        {achievementsCount === 0 ? (
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
          achievementsContent
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
        
        {projectsCount === 0 ? (
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
          projectsContent
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
  );
}
