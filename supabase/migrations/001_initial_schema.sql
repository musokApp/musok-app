-- 무속인 예약 플랫폼 - Initial Schema
-- ==========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- ENUM TYPES
-- =====================
CREATE TYPE user_role AS ENUM ('customer', 'shaman', 'admin');
CREATE TYPE shaman_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'rejected');
CREATE TYPE message_type AS ENUM ('text', 'image', 'system');

-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================
-- SHAMANS TABLE
-- =====================
CREATE TABLE shamans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  specialties TEXT[] NOT NULL DEFAULT '{}',
  years_experience INTEGER NOT NULL DEFAULT 0,
  region TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  base_price INTEGER NOT NULL DEFAULT 0,
  status shaman_status NOT NULL DEFAULT 'pending',
  total_bookings INTEGER NOT NULL DEFAULT 0,
  average_rating DOUBLE PRECISION NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_shamans_user_id ON shamans(user_id);
CREATE INDEX idx_shamans_status ON shamans(status);
CREATE INDEX idx_shamans_region ON shamans(region);
CREATE INDEX idx_shamans_region_district ON shamans(region, district);

-- =====================
-- BOOKINGS TABLE
-- =====================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shaman_id UUID NOT NULL REFERENCES shamans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  consultation_type TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  total_price INTEGER NOT NULL DEFAULT 0,
  status booking_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_shaman ON bookings(shaman_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_shaman_date ON bookings(shaman_id, date);

-- =====================
-- CHAT_ROOMS TABLE
-- =====================
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shaman_id UUID NOT NULL REFERENCES shamans(id) ON DELETE CASCADE,
  last_message TEXT NOT NULL DEFAULT '',
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_chat_rooms_pair ON chat_rooms(customer_id, shaman_id);
CREATE INDEX idx_chat_rooms_customer ON chat_rooms(customer_id);
CREATE INDEX idx_chat_rooms_shaman ON chat_rooms(shaman_id);

-- =====================
-- MESSAGES TABLE
-- =====================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type message_type NOT NULL DEFAULT 'text',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_room ON messages(room_id, created_at);
CREATE INDEX idx_messages_unread ON messages(room_id, sender_id, is_read) WHERE is_read = FALSE;

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER shamans_updated_at BEFORE UPDATE ON shamans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- RLS POLICIES
-- (커스텀 JWT 사용, Supabase Auth 아님 → service_role key로 서버에서 접근)
-- =====================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shamans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- service_role key는 RLS를 우회하므로 별도 정책 불필요
-- anon key 사용 시를 위한 permissive 정책
CREATE POLICY "Allow all for anon" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON shamans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON chat_rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON messages FOR ALL USING (true) WITH CHECK (true);
