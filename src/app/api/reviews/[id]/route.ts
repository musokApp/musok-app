import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { findReviewById, updateReview, deleteReview } from '@/lib/data/reviews-data';
import { containsProfanity } from '@/lib/utils/profanity-filter';

// 리뷰 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const { id } = await params;
  const review = await findReviewById(id);

  if (!review) {
    return NextResponse.json({ error: '리뷰를 찾을 수 없습니다' }, { status: 404 });
  }

  if (review.customerId !== user.userId) {
    return NextResponse.json({ error: '본인의 리뷰만 수정할 수 있습니다' }, { status: 403 });
  }

  const body = await request.json();
  const { rating, content } = body;

  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return NextResponse.json({ error: '평점은 1~5 사이여야 합니다' }, { status: 400 });
  }

  if (content && containsProfanity(content)) {
    return NextResponse.json({ error: '부적절한 표현이 포함되어 있습니다' }, { status: 400 });
  }

  const updated = await updateReview(id, { rating, content });

  if (!updated) {
    return NextResponse.json({ error: '리뷰 수정에 실패했습니다' }, { status: 500 });
  }

  return NextResponse.json({ review: updated });
}

// 리뷰 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const { id } = await params;
  const review = await findReviewById(id);

  if (!review) {
    return NextResponse.json({ error: '리뷰를 찾을 수 없습니다' }, { status: 404 });
  }

  if (review.customerId !== user.userId) {
    return NextResponse.json({ error: '본인의 리뷰만 삭제할 수 있습니다' }, { status: 403 });
  }

  const deleted = await deleteReview(id);

  if (!deleted) {
    return NextResponse.json({ error: '리뷰 삭제에 실패했습니다' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
