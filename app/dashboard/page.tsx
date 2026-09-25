import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  ArrowLeft,
  User,
  Activity,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  Building,
  CheckCircle2,
  FileText,
  Key,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';
import { signOutAction } from '@/app/actions/auth';

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  const isUnauthorized = resolvedSearchParams.error === 'unauthorized';
  const isConfigured = isSupabaseConfigured();

  let userEmail = 'customer@saasportal.io';
  let userName = 'Customer Tenant';
  let userRole = 'customer';

  // Check mock session
  const cookieStore = await cookies();
  const mockCookie = cookieStore.get('saas_mock_session');
  if (mockCookie?.value) {
    try {
      const parsed = JSON.parse(mockCookie.value);
      userEmail = parsed.email || userEmail;
      userName = parsed.fullName || userName;
      userRole = parsed.role || userRole;
    } catch {
      // Ignored
    }
  } else if (isConfigured) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userEmail = user.email || userEmail;
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .returns<{ full_name: string | null; role: string }[]>()
          .maybeSingle();
        if (profile) {
          userName = profile.full_name || userName;
          userRole = profile.role || userRole;
        }
      }
    } catch {
      // Ignored
    }
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to System Overview
        </Link>
        <div className="flex items-center gap-3">
          <Badge variant="info" className="px-3 py-1">
            <Building className="w-3.5 h-3.5 mr-1" /> Customer Workspace
          </Badge>
          <form action={signOutAction}>
            <Button variant="outline" size="sm" type="submit" className="text-slate-300 hover:text-red-400">
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
            </Button>
          </form>
        </div>
      </div>

      {/* Unauthorized Notice Banner */}
      {isUnauthorized && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 text-amber-200 flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-sm text-white">Admin Access Restricted (403 Forbidden)</div>
            <p className="text-xs text-amber-300/90 leading-relaxed">
              Your account currently has the <strong className="text-white">customer</strong> role. You were redirected to your customer workspace because you do not have permission to view the Admin Control Center.
            </p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customer Portal
            </h1>
            <Badge variant="success" className="text-xs">Active Session</Badge>
          </div>
          <p className="text-slate-400 text-sm max-w-xl">
            Logged in as <strong className="text-white">{userName}</strong> ({userEmail}).
            Your tenant workspace is isolated via PostgreSQL Row Level Security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400">Assigned Role</div>
            <div className="text-sm font-semibold text-blue-400 capitalize">{userRole}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-slate-700 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">User Profile</CardTitle>
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white mt-2 truncate">{userName}</div>
            <CardDescription className="text-xs text-slate-500 mt-1 truncate">
              {userEmail}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-slate-700 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Data Isolation</CardTitle>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-2">RLS Protected</div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Scoped strictly to your user tenant
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-slate-700 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Activity Auditing</CardTitle>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-purple-400 mt-2">Enabled</div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Events logged to public.activity_logs
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Tenant Resource Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Tenant Security &amp; Credentials
          </h2>
          <Badge variant="outline">Verified Token</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Session Status
            </div>
            <p className="text-xs text-slate-400">
              Session is actively protected and refreshed via Next.js Edge Middleware and SSR cookies.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Key className="w-4 h-4 text-blue-400" /> Account Security
            </div>
            <p className="text-xs text-slate-400">
              Password encryption and authentication handled by Supabase Auth with bcrypt hashing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
