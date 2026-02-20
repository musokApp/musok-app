'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MyPageLayout } from '@/components/layout/MyPageLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar';
import DayBookingList from '@/components/dashboard/DayBookingList';
import ManualBookingModal from '@/components/dashboard/ManualBookingModal';
import {
  getCalendarData,
  getDayBookings,
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
} from '@/types/booking.types';

export default function ShamanDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Calendar state
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [dayData, setDayData] = useState<CalendarDayData[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    todayBookings: 0,
    pendingTotal: 0,
    thisWeekBookings: 0,
    thisMonthRevenue: 0,
  });

  // Day detail state
  const [dayBookings, setDayBookings] = useState<BookingWithCustomer[]>([]);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [dayLoading, setDayLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Manual booking modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTimeSlot, setModalTimeSlot] = useState<TimeSlot>('09:00');

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'shaman')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Fetch calendar data
  const fetchCalendar = useCallback(async () => {
    setCalendarLoading(true);
    try {
      const data = await getCalendarData(year, month);
      setDayData(data.days);
      setSummary(data.summary);
    } catch {
      // silent
    } finally {
      setCalendarLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    if (user?.role === 'shaman') {
      fetchCalendar();
    }
  }, [user, fetchCalendar]);

  // Fetch day bookings
  const fetchDay = useCallback(async (date: string) => {
    setDayLoading(true);
    try {
      const data = await getDayBookings(date);
      setDayBookings(data.bookings);
      setAvailableSlots(data.availableSlots);
    } catch {
      // silent
    } finally {
      setDayLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchDay(selectedDate);
    }
  }, [selectedDate, fetchDay]);

  // Handlers
  const handleMonthChange = (y: number, m: number) => {
    setYear(y);
    setMonth(m);
    setSelectedDate(null);
    setDayBookings([]);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    setUpdatingId(bookingId);
    try {
      await updateBookingStatus(bookingId, { status });
      await Promise.all([fetchCalendar(), selectedDate ? fetchDay(selectedDate) : Promise.resolve()]);
    } catch {
      // silent
    } finally {
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

  if (authLoading || !user) return null;

  return (
    <MyPageLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">대시보드</h1>
      <p className="text-sm text-gray-500 mb-5">예약 현황을 한눈에 확인하세요</p>

      <DashboardStats summary={summary} loading={calendarLoading} />

      <DashboardCalendar
        year={year}
        month={month}
        onMonthChange={handleMonthChange}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
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
    </MyPageLayout>
  );
}
