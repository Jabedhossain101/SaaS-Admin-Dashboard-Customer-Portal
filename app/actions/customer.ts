'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/utils';
import type { ActivityLog } from '@/types/database';
import {
  profileUpdateSchema,
  changePasswordSchema,
  type ProfileUpdateFormValues,
  type ChangePasswordFormValues,
} from '@/lib/validations/profile';

export interface CustomerProfileData {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  timezone: string;
  role: 'customer' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  plan: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDataResponse {
  profile: CustomerProfileData;
  activityLogs: ActivityLog[];
  stats: {
    accountStatus: 'Active' | 'Pending' | 'Suspended';
    joinedAt: string;
    totalActions: number;
    securityTier: string;
  };
}

const DEFAULT_MOCK_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    user_id: 'mock-user-12345',
    action: 'USER_LOGIN',
    description: 'User session authenticated via SSR',
    metadata: { provider: 'email' },
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'log-2',
    user_id: 'mock-user-12345',
    action: 'DASHBOARD_ACCESS',
    description: 'Accessed customer workspace dashboard',
    metadata: { path: '/dashboard' },
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
  },
  {
    id: 'log-3',
    user_id: 'mock-user-12345',
    action: 'SECURITY_AUDIT',
    description: 'Profile credentials security check verified',
    metadata: { check: 'mfa_status' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'log-4',
    user_id: 'mock-user-12345',
    action: 'POLICY_SYNC',
    description: 'Tenant isolation policy (RLS) synchronized',
    metadata: { rls: true },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'log-5',
    user_id: 'mock-user-12345',
    action: 'ACCOUNT_CREATED',
    description: 'Initial account registered and initialized',
    metadata: { plan: 'free' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

/**
 * Fetch current authenticated customer data, profile, and logs
 */
export async function getCustomerData(): Promise<CustomerDataResponse> {
  const cookieStore = await cookies();
  const mockCookie = cookieStore.get('saas_mock_session');

  let profile: CustomerProfileData = {
    id: 'mock-user-12345',
    email: 'customer@saasportal.io',
    fullName: 'Alex Mercer',
    phone: '+1 (555) 234-5678',
    timezone: 'UTC',
    role: 'customer',
    status: 'active',
    plan: 'Pro Enterprise',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  let activityLogs: ActivityLog[] = [...DEFAULT_MOCK_LOGS];

  if (mockCookie?.value) {
    try {
      const parsed = JSON.parse(mockCookie.value);
      profile = {
        ...profile,
        id: parsed.id || profile.id,
        email: parsed.email || profile.email,
        fullName: parsed.fullName || profile.fullName,
        phone: parsed.phone !== undefined ? parsed.phone : profile.phone,
        timezone: parsed.timezone || profile.timezone,
        role: parsed.role || profile.role,
        status: parsed.status || profile.status,
        plan: parsed.plan || profile.plan,
        avatarUrl: parsed.avatarUrl !== undefined ? parsed.avatarUrl : profile.avatarUrl,
      };
    } catch {
      // Ignore parse error
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        profile.id = user.id;
        profile.email = user.email || profile.email;
        profile.createdAt = user.created_at || profile.createdAt;

        // Query public.profiles table
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (dbProfile) {
          const p = dbProfile as Record<string, unknown>;
          profile.fullName = (p.full_name as string) || (user.user_metadata?.full_name as string) || profile.fullName;
          profile.phone = (p.phone as string) || null;
          profile.timezone = (p.timezone as string) || profile.timezone;
          profile.role = (p.role as 'customer' | 'admin') || profile.role;
          profile.status = (p.status as 'active' | 'suspended' | 'pending') || profile.status;
          profile.plan = (p.plan as string) || profile.plan;
          profile.avatarUrl = (p.avatar_url as string) || null;
          profile.updatedAt = (p.updated_at as string) || profile.updatedAt;
        }

        // Query public.activity_logs table
        const { data: dbLogs } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (dbLogs && Array.isArray(dbLogs) && dbLogs.length > 0) {
          activityLogs = dbLogs as ActivityLog[];
        }
      }
    } catch (err) {
      console.warn('[getCustomerData] Failed to fetch live Supabase data:', err);
    }
  }

  const statusLabel =
    profile.status === 'suspended' ? 'Suspended' : profile.status === 'pending' ? 'Pending' : 'Active';

  return {
    profile,
    activityLogs,
    stats: {
      accountStatus: statusLabel,
      joinedAt: profile.createdAt,
      totalActions: activityLogs.length,
      securityTier: `${profile.plan} (RLS Protected)`,
    },
  };
}

/**
 * Server Action to update customer profile (full name, phone, timezone, avatar URL)
 */
export async function updateCustomerProfileAction(
  data: ProfileUpdateFormValues
): Promise<{ success: boolean; message?: string; error?: string }> {
  const parseResult = profileUpdateSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid form input',
    };
  }

  const { fullName, phone, timezone, avatarUrl } = parseResult.data;
  const cookieStore = await cookies();

  if (!isSupabaseConfigured()) {
    // Update mock session cookie
    const mockCookie = cookieStore.get('saas_mock_session');
    let currentSession: Record<string, unknown> = {
      id: 'mock-user-12345',
      email: 'customer@saasportal.io',
      fullName: 'Alex Mercer',
      phone: '+1 (555) 234-5678',
      timezone: 'UTC',
      role: 'customer',
      status: 'active',
      plan: 'Pro Enterprise',
      avatarUrl: null,
    };

    if (mockCookie?.value) {
      try {
        currentSession = { ...currentSession, ...JSON.parse(mockCookie.value) };
      } catch {
        // Ignore
      }
    }

    currentSession.fullName = fullName;
    currentSession.phone = phone || null;
    currentSession.timezone = timezone || 'UTC';
    currentSession.avatarUrl = avatarUrl || null;

    cookieStore.set('saas_mock_session', JSON.stringify(currentSession), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard/account');
    revalidatePath('/dashboard/activity');

    return {
      success: true,
      message: 'Profile updated successfully!',
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // 1. Update public.profiles
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabase.from('profiles') as any)
      .update({
        full_name: fullName,
        phone: phone || null,
        timezone: timezone || 'UTC',
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // 2. Update user metadata in auth
    await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        phone: phone || null,
        timezone: timezone || 'UTC',
        avatar_url: avatarUrl || null,
      },
    });

    // 3. Log activity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('activity_logs') as any).insert({
      user_id: user.id,
      action: 'PROFILE_UPDATE',
      description: `Customer profile updated (Name: ${fullName})`,
      metadata: { full_name: fullName, timezone },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard/account');
    revalidatePath('/dashboard/activity');

    return {
      success: true,
      message: 'Profile updated successfully!',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update profile';
    return { success: false, error: message };
  }
}

/**
 * Server Action to change customer password
 */
export async function changeCustomerPasswordAction(
  data: ChangePasswordFormValues
): Promise<{ success: boolean; message?: string; error?: string }> {
  const parseResult = changePasswordSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid form input',
    };
  }

  const { newPassword } = parseResult.data;

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: 'Password updated successfully!',
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Log security activity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('activity_logs') as any).insert({
      user_id: user.id,
      action: 'PASSWORD_CHANGE',
      description: 'Account security credentials / password updated',
      metadata: { event: 'password_reset' },
    });

    return {
      success: true,
      message: 'Password updated successfully!',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to change password';
    return { success: false, error: message };
  }
}
