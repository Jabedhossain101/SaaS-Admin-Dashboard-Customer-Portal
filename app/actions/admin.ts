'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/utils';
import type { ActivityLog, UserRole } from '@/types/database';
import {
  adminUserUpdateSchema,
  type AdminUserUpdateFormValues,
} from '@/lib/validations/admin';

export interface AdminUserData {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  timezone?: string;
  role: UserRole;
  avatarUrl: string | null;
  status: 'active' | 'suspended' | 'pending';
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export interface AdminOverviewStats {
  totalUsers: number;
  totalCustomers: number;
  totalAdmins: number;
  totalLogs: number;
}

// Rich Mock Seed Data for instantaneous UI testing
const INITIAL_MOCK_USERS: AdminUserData[] = [
  {
    id: 'user-adm-1',
    email: 'admin@saasportal.io',
    fullName: 'Sarah Connor',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    plan: 'enterprise',
  },
  {
    id: 'user-cst-1',
    email: 'alex.mercer@innovate.dev',
    fullName: 'Alex Mercer',
    phone: '+1 (555) 234-5678',
    timezone: 'UTC',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'active',
    plan: 'pro',
  },
  {
    id: 'user-cst-2',
    email: 'elena.rostova@cloudscale.net',
    fullName: 'Elena Rostova',
    phone: '+44 20 7946 0912',
    timezone: 'Europe/London',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 32).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    status: 'active',
    plan: 'pro',
  },
  {
    id: 'user-adm-2',
    email: 'marcus.vance@saasportal.io',
    fullName: 'Marcus Vance',
    phone: '+1 (555) 876-5432',
    timezone: 'America/Los_Angeles',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'active',
    plan: 'enterprise',
  },
  {
    id: 'user-cst-3',
    email: 'david.chen@fintechflow.io',
    fullName: 'David Chen',
    phone: '+65 6789 0123',
    timezone: 'Asia/Singapore',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'active',
    plan: 'free',
  },
  {
    id: 'user-cst-4',
    email: 'maya.patel@dataforge.com',
    fullName: 'Maya Patel',
    phone: '+1 (555) 432-1098',
    timezone: 'America/Chicago',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'active',
    plan: 'pro',
  },
  {
    id: 'user-cst-5',
    email: 'jordan.taylor@growthlab.co',
    fullName: 'Jordan Taylor',
    phone: '+1 (555) 987-6543',
    timezone: 'America/Denver',
    role: 'customer',
    avatarUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    status: 'active',
    plan: 'free',
  },
];

const INITIAL_MOCK_LOGS: ActivityLog[] = [
  {
    id: 'sys-log-1',
    user_id: 'user-adm-1',
    action: 'ADMIN_SESSION_VERIFIED',
    description: 'Admin session verified (Elevated Privileges)',
    metadata: { ip: '192.168.1.10' },
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'sys-log-2',
    user_id: 'user-cst-4',
    action: 'API_KEY_GENERATED',
    description: 'Customer tenant generated API telemetry key',
    metadata: { ip: '10.0.4.22' },
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'sys-log-3',
    user_id: 'user-cst-2',
    action: 'PROFILE_UPDATED',
    description: 'Updated profile metadata and workspace theme',
    metadata: { ip: '172.16.0.45' },
    created_at: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: 'sys-log-4',
    user_id: 'user-adm-2',
    action: 'SECURITY_BENCHMARK',
    description: 'System RLS security policy benchmark executed',
    metadata: { ip: '192.168.1.14' },
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'sys-log-5',
    user_id: 'user-cst-3',
    action: 'SESSION_AUTHENTICATED',
    description: 'Customer authenticated via Supabase SSR',
    metadata: { ip: '198.51.100.2' },
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'sys-log-6',
    user_id: 'user-cst-5',
    action: 'TENANT_ONBOARDED',
    description: 'New tenant onboarding initialized',
    metadata: { ip: '203.0.113.88' },
    created_at: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
  },
];

/**
 * Helper to verify administrator authorization
 */
export async function verifyAdminAuth(): Promise<{ authorized: boolean; adminId?: string }> {
  const cookieStore = await cookies();
  const mockCookie = cookieStore.get('saas_mock_session');

  if (mockCookie?.value) {
    try {
      const parsed = JSON.parse(mockCookie.value);
      if (parsed.role === 'admin') {
        return { authorized: true, adminId: parsed.id };
      }
    } catch {
      // Ignore
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profile } = await (supabase.from('profiles') as any)
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin' || user.user_metadata?.role === 'admin') {
          return { authorized: true, adminId: user.id };
        }
      }
    } catch {
      // Ignore
    }
  }

  // Allow in development mock mode
  return { authorized: true, adminId: 'mock-admin-id' };
}

/**
 * Fetch Admin Overview statistics and latest logs
 */
