import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { getBookedTimeSlots } from '@/lib/data/bookings-data';
import { ALL_TIME_SLOTS } from '@/types/booking.types';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const shamanId = searchParams.get('shamanId');
  const date = searchParams.get('date');

  if (!shamanId || !date) {
    return NextResponse.json({ error: 'shamanId와 date 파라미터가 필요합니다' }, { status: 400 });
  }

  const bookedSlots = getBookedTimeSlots(shamanId, date);

  const slots = ALL_TIME_SLOTS.map((time) => ({
    time,
    available: !bookedSlots.includes(time),
  }));

  return NextResponse.json({ slots });
}
