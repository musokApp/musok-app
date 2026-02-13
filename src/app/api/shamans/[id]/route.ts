import { NextRequest, NextResponse } from 'next/server';
import { findShamanById } from '@/lib/data/shamans-data';
import { DUMMY_USERS } from '@/lib/auth/users-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const shaman = findShamanById(params.id);

  if (!shaman) {
    return NextResponse.json({ error: '무속인을 찾을 수 없습니다' }, { status: 404 });
  }

  // 무속인의 사용자 정보 포함
  const user = DUMMY_USERS.find((u) => u.id === shaman.userId);

  return NextResponse.json({
    shaman: {
      ...shaman,
      user: user
        ? {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
          }
        : null,
    },
  });
}