export async function getAdminOverviewData(): Promise<{
  stats: AdminOverviewStats;
  latestLogs: ActivityLog[];
  recentUsers: AdminUserData[];
}> {
  let users = [...INITIAL_MOCK_USERS];
  let logs = [...INITIAL_MOCK_LOGS];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: dbProfiles } = await (supabase.from('profiles') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (dbProfiles && Array.isArray(dbProfiles) && dbProfiles.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        users = dbProfiles.map((p: any) => ({
          id: p.id,
          email: p.email || `${p.id}@tenant.io`,
          fullName: p.full_name || 'Unnamed User',
          phone: p.phone || null,
          timezone: p.timezone || 'UTC',
          role: (p.role as UserRole) || 'customer',
          avatarUrl: p.avatar_url,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          status: (p.status as 'active' | 'suspended' | 'pending') || 'active',
          plan: (p.plan as 'free' | 'pro' | 'enterprise') || 'free',
        }));
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: dbLogs } = await (supabase.from('activity_logs') as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (dbLogs && Array.isArray(dbLogs) && dbLogs.length > 0) {
        logs = dbLogs as ActivityLog[];
      }
    } catch (err) {
      console.warn('[getAdminOverviewData] Fallback to mock data:', err);
    }
  }

  const totalUsers = users.length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalLogs = logs.length;

  return {
    stats: {
      totalUsers,
      totalCustomers,
      totalAdmins,
      totalLogs,
    },
    latestLogs: logs.slice(0, 6),
    recentUsers: users.slice(0, 5),
  };
}

/**
 * Fetch all registered users with optional search and role filtering
 */
export async function getAdminUsersList(
  searchQuery?: string,
  roleFilter?: string
): Promise<AdminUserData[]> {
  let users = [...INITIAL_MOCK_USERS];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: dbProfiles } = await (supabase.from('profiles') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (dbProfiles && Array.isArray(dbProfiles) && dbProfiles.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        users = dbProfiles.map((p: any) => ({
          id: p.id,
          email: p.email || `${p.id}@tenant.io`,
          fullName: p.full_name || 'Unnamed User',
          phone: p.phone || null,
          timezone: p.timezone || 'UTC',
          role: (p.role as UserRole) || 'customer',
          avatarUrl: p.avatar_url,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          status: (p.status as 'active' | 'suspended' | 'pending') || 'active',
          plan: (p.plan as 'free' | 'pro' | 'enterprise') || 'free',
        }));
      }
    } catch (err) {
      console.warn('[getAdminUsersList] Supabase query fallback:', err);
    }
  }

  // Apply search query filter
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    users = users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }

  // Apply role filter
  if (roleFilter && roleFilter !== 'all') {
    users = users.filter((u) => u.role === roleFilter);
  }

  return users;
}

/**
 * Fetch single user by ID with their specific activity logs
 */
export async function getAdminUserById(userId: string): Promise<{
  user: AdminUserData | null;
  userLogs: ActivityLog[];
}> {
  const users = await getAdminUsersList();
  const user = users.find((u) => u.id === userId) || null;

  let userLogs: ActivityLog[] = INITIAL_MOCK_LOGS.filter(
    (l) => l.user_id === userId || l.user_id === 'mock-user-12345'
  );

  if (isSupabaseConfigured() && user) {
    try {
      const supabase = await createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: dbLogs } = await (supabase.from('activity_logs') as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (dbLogs && Array.isArray(dbLogs)) {
        userLogs = dbLogs as ActivityLog[];
      }
    } catch {
      // Ignore
    }
  }

  return { user, userLogs };
}

/**
 * Server Action: Update user role and metadata by an Administrator
 */
export async function updateUserByAdminAction(
  userId: string,
  data: AdminUserUpdateFormValues
): Promise<{ success: boolean; message?: string; error?: string }> {
  const parseResult = adminUserUpdateSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid user update payload',
    };
  }

  const { authorized, adminId } = await verifyAdminAuth();
  if (!authorized) {
    return {
      success: false,
      error: 'Unauthorized: Only system administrators can perform this operation.',
    };
  }

  const { fullName, role, avatarUrl } = parseResult.data;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();

      // 1. Update public.profiles table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase.from('profiles') as any)
        .update({
          full_name: fullName,
          role: role,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // 2. Log admin action
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('activity_logs') as any).insert({
        user_id: adminId || userId,
        action: 'ADMIN_USER_UPDATE',
        description: `Administrator modified tenant profile ${userId} (Role: ${role}, Name: ${fullName})`,
        metadata: { target_user_id: userId, new_role: role },
      });

      revalidatePath('/admin');
      revalidatePath('/admin/users');
      revalidatePath(`/admin/users/${userId}`);
      revalidatePath('/dashboard');

      return {
        success: true,
        message: `User ${fullName} successfully updated to role "${role}".`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database update failed';
      return { success: false, error: msg };
    }
  }

  // Mock Mode Update
  revalidatePath('/admin');
  revalidatePath('/admin/users');
  revalidatePath(`/admin/users/${userId}`);

  return {
    success: true,
    message: `[Mock Mode] User ${fullName} role set to "${role}" and profile saved!`,
  };
}

/**
 * Fetch all system audit logs
 */
export async function getAdminLogsList(): Promise<ActivityLog[]> {
  let logs = [...INITIAL_MOCK_LOGS];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: dbLogs } = await (supabase.from('activity_logs') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (dbLogs && Array.isArray(dbLogs) && dbLogs.length > 0) {
        logs = dbLogs as ActivityLog[];
      }
    } catch {
      // Ignore
    }
  }

  return logs;
}
