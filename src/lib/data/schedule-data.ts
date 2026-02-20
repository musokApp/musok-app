import { createClient } from '@/lib/supabase/server';
import { WeeklyHour, OffDay } from '@/types/schedule.types';
import { TimeSlot, ALL_TIME_SLOTS } from '@/types/booking.types';
import { getBookedTimeSlots } from './bookings-data';

// 주간 근무 시간 조회
export async function getWeeklyHours(shamanId: string): Promise<WeeklyHour[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shaman_weekly_hours')
    .select('*')
    .eq('shaman_id', shamanId)
    .order('day_of_week');

  if (error || !data) return [];

  return data.map((row) => ({
    dayOfWeek: row.day_of_week,
    isWorking: row.is_working,
    timeSlots: row.time_slots as TimeSlot[],
  }));
}

// 주간 근무 시간 일괄 저장 (upsert)
export async function upsertWeeklyHours(
  shamanId: string,
  hours: { dayOfWeek: number; isWorking: boolean; timeSlots: TimeSlot[] }[]
): Promise<boolean> {
  const supabase = createClient();

  const rows = hours.map((h) => ({
    shaman_id: shamanId,
    day_of_week: h.dayOfWeek,
    is_working: h.isWorking,
    time_slots: h.timeSlots,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('shaman_weekly_hours')
    .upsert(rows, { onConflict: 'shaman_id,day_of_week' });

  return !error;
}

// 휴무일 조회
export async function getOffDays(
  shamanId: string,
  fromDate?: string,
  toDate?: string
): Promise<OffDay[]> {
  const supabase = createClient();
  let query = supabase
    .from('shaman_off_days')
    .select('*')
    .eq('shaman_id', shamanId)
    .order('off_date');

  if (fromDate) query = query.gte('off_date', fromDate);
  if (toDate) query = query.lte('off_date', toDate);

  const { data, error } = await query;

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    offDate: row.off_date,
    reason: row.reason,
    createdAt: row.created_at,
  }));
}

// 휴무일 추가
export async function addOffDay(
  shamanId: string,
  offDate: string,
  reason?: string
): Promise<OffDay | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shaman_off_days')
    .insert({
      shaman_id: shamanId,
      off_date: offDate,
      reason: reason || null,
    })
    .select()
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    offDate: data.off_date,
    reason: data.reason,
    createdAt: data.created_at,
  };
}

// 휴무일 삭제
export async function deleteOffDay(id: string, shamanId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('shaman_off_days')
    .delete()
    .eq('id', id)
    .eq('shaman_id', shamanId);

  return !error;
}

// 특정 날짜의 예약 가능 시간대 계산
// (주간 스케줄 + 휴무일 + 기존 예약 반영)
export async function getAvailableSlotsForDate(
  shamanId: string,
  date: string
): Promise<{ time: TimeSlot; available: boolean }[]> {
  // 1. 휴무일 체크
  const supabase = createClient();
  const { data: offDay } = await supabase
    .from('shaman_off_days')
    .select('id')
    .eq('shaman_id', shamanId)
    .eq('off_date', date)
    .maybeSingle();

  if (offDay) {
    // 휴무일이면 전부 불가
    return ALL_TIME_SLOTS.map((time) => ({ time, available: false }));
  }

  // 2. 요일 계산 (JS: 0=일, 1=월, ..., 6=토)
  const dayOfWeek = new Date(date + 'T00:00:00').getDay();

  // 3. 주간 스케줄 조회
  const { data: weeklyRow } = await supabase
    .from('shaman_weekly_hours')
    .select('*')
    .eq('shaman_id', shamanId)
    .eq('day_of_week', dayOfWeek)
    .maybeSingle();

  // 스케줄 미설정 시 기본 전체 슬롯 사용
  let workingSlots: TimeSlot[];
  if (!weeklyRow) {
    workingSlots = [...ALL_TIME_SLOTS];
  } else if (!weeklyRow.is_working) {
    return ALL_TIME_SLOTS.map((time) => ({ time, available: false }));
  } else {
    workingSlots = weeklyRow.time_slots as TimeSlot[];
  }

  // 4. 예약된 슬롯
  const bookedSlots = await getBookedTimeSlots(shamanId, date);

  // 5. 결과 조합
  return ALL_TIME_SLOTS.map((time) => ({
    time,
    available: workingSlots.includes(time) && !bookedSlots.includes(time),
  }));
}
