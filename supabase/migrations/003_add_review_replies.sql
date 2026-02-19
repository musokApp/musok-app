-- 리뷰 답글 컬럼 추가
-- ==========================================
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_content TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_created_at TIMESTAMPTZ;
