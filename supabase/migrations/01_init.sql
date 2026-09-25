-- ==============================================================================
-- Database Migration: 01_init.sql
-- SaaS Admin Dashboard & Customer Portal Baseline Schema & Security
-- ==============================================================================

-- 1. Create Role Enum & Profiles Table
CREATE TYPE user_role AS ENUM ('admin', 'customer');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for quick role and email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- 3. Security Helper Functions
-- Function to safely check if the current requester is an admin without RLS recursion
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

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies: Profiles
-- Customers can view their own profile; Admins can view all profiles
CREATE POLICY "Profiles select policy"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id OR public.is_admin()
  );

-- Customers can update their own profile (cannot change their own role); Admins can update any profile
CREATE POLICY "Profiles update policy"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id OR public.is_admin()
  )
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin()
  );

-- Admins can insert/delete profiles if needed manually
CREATE POLICY "Profiles insert policy"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id OR public.is_admin()
  );

CREATE POLICY "Profiles delete policy"
  ON public.profiles
  FOR DELETE
  USING (
    public.is_admin()
  );

-- 6. Row Level Security Policies: Activity Logs
-- Users view only their own activity logs; Admins view all
CREATE POLICY "Activity logs select policy"
  ON public.activity_logs
  FOR SELECT
  USING (
    auth.uid() = user_id OR public.is_admin()
  );

-- Authenticated users or backend can insert activity logs
CREATE POLICY "Activity logs insert policy"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR public.is_admin()
  );

-- 7. Trigger to automatically create a profile upon user signup in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role user_role := 'customer';
BEGIN
  -- Extract optional role from metadata if specified (e.g. initial setup), otherwise default 'customer'
  IF (NEW.raw_user_meta_data->>'role') = 'admin' THEN
    assigned_role := 'admin'::user_role;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    assigned_role,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = CASE WHEN public.profiles.full_name = '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
    avatar_url = CASE WHEN public.profiles.avatar_url IS NULL OR public.profiles.avatar_url = '' THEN EXCLUDED.avatar_url ELSE public.profiles.avatar_url END,
    updated_at = timezone('utc'::text, now());

  -- Record initial signup activity log
  INSERT INTO public.activity_logs (user_id, action)
  VALUES (NEW.id, 'User account initialized');

  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Trigger for updating updated_at on profiles
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
