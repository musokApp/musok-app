'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getChatRooms } from '@/services/chat.service';
import { ChatRoomWithParticipant } from '@/types/chat.types';
import ChatRoomCard from '@/components/chat/ChatRoomCard';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { MyPageLayout } from '@/components/layout/MyPageLayout';

export default function ChatListPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [rooms, setRooms] = useState<ChatRoomWithParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchRooms();
    }
  }, [isAuthenticated, authLoading]);

  // 10초마다 채팅방 목록 갱신
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchRooms = async () => {
    try {
      const data = await getChatRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyPageLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">채팅</h1>
      <p className="text-sm text-gray-500 mb-6">무속인과 대화하세요</p>

      {/* Room List */}
      {loading ? (
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                  <div className="h-3 w-10 bg-gray-100 rounded" />
                </div>
                <div className="h-3 w-48 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 px-4">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">채팅 내역이 없습니다</h2>
          <p className="text-sm text-gray-500 mb-6">
            무속인에게 문의하면 채팅이 시작됩니다
          </p>
          <Link
            href="/shamans"
            className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            무속인 찾기
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {rooms.map((room) => (
            <ChatRoomCard key={room.id} room={room} basePath="/chat" />
          ))}
        </div>
      )}
    </MyPageLayout>
  );
}
