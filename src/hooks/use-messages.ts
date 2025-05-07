
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Message, ConversationUser } from '@/types/message.types';
import { 
  fetchUserMessages, 
  markMessagesAsRead, 
  sendNewMessage, 
  fetchConversationUsers,
  getUnreadCount
} from '@/services/message.service';

export type { Message, ConversationUser } from '@/types/message.types';

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
      
      // Fetch messages
      const fetchedMessages = await fetchUserMessages(user.id, recipientId);
      setMessages(fetchedMessages);
      
      // Mark messages as read
      const unreadMessageIds = fetchedMessages
        .filter(msg => msg.recipient_id === user.id && msg.sender_id === recipientId && !msg.read)
        .map(msg => msg.id);
        
      if (unreadMessageIds.length > 0) {
        await markMessagesAsRead(user.id, recipientId, unreadMessageIds);
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
      
      const conversationUsers = await fetchConversationUsers(user.id);
      setConversations(conversationUsers as ConversationUser[]);
      
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
      return await getUnreadCount(user.id);
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
        
        await sendNewMessage(user.id, recipientId, content);
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
