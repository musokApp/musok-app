import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { findShamanByUserId } from '@/lib/data/shamans-data';
import { createManualBooking, getBookedTimeSlots } from '@/lib/data/bookings-data';
import { ALL_TIME_SLOTS, TimeSlot, getOccupiedSlots } from '@/types/booking.types';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user || user.role !== 'shaman') {
    return NextResponse.json({ error: '무속인만 접근 가능합니다' }, { status: 403 });
  }

  const shaman = await findShamanByUserId(user.userId);
  if (!shaman) {
    return NextResponse.json({ error: '무속인 프로필을 찾을 수 없습니다' }, { status: 404 });
  }

  const body = await request.json();
  let { date, timeSlot, consultationType, customerName, customerPhone, notes, totalPrice } = body;
  let duration: number = body.duration ?? 1;

  if (!date || !timeSlot || !consultationType || !customerName) {
    return NextResponse.json({ error: '날짜, 시간대, 상담유형, 고객명은 필수입니다' }, { status: 400 });
  }

  // 종일(0) → 첫 슬롯부터 전체
  if (duration === 0) {
    timeSlot = ALL_TIME_SLOTS[0];
    duration = ALL_TIME_SLOTS.length;
  }

  if (!ALL_TIME_SLOTS.includes(timeSlot as TimeSlot)) {
    return NextResponse.json({ error: '잘못된 시간대입니다' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];
  if (date < today) {
    return NextResponse.json({ error: '과거 날짜는 예약할 수 없습니다' }, { status: 400 });
  }

  const occupiedSlots = getOccupiedSlots(timeSlot as TimeSlot, duration);
  const bookedSlots = await getBookedTimeSlots(shaman.id, date);
  const hasConflict = occupiedSlots.some((s) => bookedSlots.includes(s));
  if (hasConflict) {
    return NextResponse.json({ error: '이미 예약된 시간대가 포함되어 있습니다' }, { status: 409 });
  }

  const booking = await createManualBooking(shaman.id, {
    date,
    timeSlot,
    duration,
    consultationType,
    customerName,
    customerPhone,
    notes,
    totalPrice,
  });

  return NextResponse.json({ booking }, { status: 201 });
}
