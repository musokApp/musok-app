import { ChatRoom, Message } from '@/types/chat.types';

export const DUMMY_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-1',
    customerId: '1',
    shamanId: 'shaman-1',
    participants: ['1', '2'],
    lastMessage: '네, 다음 주 화요일 10시에 뵙겠습니다.',
    lastMessageAt: '2025-02-14T15:30:00Z',
    createdAt: '2025-02-10T09:00:00Z',
  },
  {
    id: 'room-2',
    customerId: '1',
    shamanId: 'shaman-3',
    participants: ['1', 'user-shaman-3'],
    lastMessage: '타로 상담은 보통 40분 정도 소요됩니다.',
    lastMessageAt: '2025-02-13T11:20:00Z',
    createdAt: '2025-02-12T14:00:00Z',
  },
];

export const DUMMY_MESSAGES: Message[] = [
  // Room 1: 김고객 ↔ 명가점술원 (박무속)
  {
    id: 'msg-1',
    roomId: 'room-1',
    senderId: '1',
    content: '안녕하세요, 사주 상담 문의드립니다.',
    type: 'text',
    isRead: true,
    createdAt: '2025-02-10T09:00:00Z',
  },
  {
    id: 'msg-2',
    roomId: 'room-1',
    senderId: '2',
    content: '안녕하세요! 명가점술원입니다. 어떤 상담을 원하시나요?',
    type: 'text',
    isRead: true,
    createdAt: '2025-02-10T09:05:00Z',
  },
  {
    id: 'msg-3',
    roomId: 'room-1',
    senderId: '1',
    content: '2025년 신년 운세를 보고 싶은데, 예약 가능한 날짜가 있을까요?',
    type: 'text',
    isRead: true,
    createdAt: '2025-02-10T09:10:00Z',
  },
  {
    id: 'msg-4',
    roomId: 'room-1',
    senderId: '2',
    content: '네, 다음 주에 화요일과 목요일 오전에 자리가 있습니다. 사주 상담은 약 1시간 정도 소요됩니다.',
    type: 'text',
    isRead: true,
    createdAt: '2025-02-10T09:15:00Z',
  },
  {
    id: 'msg-5',
    roomId: 'room-1',
    senderId: '1',
    content: '화요일 10시에 예약하고 싶습니다!',
    type: 'text',
    isRead: true,
    createdAt: '2025-02-14T15:20:00Z',
  },
  {
    id: 'msg-6',
    roomId: 'room-1',
    senderId: '2',
    content: '네, 다음 주 화요일 10시에 뵙겠습니다.',
    type: 'text',
    isRead: false,
    createdAt: '2025-02-14T15:30:00Z',
  },

  // Room 2: 김고객 ↔ 별빛타로
  {
    id: 'msg-7',
    roomId: 'room-2',
    senderId: '1',
    content: '타로 상담은 어떻게 진행되나요?',
    type: 'text',
    isRead: true,
    createdAt: '2025-02-12T14:00:00Z',
  },
  {
    id: 'msg-8',
    roomId: 'room-2',
    senderId: 'user-shaman-3',
    content: '안녕하세요! 별빛타로입니다. 연애, 결혼, 진로 등 궁금하신 분야에 대해 타로 카드로 상담해드립니다.',
    type: 'text',
    isRead: true,
    createdAt: '2025-02-12T14:10:00Z',
  },
  {
    id: 'msg-9',
    roomId: 'room-2',
    senderId: '1',
    content: '연애운을 보고 싶어요. 소요 시간이 어느 정도 되나요?',
    type: 'text',
    isRead: true,
    createdAt: '2025-02-13T10:00:00Z',
  },
  {
    id: 'msg-10',
    roomId: 'room-2',
    senderId: 'user-shaman-3',
    content: '타로 상담은 보통 40분 정도 소요됩니다.',
    type: 'text',
    isRead: true,
    createdAt: '2025-02-13T11:20:00Z',
  },
];

// 런타임 변경을 위한 mutable 배열
let chatRooms = [...DUMMY_CHAT_ROOMS];
let messages = [...DUMMY_MESSAGES];

export function findRoomById(roomId: string): ChatRoom | undefined {
  return chatRooms.find((r) => r.id === roomId);
}

export function getRoomsByUserId(userId: string): ChatRoom[] {
  return chatRooms
    .filter((r) => r.participants.includes(userId))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export function findExistingRoom(customerId: string, shamanId: string): ChatRoom | undefined {
  return chatRooms.find((r) => r.customerId === customerId && r.shamanId === shamanId);
}

export function createRoom(customerId: string, shamanId: string, shamanUserId: string): ChatRoom {
  const existing = findExistingRoom(customerId, shamanId);
  if (existing) return existing;

  const newRoom: ChatRoom = {
    id: `room-${Date.now()}`,
    customerId,
    shamanId,
    participants: [customerId, shamanUserId],
    lastMessage: '',
    lastMessageAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  chatRooms.push(newRoom);
  return newRoom;
}

export function getMessagesByRoomId(roomId: string): Message[] {
  return messages
    .filter((m) => m.roomId === roomId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addMessage(roomId: string, senderId: string, content: string): Message {
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    roomId,
    senderId,
    content,
    type: 'text',
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  messages.push(newMessage);

  // 채팅방의 lastMessage 업데이트
  const roomIndex = chatRooms.findIndex((r) => r.id === roomId);
  if (roomIndex !== -1) {
    chatRooms[roomIndex] = {
      ...chatRooms[roomIndex],
      lastMessage: content,
      lastMessageAt: newMessage.createdAt,
    };
  }

  return newMessage;
}

export function markMessagesAsRead(roomId: string, userId: string): void {
  messages = messages.map((m) => {
    if (m.roomId === roomId && m.senderId !== userId && !m.isRead) {
      return { ...m, isRead: true };
    }
    return m;
  });
}

export function getUnreadCount(userId: string): number {
  const userRooms = getRoomsByUserId(userId);
  const roomIds = userRooms.map((r) => r.id);
  return messages.filter(
    (m) => roomIds.includes(m.roomId) && m.senderId !== userId && !m.isRead
  ).length;
}

export function getUnreadCountByRoom(roomId: string, userId: string): number {
  return messages.filter(
    (m) => m.roomId === roomId && m.senderId !== userId && !m.isRead
  ).length;
}
