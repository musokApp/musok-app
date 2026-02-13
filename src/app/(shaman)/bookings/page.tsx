'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getShamanBookings, updateBookingStatus } from '@/services/booking.service';
import { BookingWithCustomer, BookingStatus } from '@/types/booking.types';
import ShamanBookingCard from '@/components/booking/ShamanBookingCard';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_TABS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기' },
  { value: 'confirmed', label: '확정' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소/거절' },
];

export default function ShamanBookingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<BookingStatus | 'all'>('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, authLoading]);

  const fetchBookings = async (status?: BookingStatus) => {
    try {
      setLoading(true);
      const data = await getShamanBookings(status);
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status: BookingStatus | 'all') => {
    setActiveStatus(status);
    if (status === 'all') {
      fetchBookings();
    } else if (status === 'cancelled') {
      // '취소/거절' 탭은 클라이언트에서 필터
      fetchBookings();
    } else {
      fetchBookings(status);
    }
  };

  const filteredBookings =
    activeStatus === 'cancelled'
      ? bookings.filter((b) => b.status === 'cancelled' || b.status === 'rejected')
      : bookings;

  const handleApprove = async (bookingId: string) => {
    if (!confirm('이 예약을 승인하시겠습니까?')) return;
    try {
      await updateBookingStatus(bookingId, { status: 'confirmed' });
      fetchBookings(activeStatus === 'all' || activeStatus === 'cancelled' ? undefined : activeStatus);
    } catch (error: any) {
      alert(error.message || '예약 승인에 실패했습니다');
    }
  };

  const handleReject = async (bookingId: string) => {
    const reason = prompt('거절 사유를 입력해주세요:');
    if (reason === null) return;
    try {
      await updateBookingStatus(bookingId, { status: 'rejected', rejectionReason: reason });
      fetchBookings(activeStatus === 'all' || activeStatus === 'cancelled' ? undefined : activeStatus);
    } catch (error: any) {
      alert(error.message || '예약 거절에 실패했습니다');
    }
  };

  const handleComplete = async (bookingId: string) => {
    if (!confirm('상담 완료 처리하시겠습니까?')) return;
    try {
      await updateBookingStatus(bookingId, { status: 'completed' });
      fetchBookings(activeStatus === 'all' || activeStatus === 'cancelled' ? undefined : activeStatus);
    } catch (error: any) {
      alert(error.message || '완료 처리에 실패했습니다');
    }
  };

  // Stats
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const totalCount = bookings.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>
        <p className="text-sm text-gray-500 mt-1">고객 예약을 확인하고 관리하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-500">대기 중</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-500">확정</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{confirmedCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500">완료</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">전체</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
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
            {tab.value === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 bg-white/20 rounded-full text-xs">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
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
                <div className="w-10 h-10 bg-gray-100 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                  <div className="h-3 w-32 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-24 bg-gray-50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">예약이 없습니다</h2>
          <p className="text-sm text-gray-500">아직 들어온 예약이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <ShamanBookingCard
              key={booking.id}
              booking={booking}
              onApprove={handleApprove}
              onReject={handleReject}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
