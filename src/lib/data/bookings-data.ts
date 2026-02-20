import { createClient } from '@/lib/supabase/server';
import { mapBookingRow } from '@/lib/supabase/mappers';
import {
  Booking,
  BookingFilters,
  BookingStatus,
  BookingWithCustomer,
  CalendarDayData,
  CreateManualBookingData,
  DashboardSummary,
  ALL_TIME_SLOTS,
  TimeSlot,
} from '@/types/booking.types';
import { findUserById } from '@/lib/auth/users-data';

export async function findBookingById(id: string): Promise<Booking | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return mapBookingRow(data);
}

export async function getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapBookingRow);
}

export async function getBookingsByShamanId(shamanId: string): Promise<Booking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('shaman_id', shamanId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapBookingRow);
}

export async function getFilteredBookings(filters: BookingFilters): Promise<Booking[]> {
  const supabase = createClient();
  let query = supabase.from('bookings').select('*');

  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.shamanId) {
    query = query.eq('shaman_id', filters.shamanId);
  }
  if (filters.customerId) {
    query = query.eq('customer_id', filters.customerId);
  }
  if (filters.dateFrom) {
    query = query.gte('date', filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte('date', filters.dateTo);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapBookingRow);
}

export async function createBooking(
  data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Booking> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: data.customerId,
      shaman_id: data.shamanId,
      date: data.date,
      time_slot: data.timeSlot,
      duration: data.duration || 1,
      party_size: data.partySize || 1,
      consultation_type: data.consultationType,
      notes: data.notes,
      total_price: data.totalPrice,
      status: data.status,
      source: 'online',
    })
    .select()
    .single();

  if (error || !row) throw error || new Error('예약 생성 실패');
  return mapBookingRow(row);
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  rejectionReason?: string
): Promise<Booking | null> {
  const supabase = createClient();
  const updateData: Record<string, unknown> = { status };
  if (rejectionReason) {
    updateData.rejection_reason = rejectionReason;
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return mapBookingRow(data);
}

export async function getBookedTimeSlots(shamanId: string, date: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('time_slot, duration')
    .eq('shaman_id', shamanId)
    .eq('date', date)
    .in('status', ['pending', 'confirmed']);

  if (error || !data) return [];

  const bookedSlots: string[] = [];
  for (const row of data) {
    const startIdx = ALL_TIME_SLOTS.indexOf(row.time_slot as TimeSlot);
    if (startIdx === -1) continue;
    const dur = row.duration || 1;
    for (let i = 0; i < dur && startIdx + i < ALL_TIME_SLOTS.length; i++) {
      bookedSlots.push(ALL_TIME_SLOTS[startIdx + i]);
    }
  }
  return bookedSlots;
}

// ===== 캘린더 대시보드용 함수 =====

export async function getMonthlyCalendarData(
  shamanId: string,
  year: number,
  month: number
): Promise<CalendarDayData[]> {
  const supabase = createClient();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('bookings')
    .select('date, status')
    .eq('shaman_id', shamanId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error || !data) return [];

  const dateMap = new Map<string, CalendarDayData>();
  for (const row of data) {
    const existing = dateMap.get(row.date) || {
      date: row.date,
      totalCount: 0,
      pendingCount: 0,
      confirmedCount: 0,
      completedCount: 0,
      cancelledCount: 0,
      isOffDay: false,
    };
    existing.totalCount++;
    if (row.status === 'pending') existing.pendingCount++;
    else if (row.status === 'confirmed') existing.confirmedCount++;
    else if (row.status === 'completed') existing.completedCount++;
    else existing.cancelledCount++;
    dateMap.set(row.date, existing);
  }
  return Array.from(dateMap.values());
}

export async function getDayBookingsWithCustomer(
  shamanId: string,
  date: string
): Promise<BookingWithCustomer[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('shaman_id', shamanId)
    .eq('date', date)
    .order('time_slot', { ascending: true });

  if (error || !data) return [];

  const bookings = data.map(mapBookingRow);
  const results: BookingWithCustomer[] = [];

  for (const booking of bookings) {
    let customer: BookingWithCustomer['customer'] = null;
    if (booking.customerId) {
      const user = await findUserById(booking.customerId);
      if (user) {
        customer = {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
        };
      }
    }
    results.push({ ...booking, customer });
  }
  return results;
}

export async function createManualBooking(
  shamanId: string,
  data: CreateManualBookingData
): Promise<Booking> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: null,
      shaman_id: shamanId,
      date: data.date,
      time_slot: data.timeSlot,
      duration: data.duration || 1,
      consultation_type: data.consultationType,
      notes: data.notes || '',
      total_price: data.totalPrice || 0,
      status: 'confirmed' as const,
      source: 'manual',
      manual_customer_name: data.customerName,
      manual_customer_phone: data.customerPhone || null,
    })
    .select()
    .single();

  if (error || !row) throw error || new Error('수동 예약 생성 실패');
  return mapBookingRow(row);
}

export async function getDashboardStats(shamanId: string): Promise<DashboardSummary> {
  const supabase = createClient();
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const monthLastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(monthLastDay).padStart(2, '0')}`;

  const [todayResult, pendingResult, weekResult, revenueResult] = await Promise.all([
    supabase.from('bookings').select('id', { count: 'exact', head: true })
      .eq('shaman_id', shamanId).eq('date', today).in('status', ['pending', 'confirmed']),
    supabase.from('bookings').select('id', { count: 'exact', head: true })
      .eq('shaman_id', shamanId).eq('status', 'pending'),
    supabase.from('bookings').select('id', { count: 'exact', head: true })
      .eq('shaman_id', shamanId)
      .gte('date', weekStart.toISOString().split('T')[0])
      .lte('date', weekEnd.toISOString().split('T')[0])
      .in('status', ['pending', 'confirmed', 'completed']),
    supabase.from('bookings').select('total_price')
      .eq('shaman_id', shamanId).eq('status', 'completed')
      .gte('date', monthStart).lte('date', monthEnd),
  ]);

  const revenue = (revenueResult.data || []).reduce((sum, r) => sum + r.total_price, 0);

  return {
    todayBookings: todayResult.count || 0,
    pendingTotal: pendingResult.count || 0,
    thisWeekBookings: weekResult.count || 0,
    thisMonthRevenue: revenue,
  };
}
