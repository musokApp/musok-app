'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getMessages, sendMessage, getChatRooms } from '@/services/chat.service';
import { Message, ChatRoomWithParticipant } from '@/types/chat.types';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import { ChevronLeft, Loader2 } from 'lucide-react';

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const roomId = params.roomId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<ChatRoomWithParticipant | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchRoomInfo();
      fetchMessages();
    }
  }, [isAuthenticated, authLoading, roomId]);

  // 3초 폴링으로 새 메시지 가져오기
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, roomId]);

  const fetchRoomInfo = async () => {
    try {
      const rooms = await getChatRooms();
      const found = rooms.find((r) => r.id === roomId);
      if (found) setRoom(found);
    } catch (error) {
      console.error('Failed to fetch room:', error);
    }
  };

  const fetchMessages = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await getMessages(roomId);
      setMessages(data);
      if (!silent) {
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 새 메시지가 추가되면 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      const container = scrollContainerRef.current;
      if (!container) return;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      if (isNearBottom) {
        setTimeout(scrollToBottom, 50);
      }
    }
  }, [messages.length]);

  const handleSend = async (content: string) => {
    try {
      setSending(true);
      const newMsg = await sendMessage(roomId, content);
      setMessages((prev) => [...prev, newMsg]);
      setTimeout(scrollToBottom, 50);
    } catch (error: any) {
      alert(error.message || '메시지 전송에 실패했습니다');
    } finally {
      setSending(false);
    }
  };

  const displayName = room?.otherUser
    ? room.otherUser.businessName || room.otherUser.fullName
    : '채팅';

  // 날짜 구분선을 위한 그룹핑
  const getDateLabel = (isoStr: string) => {
    const date = new Date(isoStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return '오늘';
    if (date.toDateString() === yesterday.toDateString()) return '어제';
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-2xl mx-auto w-full">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => router.push('/chat')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {room?.otherUser && (
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {room.otherUser.images && room.otherUser.images.length > 0 ? (
                <img
                  src={room.otherUser.images[0]}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                  {displayName[0]}
                </div>
              )}
            </div>
          )}
          <h1 className="text-base font-bold text-gray-900 truncate">{displayName}</h1>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50/30"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400">대화를 시작해보세요</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const showDateSeparator =
                idx === 0 ||
                getDateLabel(msg.createdAt) !==
                  getDateLabel(messages[idx - 1].createdAt);

              return (
                <div key={msg.id}>
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-4">
                      <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                        {getDateLabel(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    isMine={msg.senderId === user?.id}
                  />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <ChatInput onSend={handleSend} disabled={sending} />
      </div>
    </div>
  );
}
