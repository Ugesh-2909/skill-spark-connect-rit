
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/message.types';
import { createSafeProfile } from '@/utils/message.utils';

/**
 * Fetch messages between current user and recipient
 */
export const fetchUserMessages = async (userId: string, recipientId: string): Promise<Message[]> => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(*),
      recipient:recipient_id(*)
    `)
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${userId})`)
    .order('created_at', { ascending: true });
  
  if (error) {
    throw error;
  }

  // Transform data to ensure correct typing
  return (data || []).map(msg => {
    const sender = createSafeProfile(msg.sender);
    const recipient = createSafeProfile(msg.recipient);
    
    return {
      id: msg.id,
      sender_id: msg.sender_id,
      recipient_id: msg.recipient_id,
      content: msg.content,
      created_at: msg.created_at,
      read: msg.read,
      sender,
      recipient
    };
  });
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (userId: string, senderId: string, messageIds: string[]): Promise<void> => {
  if (messageIds.length === 0) {
    return;
  }
  
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .in('id', messageIds);
  
  if (error) {
    throw error;
  }
};

/**
 * Send a new message
 */
export const sendNewMessage = async (senderId: string, recipientId: string, content: string): Promise<boolean> => {
  const { error } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: senderId,
        recipient_id: recipientId,
        content
      }
    ]);
  
  if (error) {
    throw error;
  }
  
  return true;
};

/**
 * Fetch conversation users
 */
export const fetchConversationUsers = async (userId: string) => {
  // Get all messages the current user has sent or received
  const { data: messagesData, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  if (messagesError) {
    throw messagesError;
  }
  
  if (!messagesData || messagesData.length === 0) {
    return [];
  }
  
  // Extract unique user IDs
  const uniqueUserIds = new Set<string>();
  messagesData.forEach(msg => {
    if (msg.sender_id === userId) {
      uniqueUserIds.add(msg.recipient_id);
    } else {
      uniqueUserIds.add(msg.sender_id);
    }
  });
  
  // Get profile data for each user
  const userProfiles = await Promise.all([...uniqueUserIds].map(async (id) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', id)
      .single();
    
    if (!profile) return null;
    
    // Get the last message between current user and this user
    const { data: lastMessageData } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    // Get unread count
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('sender_id', id)
      .eq('read', false);
    
    return {
      id: profile.id,
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      last_message: lastMessageData?.content || '',
      last_message_time: lastMessageData?.created_at || '',
      unread_count: unreadCount || 0
    };
  }));
  
  // Filter out null values and sort by last message time
  return userProfiles
    .filter(Boolean)
    .sort((a, b) => new Date(b!.last_message_time).getTime() - new Date(a!.last_message_time).getTime());
};

/**
 * Get total unread messages count
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
  if (!userId) return 0;
  
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('read', false);
  
  if (error) {
    console.error('Error getting unread messages count:', error);
    return 0;
  }
  
  return count || 0;
};
