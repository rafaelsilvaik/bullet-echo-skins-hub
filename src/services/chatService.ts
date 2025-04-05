
import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'] & {
  user_profile?: {
    username: string;
    avatar_url: string | null;
  };
};

export const sendMessage = async (userId: string, content: string): Promise<ChatMessage> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([
      {
        user_id: userId,
        content,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  
  // Fetch user profile separately
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('username, avatar_url')
    .eq('id', userId)
    .single();
  
  return {
    ...data,
    user_profile: userProfile || undefined
  } as ChatMessage;
};

export const getRecentMessages = async (limit: number = 50): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  
  // Get all unique user IDs from messages
  const userIds = [...new Set((data || []).map(msg => msg.user_id))];
  
  // Fetch all user profiles in one go
  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('id, username, avatar_url')
    .in('id', userIds);
  
  // Create a map for quick lookup
  const userProfileMap = (userProfiles || []).reduce((map, profile) => {
    map[profile.id] = profile;
    return map;
  }, {} as Record<string, {id: string, username: string, avatar_url: string | null}>);
  
  // Add user profile info to each message
  const messagesWithUserInfo = (data || []).map(msg => ({
    ...msg,
    user_profile: userProfileMap[msg.user_id] ? {
      username: userProfileMap[msg.user_id].username,
      avatar_url: userProfileMap[msg.user_id].avatar_url
    } : undefined
  }));
  
  return messagesWithUserInfo as ChatMessage[];
};

export const subscribeToChatMessages = (
  callback: (message: ChatMessage) => void
) => {
  const subscription = supabase
    .channel('public:chat_messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
      },
      async (payload) => {
        // Fetch user profile for the new message
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('username, avatar_url')
          .eq('id', payload.new.user_id)
          .single();

        const newMessage: ChatMessage = {
          ...payload.new as any,
          user_profile: userProfile || undefined
        };

        callback(newMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
