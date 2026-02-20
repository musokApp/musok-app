'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  getCalendarData,
  getDayBookings,
  getShamanBookings,
  createManualBooking,
  updateBookingStatus,
} from '@/services/booking.service';
import {
  BookingWithCustomer,
  BookingStatus,
  CalendarDayData,
  DashboardSummary,
  CreateManualBookingData,
  TimeSlot,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
} from '@/types/booking.types';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar';
import DayBookingList from '@/components/dashboard/DayBookingList';
import ManualBookingModal from '@/components/dashboard/ManualBookingModal';
import ShamanBookingCard from '@/components/booking/ShamanBookingCard';
import { MyPageLayout } from '@/components/layout/MyPageLayout';
import { CalendarDays, List, Calendar, Clock, CheckCircle, Plus } from 'lucide-react';

type ViewMode = 'calendar' | 'list';

const STATUS_TABS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기' },
  { value: 'confirmed', label: '확정' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소/거절' },
];

export default function ShamanBookingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  // ===== Calendar View State =====
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [dayData, setDayData] = useState<CalendarDayData[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    todayBookings: 0, pendingTotal: 0, thisWeekBookings: 0, thisMonthRevenue: 0,
  });

  // Day detail
  const [dayBookings, setDayBookings] = useState<BookingWithCustomer[]>([]);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [dayLoading, setDayLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Manual booking modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTimeSlot, setModalTimeSlot] = useState<TimeSlot>('09:00');

  // ===== List View State =====
  const [listBookings, setListBookings] = useState<BookingWithCustomer[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<BookingStatus | 'all'>('all');

  // ===== Calendar Fetchers =====
  const fetchCalendar = useCallback(async () => {
    setCalendarLoading(true);
    try {
      const data = await getCalendarData(year, month);
      setDayData(data.days);
      setSummary(data.summary);
    } catch { /* silent */ } finally {
      setCalendarLoading(false);
    }
  }, [year, month]);

  const fetchDay = useCallback(async (date: string) => {
    setDayLoading(true);
    try {
      const data = await getDayBookings(date);
      setDayBookings(data.bookings);
      setAvailableSlots(data.availableSlots);
    } catch { /* silent */ } finally {
      setDayLoading(false);
    }
  }, []);

  // ===== List Fetcher =====
  const fetchListBookings = useCallback(async (status?: BookingStatus) => {
    setListLoading(true);
    try {
      const data = await getShamanBookings(status);
      setListBookings(data);
    } catch { /* silent */ } finally {
      setListLoading(false);
    }
  }, []);

  // ===== Effects =====
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    if (viewMode === 'calendar') {
      fetchCalendar();
    } else {
      fetchListBookings(activeStatus === 'all' || activeStatus === 'cancelled' ? undefined : activeStatus);
    }
  }, [isAuthenticated, authLoading, viewMode, fetchCalendar, fetchListBookings, activeStatus]);

  useEffect(() => {
    if (selectedDate && viewMode === 'calendar') {
      fetchDay(selectedDate);
    }
  }, [selectedDate, viewMode, fetchDay]);

  // ===== Calendar Handlers =====
  const handleMonthChange = (y: number, m: number) => {
    setYear(y);
    setMonth(m);
    setSelectedDate(null);
    setDayBookings([]);
  };

  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    setUpdatingId(bookingId);
    try {
      await updateBookingStatus(bookingId, { status });
      await Promise.all([fetchCalendar(), selectedDate ? fetchDay(selectedDate) : Promise.resolve()]);
    } catch { /* silent */ } finally {
      setUpdatingId(null);
    }
  };

  const handleAddManual = (timeSlot: TimeSlot) => {
    setModalTimeSlot(timeSlot);
    setModalOpen(true);
  };

  const handleManualSubmit = async (data: CreateManualBookingData) => {
    await createManualBooking(data);
    await Promise.all([fetchCalendar(), selectedDate ? fetchDay(selectedDate) : Promise.resolve()]);
  };

  // ===== List Handlers =====
  const handleStatusFilter = (status: BookingStatus | 'all') => {
    setActiveStatus(status);
  };

  const handleListApprove = async (bookingId: string) => {
    if (!confirm('이 예약을 승인하시겠습니까?')) return;
    try {
      await updateBookingStatus(bookingId, { status: 'confirmed' });
      fetchListBookings(activeStatus === 'all' || activeStatus === 'cancelled' ? undefined : activeStatus);
    } catch (error: any) {
      alert(error.message || '예약 승인에 실패했습니다');
    }
  };

  const handleListReject = async (bookingId: string) => {
    const reason = prompt('거절 사유를 입력해주세요:');
    if (reason === null) return;
    try {
      await updateBookingStatus(bookingId, { status: 'rejected', rejectionReason: reason });
      fetchListBookings(activeStatus === 'all' || activeStatus === 'cancelled' ? undefined : activeStatus);
    } catch (error: any) {
      alert(error.message || '예약 거절에 실패했습니다');
    }
  };

  const handleListComplete = async (bookingId: string) => {
    if (!confirm('상담 완료 처리하시겠습니까?')) return;
    try {
      await updateBookingStatus(bookingId, { status: 'completed' });
      fetchListBookings(activeStatus === 'all' || activeStatus === 'cancelled' ? undefined : activeStatus);
    } catch (error: any) {
      alert(error.message || '완료 처리에 실패했습니다');
    }
  };

  const filteredListBookings =
    activeStatus === 'cancelled'
      ? listBookings.filter((b) => b.status === 'cancelled' || b.status === 'rejected')
      : listBookings;

  const pendingCount = listBookings.filter((b) => b.status === 'pending').length;

  return (
    <MyPageLayout>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">예약 관리</h1>
          <p className="text-sm text-gray-500">고객 예약을 확인하고 관리하세요</p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">캘린더</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">목록</span>
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <>
          {/* Mini Stats */}
          <div className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">대기 {summary.pendingTotal}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl flex-shrink-0">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-indigo-700">오늘 {summary.todayBookings}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">이번 주 {summary.thisWeekBookings}</span>
            </div>
          </div>

          <DashboardCalendar
            year={year}
            month={month}
            onMonthChange={handleMonthChange}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            dayData={dayData}
          />

          {selectedDate && (
            dayLoading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <DayBookingList
                date={selectedDate}
                bookings={dayBookings}
                availableSlots={availableSlots}
                onStatusChange={handleStatusChange}
                onAddManual={handleAddManual}
                updatingId={updatingId}
              />
            )
          )}

          {selectedDate && (
            <ManualBookingModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              date={selectedDate}
              timeSlot={modalTimeSlot}
              onSubmit={handleManualSubmit}
            />
          )}
        </>
      ) : (
        <>
          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleStatusFilter(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeStatus === tab.value
                    ? 'bg-indigo-500 text-white'
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
          {listLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse">
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
                </div>
              ))}
            </div>
          ) : filteredListBookings.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">예약이 없습니다</h2>
              <p className="text-sm text-gray-500">아직 들어온 예약이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredListBookings.map((booking) => (
                <ShamanBookingCard
                  key={booking.id}
                  booking={booking}
                  onApprove={handleListApprove}
                  onReject={handleListReject}
                  onComplete={handleListComplete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </MyPageLayout>
  );
}
