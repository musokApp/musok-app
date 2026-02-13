'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getMyBookings, updateBookingStatus } from '@/services/booking.service';
import { BookingWithShaman, BookingStatus, BOOKING_STATUS_LABELS } from '@/types/booking.types';
import BookingCard from '@/components/booking/BookingCard';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

const STATUS_TABS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '요청됨' },
  { value: 'confirmed', label: '확정' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
  { value: 'rejected', label: '거절' },
];

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingWithShaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<BookingStatus | 'all'>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, authLoading]);

  const fetchBookings = async (status?: BookingStatus) => {
    try {
      setLoading(true);
      const data = await getMyBookings(status);
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status: BookingStatus | 'all') => {
    setActiveStatus(status);
    fetchBookings(status === 'all' ? undefined : status);
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('예약을 취소하시겠습니까?')) return;
    try {
      await updateBookingStatus(bookingId, { status: 'cancelled' });
      fetchBookings(activeStatus === 'all' ? undefined : activeStatus);
    } catch (error: any) {
      alert(error.message || '예약 취소에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">내 예약</h1>
          <p className="text-sm text-gray-500 mt-1">예약 현황을 확인하세요</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleStatusFilter(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeStatus === tab.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse"
              >
                <div className="flex justify-between">
                  <div className="h-5 w-16 bg-gray-100 rounded-full" />
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-24 bg-gray-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">예약 내역이 없습니다</h2>
            <p className="text-sm text-gray-500 mb-6">무속인을 검색하고 예약해보세요</p>
            <Link
              href="/shamans"
              className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              무속인 찾기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
