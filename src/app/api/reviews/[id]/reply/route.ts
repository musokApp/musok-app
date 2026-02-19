import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { findReviewById } from '@/lib/data/reviews-data';
import { findShamanByUserId } from '@/lib/data/shamans-data';
import { containsProfanity } from '@/lib/utils/profanity-filter';
import { createClient } from '@/lib/supabase/server';
import { mapReviewRow } from '@/lib/supabase/mappers';

// 답글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user || user.role !== 'shaman') {
    return NextResponse.json({ error: '무속인만 답글을 작성할 수 있습니다' }, { status: 403 });
  }

  const { id } = await params;
  const review = await findReviewById(id);

  if (!review) {
    return NextResponse.json({ error: '리뷰를 찾을 수 없습니다' }, { status: 404 });
  }

  // 본인 리뷰에만 답글 가능
  const shaman = await findShamanByUserId(user.userId);
  if (!shaman || shaman.id !== review.shamanId) {
    return NextResponse.json({ error: '본인에게 온 리뷰에만 답글을 달 수 있습니다' }, { status: 403 });
  }

  if (review.replyContent) {
    return NextResponse.json({ error: '이미 답글이 작성되어 있습니다' }, { status: 409 });
  }

  const body = await request.json();
  const { content } = body;

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: '답글 내용을 입력해주세요' }, { status: 400 });
  }

  if (containsProfanity(content)) {
    return NextResponse.json({ error: '부적절한 표현이 포함되어 있습니다' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: row, error } = await supabase
    .from('reviews')
    .update({
      reply_content: content.trim(),
      reply_created_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !row) {
    return NextResponse.json({ error: '답글 작성에 실패했습니다' }, { status: 500 });
  }

  return NextResponse.json({ review: mapReviewRow(row) }, { status: 201 });
}

// 답글 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user || user.role !== 'shaman') {
    return NextResponse.json({ error: '무속인만 답글을 수정할 수 있습니다' }, { status: 403 });
  }

  const { id } = await params;
  const review = await findReviewById(id);

  if (!review) {
    return NextResponse.json({ error: '리뷰를 찾을 수 없습니다' }, { status: 404 });
  }

  const shaman = await findShamanByUserId(user.userId);
  if (!shaman || shaman.id !== review.shamanId) {
    return NextResponse.json({ error: '본인의 답글만 수정할 수 있습니다' }, { status: 403 });
  }

  if (!review.replyContent) {
    return NextResponse.json({ error: '답글이 없습니다' }, { status: 404 });
  }

  const body = await request.json();
  const { content } = body;

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: '답글 내용을 입력해주세요' }, { status: 400 });
  }

  if (containsProfanity(content)) {
    return NextResponse.json({ error: '부적절한 표현이 포함되어 있습니다' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: row, error } = await supabase
    .from('reviews')
    .update({ reply_content: content.trim() })
    .eq('id', id)
    .select()
    .single();

  if (error || !row) {
    return NextResponse.json({ error: '답글 수정에 실패했습니다' }, { status: 500 });
  }

  return NextResponse.json({ review: mapReviewRow(row) });
}

// 답글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user || user.role !== 'shaman') {
    return NextResponse.json({ error: '무속인만 답글을 삭제할 수 있습니다' }, { status: 403 });
  }

  const { id } = await params;
  const review = await findReviewById(id);

  if (!review) {
    return NextResponse.json({ error: '리뷰를 찾을 수 없습니다' }, { status: 404 });
  }

  const shaman = await findShamanByUserId(user.userId);
  if (!shaman || shaman.id !== review.shamanId) {
    return NextResponse.json({ error: '본인의 답글만 삭제할 수 있습니다' }, { status: 403 });
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('reviews')
    .update({ reply_content: null, reply_created_at: null })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: '답글 삭제에 실패했습니다' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
