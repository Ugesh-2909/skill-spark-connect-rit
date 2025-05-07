
import { Profile } from '@/types/message.types';

/**
 * Creates a safe profile object from potentially null data
 */
export const createSafeProfile = (profileData: any): Profile | undefined => {
  if (!profileData || typeof profileData !== 'object') {
    return undefined;
  }
  
  return {
    id: String(profileData?.id || ''),
    username: String(profileData?.username || ''),
    full_name: String(profileData?.full_name || ''),
    avatar_url: profileData?.avatar_url || null
  };
};
