
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  follower?: Profile;
  following?: Profile;
}

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

export function useConnections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConnections = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      
      // Get connections where the user is the follower
      // Need to use raw query since connections table wasn't detected by TypeScript
      const { data: followingData, error: followingError } = await supabase
        .from('connections')
        .select(`
          *,
          following:profiles!following_id(id, username, full_name, avatar_url)
        `)
        .eq('follower_id', user.id)
        .eq('status', 'accepted');
      
      if (followingError) throw followingError;
      
      // Get connections where the user is being followed
      const { data: followersData, error: followersError } = await supabase
        .from('connections')
        .select(`
          *,
          follower:profiles!follower_id(id, username, full_name, avatar_url)
        `)
        .eq('following_id', user.id)
        .eq('status', 'accepted');
      
      if (followersError) throw followersError;
      
      // Get pending connection requests
      const { data: pendingData, error: pendingError } = await supabase
        .from('connections')
        .select(`
          *,
          follower:profiles!follower_id(id, username, full_name, avatar_url)
        `)
        .eq('following_id', user.id)
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      
      // Cast the data to match the Connection type
      setConnections([...(followingData || []), ...(followersData || [])] as Connection[]);
      setPendingRequests((pendingData || []) as Connection[]);
    } catch (error: any) {
      console.error('Error fetching connections:', error);
      toast({
        title: "Failed to load connections",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (userId: string) => {
    try {
      if (!user) throw new Error("You must be logged in to send a connection request");
      
      const { data, error } = await supabase
        .from('connections')
        .insert([
          { 
            follower_id: user.id, 
            following_id: userId,
            status: 'pending' 
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent",
      });
      
      return data;
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Connection request already sent",
          description: "You have already sent a connection request to this user",
        });
      } else {
        console.error('Error sending connection request:', error);
        toast({
          title: "Failed to send connection request",
          description: error.message,
          variant: "destructive",
        });
      }
      return null;
    }
  };

  const acceptConnectionRequest = async (connectionId: string) => {
    try {
      if (!user) throw new Error("You must be logged in to accept a connection request");
      
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId)
        .eq('following_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setPendingRequests(prev => 
        prev.filter(request => request.id !== connectionId)
      );
      setConnections(prev => [...prev, data]);
      
      toast({
        title: "Connection request accepted",
        description: "You are now connected with this user",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error accepting connection request:', error);
      toast({
        title: "Failed to accept connection request",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const rejectConnectionRequest = async (connectionId: string) => {
    try {
      if (!user) throw new Error("You must be logged in to reject a connection request");
      
      const { error } = await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', connectionId)
        .eq('following_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setPendingRequests(prev => 
        prev.filter(request => request.id !== connectionId)
      );
      
      toast({
        title: "Connection request rejected",
        description: "The connection request has been rejected",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error rejecting connection request:', error);
      toast({
        title: "Failed to reject connection request",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const removeConnection = async (userId: string) => {
    try {
      if (!user) throw new Error("You must be logged in to remove a connection");
      
      // Delete where user is the follower
      await supabase
        .from('connections')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);
      
      // Delete where user is being followed
      await supabase
        .from('connections')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', user.id);
      
      // Update local state
      setConnections(prev => 
        prev.filter(connection => 
          !(connection.follower_id === user.id && connection.following_id === userId) &&
          !(connection.follower_id === userId && connection.following_id === user.id)
        )
      );
      
      toast({
        title: "Connection removed",
        description: "Your connection with this user has been removed",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error removing connection:', error);
      toast({
        title: "Failed to remove connection",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const checkConnectionStatus = async (userId: string) => {
    try {
      if (!user) return null;
      
      // Check if there's a connection where user is the follower
      const { data: followingData } = await supabase
        .from('connections')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();
      
      if (followingData) return followingData.status;
      
      // Check if there's a connection where user is being followed
      const { data: followerData } = await supabase
        .from('connections')
        .select('*')
        .eq('follower_id', userId)
        .eq('following_id', user.id)
        .single();
      
      if (followerData) return followerData.status;
      
      return null;
    } catch (error) {
      console.error('Error checking connection status:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  // Subscribe to real-time changes for connections
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:connections')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'connections',
          filter: `follower_id=eq.${user.id}`
        }, 
        () => {
          fetchConnections();
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'connections',
          filter: `following_id=eq.${user.id}`
        }, 
        () => {
          fetchConnections();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    connections,
    pendingRequests,
    loading,
    fetchConnections,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    removeConnection,
    checkConnectionStatus,
  };
}
