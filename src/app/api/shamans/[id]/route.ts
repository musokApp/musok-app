import { NextRequest, NextResponse } from 'next/server';
import { findShamanById } from '@/lib/data/shamans-data';
import { findUserById } from '@/lib/auth/users-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shaman = await findShamanById(id);

  if (!shaman) {
    return NextResponse.json({ error: '무속인을 찾을 수 없습니다' }, { status: 404 });
  }

  // 무속인의 사용자 정보 포함
  const userRow = await findUserById(shaman.userId);

  return NextResponse.json({
    shaman: {
      ...shaman,
      user: userRow
        ? {
            id: userRow.id,
            email: userRow.email,
            fullName: userRow.full_name,
            phone: userRow.phone,
            avatarUrl: userRow.avatar_url,
          }
        : null,
    },
  });
}
