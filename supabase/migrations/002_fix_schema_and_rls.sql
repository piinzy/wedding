-- Migration: 002_fix_schema_and_rls.sql
-- Fixes 4 critical issues from technical audit:
-- 1. Add 'organizer' role to enum + restructure bride→organizer naming
-- 2. Add handle_new_user() trigger for auth.users
-- 3. Fix admin RLS infinite recursion with SECURITY DEFINER function
-- 4. Add full RLS policies

-- ============================================
-- 1. FIX ENUM: Add organizer role
-- ============================================

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'organizer';

-- Update default role on users table
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'organizer';

-- ============================================
-- 2. RESTRUCTURE: bride → event_organizer
-- ============================================

-- Rename bride_profiles table
ALTER TABLE bride_profiles RENAME TO event_organizer_profiles;

-- Add event_type column
ALTER TABLE event_organizer_profiles
  ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'wedding'
  CHECK (event_type IN ('wedding', 'birthday', 'home_party', 'occasion'));

-- Rename event_date column (wedding_date → event_date)
ALTER TABLE event_organizer_profiles RENAME COLUMN wedding_date TO event_date;

-- Add partner/co-organizer name alias (keep partner_name, it's generic enough)

-- Update indexes
DROP INDEX IF EXISTS idx_bride_profiles_user_id;
DROP INDEX IF EXISTS idx_bride_profiles_city;
CREATE INDEX IF NOT EXISTS idx_event_organizer_profiles_user_id ON event_organizer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_event_organizer_profiles_city ON event_organizer_profiles(city);
CREATE INDEX IF NOT EXISTS idx_event_organizer_profiles_event_type ON event_organizer_profiles(event_type);

-- Rename bride_id → organizer_id in all related tables
ALTER TABLE bride_purchases RENAME COLUMN bride_id TO organizer_id;
ALTER TABLE ai_conversations RENAME COLUMN bride_id TO organizer_id;
ALTER TABLE tasks RENAME COLUMN bride_id TO organizer_id;
ALTER TABLE budget_items RENAME COLUMN bride_id TO organizer_id;
ALTER TABLE vendor_inquiries RENAME COLUMN bride_id TO organizer_id;
ALTER TABLE reviews RENAME COLUMN bride_id TO organizer_id;

-- Rename bride_purchases table
ALTER TABLE bride_purchases RENAME TO organizer_purchases;

-- Rename bride_service_type enum values (recreate since ALTER ENUM can't rename values easily)
-- We add the new values and the app uses them going forward
ALTER TYPE bride_service_type ADD VALUE IF NOT EXISTS 'event_planner';

-- Update indexes
DROP INDEX IF EXISTS idx_bride_purchases_bride_id;
DROP INDEX IF EXISTS idx_bride_purchases_service_type;
CREATE INDEX IF NOT EXISTS idx_organizer_purchases_organizer_id ON organizer_purchases(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_purchases_service_type ON organizer_purchases(service_type);

DROP INDEX IF EXISTS idx_ai_conversations_bride_id;
CREATE INDEX IF NOT EXISTS idx_ai_conversations_organizer_id ON ai_conversations(organizer_id);

DROP INDEX IF EXISTS idx_tasks_bride_id;
CREATE INDEX IF NOT EXISTS idx_tasks_organizer_id ON tasks(organizer_id);

DROP INDEX IF EXISTS idx_budget_items_bride_id;
CREATE INDEX IF NOT EXISTS idx_budget_items_organizer_id ON budget_items(organizer_id);

DROP INDEX IF EXISTS idx_vendor_inquiries_bride_id;
CREATE INDEX IF NOT EXISTS idx_vendor_inquiries_organizer_id ON vendor_inquiries(organizer_id);

DROP INDEX IF EXISTS idx_reviews_bride_id;
CREATE INDEX IF NOT EXISTS idx_reviews_organizer_id ON reviews(organizer_id);

-- ============================================
-- 3. TRIGGER: Auto-create public.users row after auth signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'organizer')::user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also auto-create event_organizer_profiles for organizer role
CREATE OR REPLACE FUNCTION public.handle_new_organizer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'organizer' THEN
    INSERT INTO public.event_organizer_profiles (user_id, event_type)
    VALUES (NEW.id, 'wedding')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_organizer_created ON public.users;
CREATE TRIGGER on_organizer_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_organizer();

-- ============================================
-- 4. FIX RLS: is_admin() to prevent infinite recursion
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- 5. FULL RLS POLICIES
-- ============================================

-- USERS TABLE
DROP POLICY IF EXISTS "admin_all_users" ON users;
DROP POLICY IF EXISTS "users_read_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;

CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "users_insert_self" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "admin_delete_users" ON users
  FOR DELETE USING (public.is_admin());

-- EVENT ORGANIZER PROFILES
ALTER TABLE event_organizer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "organizer_profiles_own" ON event_organizer_profiles;

CREATE POLICY "organizer_profiles_read_own" ON event_organizer_profiles
  FOR SELECT USING (
    user_id = auth.uid() OR public.is_admin()
  );

CREATE POLICY "organizer_profiles_insert_own" ON event_organizer_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "organizer_profiles_update_own" ON event_organizer_profiles
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "organizer_profiles_delete_admin" ON event_organizer_profiles
  FOR DELETE USING (public.is_admin());

-- VENDOR PROFILES
DROP POLICY IF EXISTS "admin_all_vendors" ON vendor_profiles;
DROP POLICY IF EXISTS "vendor_profiles_own" ON vendor_profiles;

CREATE POLICY "vendor_profiles_public_read" ON vendor_profiles
  FOR SELECT USING (is_approved = true OR user_id = auth.uid() OR public.is_admin());

CREATE POLICY "vendor_profiles_insert_own" ON vendor_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "vendor_profiles_update_own" ON vendor_profiles
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "vendor_profiles_delete_admin" ON vendor_profiles
  FOR DELETE USING (public.is_admin());

-- VENDOR PHOTOS
DROP POLICY IF EXISTS "vendor_photos_own" ON vendor_photos;

CREATE POLICY "vendor_photos_public_read" ON vendor_photos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM vendor_profiles vp WHERE vp.id = vendor_photos.vendor_id AND (vp.is_approved = true OR vp.user_id = auth.uid()))
    OR public.is_admin()
  );

