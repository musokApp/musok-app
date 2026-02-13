import { NextRequest, NextResponse } from 'next/server';

// 더미 회원가입 (실제 DB 없이 시뮬레이션)
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

    // 더미 응답 (실제로는 DB에 저장하고 토큰 발급)
    return NextResponse.json({
      message: '회원가입이 완료되었습니다. 로그인해주세요.',
      user: {
        id: 'temp-' + Date.now(),
        email,
        fullName,
        role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
