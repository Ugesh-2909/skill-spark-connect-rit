
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

interface Conversation {
  userId: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async (otherUserId: string) => {
    try {
      if (!user) return [];
      
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, username, full_name, avatar_url),
          recipient:recipient_id(id, username, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .or(`sender_id.eq.${otherUserId},recipient_id.eq.${otherUserId}`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Filter messages to only show the conversation between these two users
      const conversationMessages = data.filter(msg => 
        (msg.sender_id === user.id && msg.recipient_id === otherUserId) || 
        (msg.sender_id === otherUserId && msg.recipient_id === user.id)
      );
      
      setMessages(conversationMessages);
      
      // Mark messages as read
      markMessagesAsRead(otherUserId);
      
      return conversationMessages;
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Failed to load messages",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      if (!user) return [];
      
      setLoading(true);
      
      // Get all messages sent by or to the current user
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, username, full_name, avatar_url),
          recipient:recipient_id(id, username, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Create a map of user IDs to conversation data
      const conversationsMap = new Map<string, Conversation>();
      
      data.forEach(msg => {
        // Determine which user is the other party in the conversation
        const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        const otherUser = msg.sender_id === user.id ? msg.recipient : msg.sender;
        
        if (!otherUser) return;
        
        // Check if we've already processed this user
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            username: otherUser.username,
            full_name: otherUser.full_name,
            avatar_url: otherUser.avatar_url,
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount: msg.recipient_id === user.id && !msg.read ? 1 : 0
          });
        } else if (msg.recipient_id === user.id && !msg.read) {
          // If this is an unread message, increment the unread count
          const conversation = conversationsMap.get(otherUserId)!;
          conversation.unreadCount += 1;
        }
      });
      
      // Convert the map to an array and sort by last message time
      const conversationsArray = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
      
      setConversations(conversationsArray);
      return conversationsArray;
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Failed to load conversations",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (recipientId: string, content: string) => {
    try {
      if (!user) throw new Error("You must be logged in to send a message");
      if (!content.trim()) throw new Error("Message cannot be empty");
      
      const { data, error } = await supabase
        .from('messages')
        .insert([
          { 
            sender_id: user.id, 
            recipient_id: recipientId,
            content: content.trim() 
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      
      return data;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const markMessagesAsRead = async (senderId: string) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', senderId)
        .eq('recipient_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.sender_id === senderId && msg.recipient_id === user.id && !msg.read
            ? { ...msg, read: true }
            : msg
        )
      );
      
      // Update unread count in conversations
      setConversations(prev => 
        prev.map(convo => 
          convo.userId === senderId
            ? { ...convo, unreadCount: 0 }
            : convo
        )
      );
      
      return true;
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  };

  const getUnreadMessagesCount = async () => {
    try {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      return count || 0;
    } catch (error) {
      console.error('Error getting unread messages count:', error);
      return 0;
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Subscribe to real-time changes for messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        }, 
        (payload) => {
          const newMessage = payload.new as Message;
          
          // If the new message is part of the current conversation, add it to the messages state
          setMessages(prev => [...prev, newMessage]);
          
          // Refresh conversations to update the last message
          fetchConversations();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'messages',
        }, 
        () => {
          // Refresh messages to reflect read status changes
          fetchConversations();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    messages,
    conversations,
    loading,
    fetchMessages,
    fetchConversations,
    sendMessage,
    markMessagesAsRead,
    getUnreadMessagesCount,
  };
}
