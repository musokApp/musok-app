import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { findUserById, getUserWithoutPassword } from '@/lib/auth/users-data';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다' },
        { status: 401 }
      );
    }

    const user = findUserById(currentUser.userId);
    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: getUserWithoutPassword(user),
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: '사용자 정보를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
