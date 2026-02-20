-- 예약 인원수 컬럼 추가 (1명당 1시간, 기본 1명)
ALTER TABLE bookings ADD COLUMN party_size INTEGER NOT NULL DEFAULT 1;
