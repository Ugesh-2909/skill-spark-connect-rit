
import { ReactNode } from "react";

interface AvatarGroupProps {
  children: ReactNode[];
  max?: number;
}

export function AvatarGroup({ children, max = 4 }: AvatarGroupProps) {
  const visibleAvatars = children.slice(0, max);
  const remainingAvatars = children.length - max;
  
  return (
    <div className="flex -space-x-2">
      {visibleAvatars.map((child, index) => (
        <div key={index} className="relative ring-2 ring-background rounded-full">
          {child}
        </div>
      ))}
      
      {remainingAvatars > 0 && (
        <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 text-xs font-medium rounded-full ring-2 ring-background">
          +{remainingAvatars}
        </div>
      )}
    </div>
  );
}
