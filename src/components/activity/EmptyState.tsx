
import { Trophy } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-10 text-gray-500">
      <div className="flex justify-center mb-4">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-gray-400" />
        </div>
      </div>
      <h3 className="font-medium mb-1">No activities yet</h3>
      <p className="text-sm">Be the first to add an achievement!</p>
    </div>
  );
}
