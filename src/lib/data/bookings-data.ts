import { createClient } from '@/lib/supabase/server';
import { mapBookingRow } from '@/lib/supabase/mappers';
import { Booking, BookingFilters, BookingStatus } from '@/types/booking.types';

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
      consultation_type: data.consultationType,
      notes: data.notes,
      total_price: data.totalPrice,
      status: data.status,
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
    .select('time_slot')
    .eq('shaman_id', shamanId)
    .eq('date', date)
    .in('status', ['pending', 'confirmed']);

  if (error || !data) return [];
  return data.map((row) => row.time_slot);
}
