'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/utils';
import type { Profile, ActivityLog } from '@/types/database';
import {
  profileUpdateSchema,
  changePasswordSchema,
  type ProfileUpdateFormValues,
  type ChangePasswordFormValues,
} from '@/lib/validations/profile';

export interface CustomerDataResponse {
  profile: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
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
    action: 'User session authenticated via SSR',
    ip_address: '127.0.0.1',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'log-2',
    user_id: 'mock-user-12345',
    action: 'Accessed customer workspace dashboard',
    ip_address: '127.0.0.1',
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
  },
  {
    id: 'log-3',
    user_id: 'mock-user-12345',
    action: 'Profile credentials security check verified',
    ip_address: '127.0.0.1',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'log-4',
    user_id: 'mock-user-12345',
    action: 'Tenant isolation policy (RLS) synchronized',
    ip_address: '127.0.0.1',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'log-5',
    user_id: 'mock-user-12345',
    action: 'Initial account registered and initialized',
    ip_address: '127.0.0.1',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

/**
 * Fetch current authenticated customer data, profile and logs
 */
export async function getCustomerData(): Promise<CustomerDataResponse> {
  const cookieStore = await cookies();
  const mockCookie = cookieStore.get('saas_mock_session');

  let profile = {
    id: 'mock-user-12345',
    email: 'customer@saasportal.io',
    fullName: 'Alex Mercer',
    role: 'customer',
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
        role: parsed.role || profile.role,
        avatarUrl: parsed.avatarUrl || profile.avatarUrl,
      };
    } catch {
      // Ignore
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        profile.id = user.id;
        profile.email = user.email || profile.email;
        profile.createdAt = user.created_at || profile.createdAt;

        // Query profiles table
        const { data: dbProfile } = await (supabase.from('profiles') as any)
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (dbProfile) {
          profile.fullName = dbProfile.full_name || user.user_metadata?.full_name || profile.fullName;
          profile.role = dbProfile.role || profile.role;
          profile.avatarUrl = dbProfile.avatar_url || profile.avatarUrl;
          profile.updatedAt = dbProfile.updated_at || profile.updatedAt;
        }

        // Query activity_logs table
        const { data: dbLogs } = await (supabase.from('activity_logs') as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (dbLogs && Array.isArray(dbLogs) && dbLogs.length > 0) {
          activityLogs = dbLogs;
        }
      }
    } catch (err) {
      console.warn('[getCustomerData] Failed to fetch live Supabase data:', err);
    }
  }

  return {
    profile,
    activityLogs,
    stats: {
      accountStatus: 'Active',
      joinedAt: profile.createdAt,
      totalActions: activityLogs.length,
      securityTier: 'Standard Enterprise (RLS Protected)',
    },
  };
}

/**
 * Server Action to update customer full name and avatar URL
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

  const { fullName, avatarUrl } = parseResult.data;
  const cookieStore = await cookies();

  if (!isSupabaseConfigured()) {
    // Update mock session cookie
    const mockCookie = cookieStore.get('saas_mock_session');
    let currentSession = {
      id: 'mock-user-12345',
      email: 'customer@saasportal.io',
      fullName: 'Alex Mercer',
      role: 'customer',
      avatarUrl: null as string | null,
    };

    if (mockCookie?.value) {
      try {
        currentSession = { ...currentSession, ...JSON.parse(mockCookie.value) };
      } catch {
        // Ignore
      }
    }

    currentSession.fullName = fullName;
    currentSession.avatarUrl = avatarUrl || null;

    cookieStore.set('saas_mock_session', JSON.stringify(currentSession), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard/activity');

    return {
      success: true,
      message: 'Profile updated successfully! (Development Mode)',
    };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // 1. Update public.profiles
    const { error: profileError } = await (supabase.from('profiles') as any)
      .update({
        full_name: fullName,
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
        avatar_url: avatarUrl || null,
      },
    });

    // 3. Log activity
    await (supabase.from('activity_logs') as any).insert({
      user_id: user.id,
      action: `Profile updated (Full Name: ${fullName})`,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard/activity');

    return {
      success: true,
      message: 'Profile details saved successfully!',
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
      error: parseResult.error.issues[0]?.message || 'Invalid password configuration',
    };
  }

  const { newPassword } = parseResult.data;

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: 'Password updated successfully! (Development Mock Mode)',
    };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Log activity
    await (supabase.from('activity_logs') as any).insert({
      user_id: user.id,
      action: 'Account security password updated',
    });

    revalidatePath('/dashboard/activity');

    return {
      success: true,
      message: 'Your account password has been updated successfully!',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update password';
    return { success: false, error: message };
  }
}
