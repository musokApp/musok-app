import { createClient } from '@/lib/supabase/server';
import { mapReviewRow } from '@/lib/supabase/mappers';
import { Review, ReviewWithCustomer } from '@/types/review.types';

export async function createReview(data: {
  bookingId: string;
  customerId: string;
  shamanId: string;
  rating: number;
  content: string;
}): Promise<Review> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from('reviews')
    .insert({
      booking_id: data.bookingId,
      customer_id: data.customerId,
      shaman_id: data.shamanId,
      rating: data.rating,
      content: data.content,
    })
    .select()
    .single();

  if (error || !row) throw error || new Error('리뷰 생성 실패');

  // 무속인 평균 평점 재계산
  await recalculateAverageRating(data.shamanId);

  return mapReviewRow(row);
}

export async function getReviewsByShamanId(shamanId: string): Promise<ReviewWithCustomer[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('shaman_id', shamanId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  // 고객 정보를 별도로 조회
  const customerIds = [...new Set(data.map((r) => r.customer_id))];
  const { data: users } = await supabase
    .from('users')
    .select('id, full_name, avatar_url')
    .in('id', customerIds);

  const userMap = new Map(
    (users || []).map((u) => [u.id, u])
  );

  return data.map((row) => {
    const user = userMap.get(row.customer_id);
    return {
      ...mapReviewRow(row),
      customer: {
        id: user?.id || row.customer_id,
        fullName: user?.full_name || '알 수 없음',
        avatarUrl: user?.avatar_url || null,
      },
    };
  });
}

export async function getReviewByBookingId(bookingId: string): Promise<Review | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error || !data) return null;
  return mapReviewRow(data);
}

export async function findReviewById(id: string): Promise<Review | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapReviewRow(data);
}

export async function updateReview(
  id: string,
  data: { rating?: number; content?: string }
): Promise<Review | null> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from('reviews')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error || !row) return null;

  // 평점이 변경된 경우 재계산
  if (data.rating !== undefined) {
    await recalculateAverageRating(row.shaman_id);
  }

  return mapReviewRow(row);
}

export async function deleteReview(id: string): Promise<boolean> {
  const supabase = createClient();

  // 삭제 전 shaman_id 조회
  const review = await findReviewById(id);
  if (!review) return false;

  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return false;

  await recalculateAverageRating(review.shamanId);
  return true;
}

async function recalculateAverageRating(shamanId: string): Promise<void> {
  const supabase = createClient();
  const { data } = await supabase
    .from('reviews')
    .select('rating')
    .eq('shaman_id', shamanId);

  const reviews = data || [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  await supabase
    .from('shamans')
    .update({ average_rating: Math.round(avgRating * 10) / 10 })
    .eq('id', shamanId);
}
