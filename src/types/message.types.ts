
export interface Profile {
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
