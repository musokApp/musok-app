import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { getPendingShamans } from '@/lib/data/shamans-data';
import { DUMMY_USERS } from '@/lib/auth/users-data';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: '관리자만 접근할 수 있습니다' }, { status: 403 });
  }

  const pendingShamans = getPendingShamans();

  // 사용자 정보와 함께 반환
  const shamansWithUser = pendingShamans.map((shaman) => {
    const user = DUMMY_USERS.find((u) => u.id === shaman.userId);
    return {
      ...shaman,
      user: user
        ? {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
          }
        : null,
    };
  });

  return NextResponse.json({ shamans: shamansWithUser });
}
