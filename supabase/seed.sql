-- ==============================================================================
-- Seed Data: supabase/seed.sql
-- Pre-configured sample data for SaaS Admin Dashboard & Customer Portal
-- ==============================================================================

-- Note: In Supabase, auth.users records are typically created via Supabase Auth API
-- or Auth SQL generator. The following statements populate sample profiles and logs
-- for local testing and demonstration.

-- Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sample profile records
INSERT INTO public.profiles (id, full_name, phone, avatar_url, timezone, role, status, plan, created_at, updated_at)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Sarah Connor', '+1 (555) 019-2834', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'America/New_York', 'admin', 'active', 'enterprise', now() - interval '90 days', now()),
  ('a0000000-0000-0000-0000-000000000002', 'Marcus Vance', '+1 (555) 018-9273', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'America/Chicago', 'admin', 'active', 'enterprise', now() - interval '60 days', now()),
  ('c0000000-0000-0000-0000-000000000001', 'Alex Mercer', '+1 (555) 014-4921', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'America/Los_Angeles', 'customer', 'active', 'pro', now() - interval '45 days', now()),
  ('c0000000-0000-0000-0000-000000000002', 'Elena Rostova', '+44 20 7946 0912', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'Europe/London', 'customer', 'active', 'enterprise', now() - interval '30 days', now()),
  ('c0000000-0000-0000-0000-000000000003', 'David Chen', '+65 6789 0123', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Asia/Singapore', 'customer', 'active', 'free', now() - interval '14 days', now()),
  ('c0000000-0000-0000-0000-000000000004', 'Maya Patel', '+1 (555) 012-7890', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'America/Toronto', 'customer', 'pending', 'pro', now() - interval '7 days', now()),
  ('c0000000-0000-0000-0000-000000000005', 'Jordan Taylor', '+61 2 9876 5432', NULL, 'Australia/Sydney', 'customer', 'suspended', 'free', now() - interval '2 days', now())
ON CONFLICT (id) DO NOTHING;

-- Sample activity log records
INSERT INTO public.activity_logs (user_id, action, description, metadata, created_at)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Admin Session Authenticated', 'Superadmin logged in via SSR cookie token', '{"ip": "192.168.1.10", "browser": "Chrome 122"}'::jsonb, now() - interval '15 minutes'),
  ('c0000000-0000-0000-0000-000000000001', 'Profile Updated', 'Updated full name and timezone preference', '{"timezone": "America/Los_Angeles"}'::jsonb, now() - interval '2 hours'),
  ('c0000000-0000-0000-0000-000000000002', 'API Telemetry Key Generated', 'Created customer scoped production API key', '{"scope": "read_write"}'::jsonb, now() - interval '6 hours'),
  ('a0000000-0000-0000-0000-000000000002', 'User Role Modified', 'Elevated tenant to Pro Tier', '{"target_user": "c0000000-0000-0000-0000-000000000004"}'::jsonb, now() - interval '1 day'),
  ('c0000000-0000-0000-0000-000000000003', 'Customer Logged In', 'Customer workspace session active', '{"ip": "198.51.100.2"}'::jsonb, now() - interval '2 days'),
  ('c0000000-0000-0000-0000-000000000001', 'Password Changed', 'User updated account security password', '{"ip": "127.0.0.1"}'::jsonb, now() - interval '5 days');
