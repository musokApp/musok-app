import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { findBookingById } from '@/lib/data/bookings-data';
import {
  createReview,
  getReviewsByShamanId,
  getReviewByBookingId,
} from '@/lib/data/reviews-data';
import { containsProfanity } from '@/lib/utils/profanity-filter';

// 리뷰 작성
export async function POST(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user || user.role !== 'customer') {
    return NextResponse.json({ error: '고객만 리뷰를 작성할 수 있습니다' }, { status: 403 });
  }

  const body = await request.json();
  const { bookingId, shamanId, rating, content } = body;

  if (!bookingId || !shamanId || !rating) {
    return NextResponse.json({ error: '필수 항목을 입력해주세요' }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: '평점은 1~5 사이여야 합니다' }, { status: 400 });
  }

  // 예약 확인
  const booking = await findBookingById(bookingId);
  if (!booking) {
    return NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 });
  }

  if (booking.customerId !== user.userId) {
    return NextResponse.json({ error: '본인의 예약에만 리뷰를 작성할 수 있습니다' }, { status: 403 });
  }

  if (booking.status !== 'completed') {
    return NextResponse.json({ error: '완료된 예약에만 리뷰를 작성할 수 있습니다' }, { status: 400 });
  }

  // 욕설 필터링
  if (content && containsProfanity(content)) {
    return NextResponse.json({ error: '부적절한 표현이 포함되어 있습니다' }, { status: 400 });
  }

  // 중복 리뷰 방지
  const existingReview = await getReviewByBookingId(bookingId);
  if (existingReview) {
    return NextResponse.json({ error: '이미 리뷰를 작성했습니다' }, { status: 409 });
  }

  const review = await createReview({
    bookingId,
    customerId: user.userId,
    shamanId,
    rating,
    content: content || '',
  });

  return NextResponse.json({ review }, { status: 201 });
}

// 무속인별 리뷰 조회
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shamanId = searchParams.get('shamanId');

  if (!shamanId) {
    return NextResponse.json({ error: 'shamanId가 필요합니다' }, { status: 400 });
  }

  const reviews = await getReviewsByShamanId(shamanId);
  return NextResponse.json({ reviews, total: reviews.length });
}
