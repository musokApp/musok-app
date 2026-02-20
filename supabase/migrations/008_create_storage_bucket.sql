-- Supabase Storage 버킷 생성 (shaman-images)
-- 이 SQL은 Supabase Dashboard > SQL Editor에서 실행하세요

INSERT INTO storage.buckets (id, name, public)
VALUES ('shaman-images', 'shaman-images', true)
ON CONFLICT (id) DO NOTHING;

-- 누구나 이미지 조회 가능
CREATE POLICY "Public read shaman images" ON storage.objects
  FOR SELECT USING (bucket_id = 'shaman-images');
