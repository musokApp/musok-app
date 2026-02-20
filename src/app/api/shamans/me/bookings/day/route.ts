import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { findShamanByUserId } from '@/lib/data/shamans-data';
import { getDayBookingsWithCustomer } from '@/lib/data/bookings-data';
import { getAvailableSlotsForDate } from '@/lib/data/schedule-data';

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'date 파라미터가 필요합니다' }, { status: 400 });
  }

  const [bookings, availableSlots] = await Promise.all([
    getDayBookingsWithCustomer(shaman.id, date),
    getAvailableSlotsForDate(shaman.id, date),
  ]);

  return NextResponse.json({ bookings, availableSlots });
}
