
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Globe, Linkedin, MapPin, Mail, Twitter, Users, MessageSquare } from "lucide-react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ExtendedProfileData } from "@/types/project.types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  profileData: ExtendedProfileData;
  isOwnProfile: boolean;
  connectionStatus: string | null;
  connectionId: string | null;
  points: number;
  userRank: number | null;
  achievementCount: number;
  onProfileUpdated: (newProfileData: ExtendedProfileData) => void;
  onSendConnectionRequest: () => void;
  onAcceptConnectionRequest: () => void;
  onRemoveConnection: () => void;
}

export function ProfileHeader({
  profileData,
  isOwnProfile,
  connectionStatus,
  connectionId,
  points,
  userRank,
  achievementCount,
  onProfileUpdated,
  onSendConnectionRequest,
  onAcceptConnectionRequest,
  onRemoveConnection
}: ProfileHeaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-center md:items-start">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={profileData.avatar_url || undefined} alt={profileData.full_name} />
          <AvatarFallback>{profileData.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        
        {isOwnProfile && (
          <EditProfileDialog profileData={profileData} onProfileUpdated={onProfileUpdated} />
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
                  <Button variant="outline" onClick={onRemoveConnection}>
                    <Users className="h-4 w-4 mr-2" />
                    Connected
                  </Button>
                  <Button asChild>
                    <Link to={`/messages?user=${profileData.id}`}>
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
                <Button className="bg-uprit-indigo hover:bg-uprit-indigo/90" onClick={onSendConnectionRequest}>
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
            <span>{profileData.location || 'Rochester, NY'}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <Mail className="h-4 w-4 mr-1" />
            <span>{profileData.username}@rit.edu</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">
          {profileData.bio || 
            (profileData.department 
              ? `Student in the ${profileData.department} department with a passion for learning and collaboration.` 
              : 'Student with a passion for learning and collaboration.')}
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
            <p className="text-gray-700 font-bold text-xl">{achievementCount}</p>
            <p className="text-gray-500 text-sm">Achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
}
