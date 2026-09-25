import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  ArrowLeft,
  ShieldAlert,
  Users,
  Database,
  Terminal,
  LogOut,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';
import { signOutAction } from '@/app/actions/auth';

export default async function AdminPage() {
  const isConfigured = isSupabaseConfigured();

  let adminEmail = 'admin@saasportal.io';
  let adminName = 'System Administrator';

  // Check mock session
  const cookieStore = await cookies();
  const mockCookie = cookieStore.get('saas_mock_session');
  if (mockCookie?.value) {
    try {
      const parsed = JSON.parse(mockCookie.value);
      adminEmail = parsed.email || adminEmail;
      adminName = parsed.fullName || adminName;
    } catch {
      // Ignored
    }
  } else if (isConfigured) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        adminEmail = user.email || adminEmail;
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .returns<{ full_name: string | null }[]>()
          .maybeSingle();
        if (profile?.full_name) {
          adminName = profile.full_name;
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
          <Badge variant="purple" className="px-3 py-1">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Admin Workspace
          </Badge>
          <form action={signOutAction}>
            <Button variant="outline" size="sm" type="submit" className="text-slate-300 hover:text-red-400">
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
            </Button>
          </form>
        </div>
      </div>

      {/* Admin Header Banner */}
      <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-slate-950 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-purple-400" />
              Admin Control Center
            </h1>
            <Badge variant="purple" className="text-xs">Elevated Scope</Badge>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">
            Logged in as <strong className="text-white">{adminName}</strong> ({adminEmail}).
            You possess universal read and write privileges across all tenant profiles and activity audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400">Access Tier</div>
            <div className="text-sm font-semibold text-purple-400">Superadmin</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-purple-900/30 hover:border-purple-800/50 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Tenant Management</CardTitle>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">All Profiles Scope</div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              RLS Rule: <code className="text-purple-300">is_admin() = true</code>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-purple-900/30 hover:border-purple-800/50 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Global Activity Log</CardTitle>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-400 mt-2">System-Wide Audit</div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Unrestricted query stream
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-purple-900/30 hover:border-purple-800/50 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Security Policies</CardTitle>
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">Enforced &amp; Active</div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Schema <code className="text-slate-400">01_init.sql</code>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* System Control Options */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          Administrative Directives &amp; Security Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-purple-400" /> RBAC Route Guard Active
            </div>
            <p className="text-xs text-slate-400">
              Customers attempting to directly navigate to <code>/admin</code> are automatically blocked by the edge middleware and redirected back to <code>/dashboard</code> with a 403 banner.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Activity className="w-4 h-4 text-emerald-400" /> Real-time Audit Dispatch
            </div>
            <p className="text-xs text-slate-400">
              Every login, registration, and administrative action writes a row to <code>public.activity_logs</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
