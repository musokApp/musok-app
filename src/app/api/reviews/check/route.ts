import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 예약 ID 목록에 대해 리뷰 존재 여부 확인
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookingIdsParam = searchParams.get('bookingIds');

  if (!bookingIdsParam) {
    return NextResponse.json({ reviewedBookingIds: [] });
  }

  const bookingIds = bookingIdsParam.split(',').filter(Boolean);

  const supabase = createClient();
  const { data } = await supabase
    .from('reviews')
    .select('booking_id')
    .in('booking_id', bookingIds);

  const reviewedBookingIds = (data || []).map((r) => r.booking_id);
  return NextResponse.json({ reviewedBookingIds });
}
