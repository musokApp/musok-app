import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { getAvailableSlotsForDate } from '@/lib/data/schedule-data';

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

  const slots = await getAvailableSlotsForDate(shamanId, date);

  return NextResponse.json({ slots });
}
