'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/utils';
import type { Profile } from '@/types/database';
import {
  loginSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginFormValues,
  type SignUpFormValues,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from '@/lib/validations/auth';

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  redirectUrl?: string;
}

/**
 * Server Action for User Login
 */
export async function signInAction(data: LoginFormValues): Promise<ActionResponse> {
  const parseResult = loginSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid form input',
    };
  }

  const { email, password } = parseResult.data;

  // Fallback to Mock Session in development if Supabase is unconfigured
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const isMockAdmin = email.toLowerCase().includes('admin') || password === 'admin123';
    const mockRole = isMockAdmin ? 'admin' : 'customer';

    cookieStore.set('saas_mock_session', JSON.stringify({
      id: 'mock-user-12345',
      email,
      fullName: isMockAdmin ? 'Admin User' : 'Standard Customer',
      role: mockRole,
      avatarUrl: null,
    }), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const targetUrl = mockRole === 'admin' ? '/admin' : '/dashboard';
    return {
      success: true,
      message: `Signed in as ${mockRole} (Development Mock Mode)`,
      redirectUrl: targetUrl,
    };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || 'Failed to authenticate user',
    };
  }

  // Determine user role to route appropriately
  let targetUrl = '/dashboard';
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .returns<Pick<Profile, 'role'>[]>()
      .maybeSingle();

    if (profile && profile.role === 'admin') {
      targetUrl = '/admin';
    }
  } catch (err) {
    console.error('Role check error:', err);
  }

  return {
    success: true,
    message: 'Authentication successful',
    redirectUrl: targetUrl,
  };
}

/**
 * Server Action for User Registration
 */
export async function signUpAction(data: SignUpFormValues): Promise<ActionResponse> {
  const parseResult = signUpSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid form input',
    };
  }

  const { email, password, fullName, role } = parseResult.data;

  // Fallback to Mock Session if Supabase is unconfigured
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    cookieStore.set('saas_mock_session', JSON.stringify({
      id: 'mock-user-' + Date.now(),
      email,
      fullName,
      role,
      avatarUrl: null,
    }), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    const targetUrl = role === 'admin' ? '/admin' : '/dashboard';
    return {
      success: true,
      message: `Account created successfully as ${role}! (Mock Mode)`,
      redirectUrl: targetUrl,
    };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`,
    },
  });

  if (authError) {
    return {
      success: false,
      error: authError.message,
    };
  }

  if (authData.session) {
    const targetUrl = role === 'admin' ? '/admin' : '/dashboard';
    return {
      success: true,
      message: 'Account registered and signed in!',
      redirectUrl: targetUrl,
    };
  }

  return {
    success: true,
    message: 'Account created! Please check your email inbox to verify your account.',
    redirectUrl: '/login',
  };
}

/**
 * Server Action for Password Reset Email
 */
export async function forgotPasswordAction(data: ForgotPasswordFormValues): Promise<ActionResponse> {
  const parseResult = forgotPasswordSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid email address',
    };
  }

  const { email } = parseResult.data;

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: 'Development Mock: Password reset email link simulated for ' + email,
    };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Check your email for the password reset link.',
  };
}

/**
 * Server Action for Updating Password
 */
export async function resetPasswordAction(data: ResetPasswordFormValues): Promise<ActionResponse> {
  const parseResult = resetPasswordSchema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid password',
    };
  }

  const { password } = parseResult.data;

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      message: 'Development Mock: Password has been updated successfully.',
      redirectUrl: '/login',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Your password has been successfully updated. You may now sign in.',
    redirectUrl: '/login',
  };
}

/**
 * Server Action for User Sign Out
 */
export async function signOutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('saas_mock_session');

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect('/login');
}
