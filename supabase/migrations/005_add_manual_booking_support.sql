-- 수동(전화) 예약 지원을 위한 bookings 테이블 확장
-- bookings 테이블에 수동 예약 지원 컬럼 추가
ALTER TABLE bookings ADD COLUMN source TEXT NOT NULL DEFAULT 'online';
ALTER TABLE bookings ADD COLUMN manual_customer_name TEXT;
ALTER TABLE bookings ADD COLUMN manual_customer_phone TEXT;

-- customer_id nullable로 변경 (수동 예약은 고객 계정 없음)
ALTER TABLE bookings ALTER COLUMN customer_id DROP NOT NULL;

-- 데이터 무결성 제약: 온라인→customer_id 필수, 수동→이름 필수
ALTER TABLE bookings ADD CONSTRAINT chk_booking_source CHECK (
  (source = 'online' AND customer_id IS NOT NULL) OR
  (source = 'manual' AND manual_customer_name IS NOT NULL)
);

-- 캘린더 조회 최적화 인덱스
CREATE INDEX idx_bookings_shaman_date ON bookings(shaman_id, date, status);
