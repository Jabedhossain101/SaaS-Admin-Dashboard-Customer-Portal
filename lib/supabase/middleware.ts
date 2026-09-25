import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from '@/lib/utils';
import type { Database, UserRole, Profile } from '@/types/database';

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let supabaseResponse = NextResponse.next({
    request,
  });

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');

  const isProtectedRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  const isAdminRoute = pathname.startsWith('/admin');

  let userRole: UserRole | null = null;
  let isAuthenticated = false;

  // Check Mock Session in development/fallback mode
  const mockCookie = request.cookies.get('saas_mock_session');
  if (mockCookie?.value) {
    try {
      const parsed = JSON.parse(mockCookie.value);
      if (parsed?.role) {
        isAuthenticated = true;
        userRole = parsed.role as UserRole;
      }
    } catch {
      // Invalid mock cookie format
    }
  }

  // Check Supabase Session if configured
  if (isSupabaseConfigured()) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        isAuthenticated = true;
        // Check user metadata role or database profile
        const metadataRole = user.user_metadata?.role as UserRole | undefined;
        if (metadataRole) {
          userRole = metadataRole;
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .returns<Pick<Profile, 'role'>[]>()
            .maybeSingle();
          userRole = profile?.role || 'customer';
        }
      }
    } catch (err) {
      console.warn('[Supabase Middleware] Session verification bypassed:', err);
    }
  }

  // 1. Unauthenticated users trying to access protected routes -> Redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Customer trying to access Admin route -> Redirect to dashboard with unauthorized error
  if (isAdminRoute && isAuthenticated && userRole !== 'admin') {
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. Authenticated user visiting Auth routes -> Redirect to respective dashboard
  if (isAuthRoute && isAuthenticated) {
    const targetPath = userRole === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  return supabaseResponse;
}
