export type MessageType = 'text' | 'image' | 'system';

export interface ChatRoom {
  id: string;
  customerId: string;
  shamanId: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface ChatRoomWithParticipant extends ChatRoom {
  otherUser: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    businessName?: string;
    images?: string[];
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  isRead: boolean;
  createdAt: string;
}

export interface SendMessageData {
  content: string;
}

export interface CreateRoomData {
  shamanId: string;
}
