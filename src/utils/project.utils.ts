
import { Profile } from '@/types/message.types';

export const createSafeProfile = (profile: any | null): Profile => {
  if (!profile) {
    return {
      id: '',
      username: 'Unknown',
      full_name: 'Unknown User',
      avatar_url: null
    };
  }

  return {
    id: profile.id || '',
    username: profile.username || 'Unknown',
    full_name: profile.full_name || 'Unknown User',
    avatar_url: profile.avatar_url || null
  };
};
