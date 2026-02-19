import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser, getUserWithoutPassword } from '@/lib/auth/users-data';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role } = await request.json();

    // 입력 검증
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요' },
        { status: 400 }
      );
    }

    if (!['customer', 'shaman'].includes(role)) {
      return NextResponse.json(
        { error: '올바른 역할을 선택해주세요' },
        { status: 400 }
      );
    }

    // 이메일 중복 검사
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다' },
        { status: 409 }
      );
    }

    // 실제 DB에 사용자 생성
    const profile = await createUser({ email, password, fullName, role });

    return NextResponse.json({
      message: '회원가입이 완료되었습니다. 로그인해주세요.',
      user: getUserWithoutPassword(profile),
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
