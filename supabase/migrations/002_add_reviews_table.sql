-- 리뷰/후기 테이블 추가
-- ==========================================

-- =====================
-- REVIEWS TABLE
-- =====================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shaman_id UUID NOT NULL REFERENCES shamans(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 예약 당 리뷰 1개만 허용
CREATE UNIQUE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_reviews_shaman ON reviews(shaman_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);

-- updated_at 트리거
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON reviews FOR ALL USING (true) WITH CHECK (true);
