
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Like {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'achievement' | 'project';
  created_at: string;
}

export function useLikes() {
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLikes = async (itemId: string, itemType: 'achievement' | 'project') => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('item_id', itemId)
        .eq('item_type', itemType);
      
      if (error) throw error;
      setLikes(data || []);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching likes:', error);
      toast({
        title: "Failed to load likes",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const likeItem = async (itemId: string, itemType: 'achievement' | 'project') => {
    try {
      if (!user) throw new Error("You must be logged in to like an item");
      
      const { data, error } = await supabase
        .from('likes')
        .insert([
          { 
            user_id: user.id, 
            item_id: itemId,
            item_type: itemType 
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setLikes(prev => [...prev, data]);
      return data;
    } catch (error: any) {
      if (error.code === '23505') {
        // Unique constraint violation - user already liked this item
        toast({
          title: "Already liked",
          description: "You have already liked this item",
        });
      } else {
        console.error('Error liking item:', error);
        toast({
          title: "Failed to like item",
          description: error.message,
          variant: "destructive",
        });
      }
      return null;
    }
  };

  const unlikeItem = async (itemId: string, itemType: 'achievement' | 'project') => {
    try {
      if (!user) throw new Error("You must be logged in to unlike an item");
      
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('item_type', itemType);
      
      if (error) throw error;
      
      setLikes(prev => 
        prev.filter(like => 
          !(like.user_id === user.id && like.item_id === itemId && like.item_type === itemType)
        )
      );
      return true;
    } catch (error: any) {
      console.error('Error unliking item:', error);
      toast({
        title: "Failed to unlike item",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const checkIfUserLiked = async (itemId: string, itemType: 'achievement' | 'project') => {
    try {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is the "no rows returned" error
      
      return !!data;
    } catch (error) {
      console.error('Error checking if user liked:', error);
      return false;
    }
  };

  const getLikeCount = async (itemId: string, itemType: 'achievement' | 'project') => {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('id', { count: 'exact', head: true })
        .eq('item_id', itemId)
        .eq('item_type', itemType);
      
      if (error) throw error;
      
      return count || 0;
    } catch (error) {
      console.error('Error getting like count:', error);
      return 0;
    }
  };

  // Subscribe to real-time changes for likes
  useEffect(() => {
    const channel = supabase
      .channel('public:likes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'likes' 
        }, 
        (payload) => {
          const like = payload.new as Like;
          const oldLike = payload.old as Like;
          
          if (payload.eventType === 'INSERT') {
            setLikes(prev => [...prev, like]);
          }
          else if (payload.eventType === 'DELETE') {
            setLikes(prev => 
              prev.filter(l => l.id !== oldLike.id)
            );
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    likes,
    loading,
    fetchLikes,
    likeItem,
    unlikeItem,
    checkIfUserLiked,
    getLikeCount,
  };
}
