import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { findShamanByUserId } from '@/lib/data/shamans-data';
import { getMonthlyCalendarData, getDashboardStats } from '@/lib/data/bookings-data';
import { getOffDays } from '@/lib/data/schedule-data';

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
  const year = parseInt(searchParams.get('year') || '', 10);
  const month = parseInt(searchParams.get('month') || '', 10);

  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json({ error: 'year, month 파라미터가 필요합니다' }, { status: 400 });
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const [days, offDays, summary] = await Promise.all([
    getMonthlyCalendarData(shaman.id, year, month),
    getOffDays(shaman.id, startDate, endDate),
    getDashboardStats(shaman.id),
  ]);

  const offDaySet = new Set(offDays.map((d) => d.offDate));
  for (const day of days) {
    day.isOffDay = offDaySet.has(day.date);
  }

  // 예약은 없지만 휴무인 날짜도 추가
  const existingDates = new Set(days.map((d) => d.date));
  for (const offDate of offDaySet) {
    if (!existingDates.has(offDate)) {
      days.push({
        date: offDate,
        totalCount: 0,
        pendingCount: 0,
        confirmedCount: 0,
        completedCount: 0,
        cancelledCount: 0,
        isOffDay: true,
      });
    }
  }

  return NextResponse.json({ days, summary });
}
