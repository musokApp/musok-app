import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { findShamanByUserId } from '@/lib/data/shamans-data';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user || user.role !== 'shaman') {
    return NextResponse.json({ error: '무속인 계정만 접근할 수 있습니다' }, { status: 403 });
  }

  const shaman = findShamanByUserId(user.userId);

  if (!shaman) {
    return NextResponse.json({ shaman: null });
  }

  return NextResponse.json({ shaman });
}