CREATE POLICY "vendor_photos_insert_own" ON vendor_photos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM vendor_profiles vp WHERE vp.id = vendor_photos.vendor_id AND vp.user_id = auth.uid())
  );

CREATE POLICY "vendor_photos_update_own" ON vendor_photos
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM vendor_profiles vp WHERE vp.id = vendor_photos.vendor_id AND vp.user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "vendor_photos_delete_own" ON vendor_photos
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM vendor_profiles vp WHERE vp.id = vendor_photos.vendor_id AND vp.user_id = auth.uid())
    OR public.is_admin()
  );

-- ORGANIZER PURCHASES
DROP POLICY IF EXISTS "purchases_own" ON organizer_purchases;

CREATE POLICY "organizer_purchases_own" ON organizer_purchases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM event_organizer_profiles ep WHERE ep.id = organizer_purchases.organizer_id AND ep.user_id = auth.uid())
    OR public.is_admin()
  );

-- VENDOR SUBSCRIPTIONS
DROP POLICY IF EXISTS "subscriptions_own" ON vendor_subscriptions;

CREATE POLICY "vendor_subscriptions_own" ON vendor_subscriptions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM vendor_profiles vp WHERE vp.id = vendor_subscriptions.vendor_id AND vp.user_id = auth.uid())
    OR public.is_admin()
  );

-- AI CONVERSATIONS
DROP POLICY IF EXISTS "ai_conversations_own" ON ai_conversations;

CREATE POLICY "ai_conversations_own" ON ai_conversations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM event_organizer_profiles ep WHERE ep.id = ai_conversations.organizer_id AND ep.user_id = auth.uid())
    OR public.is_admin()
  );

-- TASKS
DROP POLICY IF EXISTS "tasks_own" ON tasks;

CREATE POLICY "tasks_own" ON tasks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM event_organizer_profiles ep WHERE ep.id = tasks.organizer_id AND ep.user_id = auth.uid())
    OR public.is_admin()
  );

-- BUDGET ITEMS
DROP POLICY IF EXISTS "budget_items_own" ON budget_items;

CREATE POLICY "budget_items_own" ON budget_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM event_organizer_profiles ep WHERE ep.id = budget_items.organizer_id AND ep.user_id = auth.uid())
    OR public.is_admin()
  );

-- VENDOR INQUIRIES
DROP POLICY IF EXISTS "vendor_inquiries_own" ON vendor_inquiries;

CREATE POLICY "vendor_inquiries_organizer" ON vendor_inquiries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM event_organizer_profiles ep WHERE ep.id = vendor_inquiries.organizer_id AND ep.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM vendor_profiles vp WHERE vp.id = vendor_inquiries.vendor_id AND vp.user_id = auth.uid())
    OR public.is_admin()
  );

-- REVIEWS
DROP POLICY IF EXISTS "reviews_own" ON reviews;

CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_organizer" ON reviews
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM event_organizer_profiles ep WHERE ep.id = reviews.organizer_id AND ep.user_id = auth.uid())
  );

CREATE POLICY "reviews_update_own" ON reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM event_organizer_profiles ep WHERE ep.id = reviews.organizer_id AND ep.user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "reviews_delete_admin" ON reviews
  FOR DELETE USING (public.is_admin());
