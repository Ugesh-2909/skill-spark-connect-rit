
import { useState } from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityActionsProps {
  itemId: string;
  likes: number;
  comments: number;
}

export function ActivityActions({ itemId, likes: initialLikes, comments }: ActivityActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setHasLiked(!hasLiked);
  };

  return (
    <div className="border-t border-gray-100 px-4 py-2 flex justify-between text-sm">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`text-gray-500 ${hasLiked ? 'text-red-500' : 'hover:text-blue-600'}`}
        onClick={handleLike}
      >
        <Heart className="h-4 w-4 mr-1" fill={hasLiked ? 'currentColor' : 'none'} />
        <span>{likes}</span>
      </Button>
      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
        <MessageSquare className="h-4 w-4 mr-1" />
        <span>{comments}</span>
      </Button>
      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
        <Share2 className="h-4 w-4 mr-1" />
        <span>Share</span>
      </Button>
    </div>
  );
}
