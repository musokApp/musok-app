-- 예약 소요 시간(슬롯 수) 지원
-- duration=1: 1시간(기본), duration=2: 2시간, ..., duration=8: 종일
ALTER TABLE bookings ADD COLUMN duration INTEGER NOT NULL DEFAULT 1;
