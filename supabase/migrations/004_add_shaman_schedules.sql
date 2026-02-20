-- 무속인 주간 근무 시간
-- ==========================================
CREATE TABLE IF NOT EXISTS shaman_weekly_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shaman_id UUID NOT NULL REFERENCES shamans(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_working BOOLEAN NOT NULL DEFAULT true,
  time_slots TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shaman_id, day_of_week)
);

-- 무속인 휴무일
-- ==========================================
CREATE TABLE IF NOT EXISTS shaman_off_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shaman_id UUID NOT NULL REFERENCES shamans(id) ON DELETE CASCADE,
  off_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shaman_id, off_date)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_weekly_hours_shaman ON shaman_weekly_hours(shaman_id);
CREATE INDEX IF NOT EXISTS idx_off_days_shaman_date ON shaman_off_days(shaman_id, off_date);
