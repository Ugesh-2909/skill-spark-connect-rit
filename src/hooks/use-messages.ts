
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: Profile;
  recipient?: Profile;
}

export interface ConversationUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ConversationUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async (recipientId: string) => {
    try {
      if (!user) return;
      
      setLoading(true);
      
      // Get messages between current user and recipient
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(*),
          recipient:recipient_id(*)
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      // Fix typing issues by ensuring the data has the correct structure
      const typedMessages: Message[] = (data || []).map(msg => {
        // Use proper type guards and non-null assertions where appropriate
        const sender: Profile | undefined = typeof msg.sender === 'object' && msg.sender !== null ? 
          {
            id: msg.sender.id ? String(msg.sender.id) : '',
            username: msg.sender.username ? String(msg.sender.username) : '',
            full_name: msg.sender.full_name ? String(msg.sender.full_name) : '',
            avatar_url: msg.sender.avatar_url
          } : undefined;
          
        const recipient: Profile | undefined = typeof msg.recipient === 'object' && msg.recipient !== null ? 
          {
            id: msg.recipient.id ? String(msg.recipient.id) : '',
            username: msg.recipient.username ? String(msg.recipient.username) : '',
            full_name: msg.recipient.full_name ? String(msg.recipient.full_name) : '',
            avatar_url: msg.recipient.avatar_url
          } : undefined;
          
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
      
      setMessages(typedMessages);
      
      // Mark received messages as read
      if (data && data.length > 0) {
        const unreadMessages = data.filter(msg => 
          msg.recipient_id === user.id && 
          msg.sender_id === recipientId && 
          !msg.read
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Failed to load messages",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      
      // Get all users the current user has messaged with
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (messagesError) throw messagesError;
      
      if (!messagesData || messagesData.length === 0) {
        setConversations([]);
        return;
      }
      
      // Get unique user IDs the current user has messaged with
      const uniqueUserIds = new Set<string>();
      messagesData.forEach(msg => {
        if (msg.sender_id === user.id) {
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
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${user.id})`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        // Get unread count
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
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
      const conversations = userProfiles
        .filter(Boolean)
        .sort((a, b) => new Date(b!.last_message_time).getTime() - new Date(a!.last_message_time).getTime());
      
      setConversations(conversations as ConversationUser[]);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Failed to load conversations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUnreadMessagesCount = async (): Promise<number> => {
    try {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      return count || 0;
    } catch (error: any) {
      console.error('Error getting unread messages count:', error);
      return 0;
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);
  
  return {
    messages,
    conversations,
    loading,
    fetchMessages,
    fetchConversations,
    getUnreadMessagesCount,
    sendMessage: async (recipientId: string, content: string) => {
      try {
        if (!user) {
          toast({
            title: "Authentication required",
            description: "You must be logged in to send messages",
            variant: "destructive",
          });
          return false;
        }
        
        const { data, error } = await supabase
          .from('messages')
          .insert([
            {
              sender_id: user.id,
              recipient_id: recipientId,
              content
            }
          ]);
        
        if (error) throw error;
        
        fetchMessages(recipientId);
        fetchConversations();
        
        return true;
      } catch (error: any) {
        console.error('Error sending message:', error);
        toast({
          title: "Failed to send message",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
    }
  };
}
