-- ==============================================================================
-- Migration: 01_init.sql
-- SaaS Admin Dashboard & Customer Portal Database Schema (SRS v1.0 Section 6)
-- ==============================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- 2. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on user_id and created_at
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- 3. Helper function to check if current user is an Administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 4. Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 5. Row-Level Security Policies: public.profiles
-- Users can view their own profile; Admins can view all profiles
DROP POLICY IF EXISTS "Profiles select policy" ON public.profiles;
CREATE POLICY "Profiles select policy"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id OR public.is_admin()
  );

-- Users can update their own profile (cannot change their own role or status); Admins can update any profile
DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
CREATE POLICY "Profiles update policy"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id OR public.is_admin()
  )
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND status = (SELECT status FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin()
  );

-- Allow profile creation upon auth signup and by admins
DROP POLICY IF EXISTS "Profiles insert policy" ON public.profiles;
CREATE POLICY "Profiles insert policy"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id OR public.is_admin()
  );

-- Admins can delete profiles
DROP POLICY IF EXISTS "Profiles delete policy" ON public.profiles;
CREATE POLICY "Profiles delete policy"
  ON public.profiles
  FOR DELETE
  USING (
    public.is_admin()
  );

-- 6. Row-Level Security Policies: public.activity_logs
-- Users view their own activity logs; Admins view all activity logs
DROP POLICY IF EXISTS "Activity logs select policy" ON public.activity_logs;
CREATE POLICY "Activity logs select policy"
  ON public.activity_logs
  FOR SELECT
  USING (
    auth.uid() = user_id OR public.is_admin()
  );

-- Authenticated users or admins can record activity logs
DROP POLICY IF EXISTS "Activity logs insert policy" ON public.activity_logs;
CREATE POLICY "Activity logs insert policy"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR public.is_admin()
  );

-- 7. Trigger to automatically create a profile upon user registration in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role TEXT := 'customer';
  user_full_name TEXT;
  user_phone TEXT;
  user_avatar TEXT;
  user_timezone TEXT := 'UTC';
BEGIN
  -- Extract metadata if passed during signUp
  IF (NEW.raw_user_meta_data->>'role') = 'admin' THEN
    assigned_role := 'admin';
  END IF;

  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  user_phone := NEW.raw_user_meta_data->>'phone';
  user_avatar := COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '');
  user_timezone := COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC');

  INSERT INTO public.profiles (id, full_name, phone, avatar_url, timezone, role, status, plan)
  VALUES (
    NEW.id,
    user_full_name,
    user_phone,
    user_avatar,
    user_timezone,
    assigned_role,
    'active',
    'free'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = CASE WHEN public.profiles.full_name = '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
    avatar_url = CASE WHEN public.profiles.avatar_url IS NULL OR public.profiles.avatar_url = '' THEN EXCLUDED.avatar_url ELSE public.profiles.avatar_url END,
    updated_at = timezone('utc'::text, now());

  -- Initial onboarding activity log
  INSERT INTO public.activity_logs (user_id, action, description, metadata)
  VALUES (
    NEW.id,
    'Account Initialized',
    'Customer account and profile registered successfully.',
    jsonb_build_object('role', assigned_role, 'email', NEW.email)
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
