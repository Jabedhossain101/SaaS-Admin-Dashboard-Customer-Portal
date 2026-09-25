import Link from 'next/link';
import {
  ShieldCheck,
  Activity,
  User,
  Calendar,
  Key,
  ArrowRight,
  Clock,
  Sparkles,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCustomerData } from '@/app/actions/customer';

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomerDashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedParams = await searchParams;
  const isUnauthorized = resolvedParams.error === 'unauthorized';
  const data = await getCustomerData();

  const formattedJoinDate = new Date(data.stats.joinedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const recentLogs = data.activityLogs.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Unauthorized 403 Alert if redirected from /admin */}
      {isUnauthorized && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 text-amber-200 flex items-start gap-3 shadow-lg animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-sm text-white">
              Admin Access Restricted (403 Forbidden)
            </div>
            <p className="text-xs text-amber-300/90 leading-relaxed">
              Your account is assigned the <strong className="text-white">customer</strong> role. You were safely returned to your customer workspace.
            </p>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-blue-950/30 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="purple" className="text-[11px] py-0.5">
                <Sparkles className="w-3 h-3 mr-1 text-purple-400" /> Customer Workspace
              </Badge>
              <Badge variant="success" className="text-[11px] py-0.5">
                {data.stats.accountStatus} Tenant
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {data.profile.fullName}!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Manage your profile credentials, inspect your tenant activity logs, and monitor security statuses with Row Level Security.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/profile">
              <Button size="sm" variant="primary">
                <User className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
              </Button>
            </Link>
            <Link href="/dashboard/activity">
              <Button size="sm" variant="outline">
                <Activity className="w-3.5 h-3.5 mr-1.5" /> View All Logs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Account Status</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-2">
            {data.stats.accountStatus}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Verified Tenant</p>
        </Card>

        <Card className="p-5 border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Member Since</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white mt-2">
            {formattedJoinDate}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tenant Registration</p>
        </Card>

        <Card className="p-5 border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Activity Events</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white mt-2">
            {data.stats.totalActions}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Logged Actions</p>
        </Card>

        <Card className="p-5 border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Security Isolation</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-indigo-400 mt-2">
            RLS Active
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Strict Postgres Guard</p>
        </Card>
      </div>

      {/* Main Grid: Activity Preview + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Recent Activity
            </h2>
            <Link
              href="/dashboard/activity"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
            >
              Full Log <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="border-slate-800/80 bg-slate-900/40 divide-y divide-slate-800/60">
            {recentLogs.map((log) => {
              const timeString = new Date(log.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {log.action}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        IP: {log.ip_address || '127.0.0.1'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                    {timeString}
                  </span>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Quick Shortcuts Card */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Quick Actions
          </h2>

          <div className="space-y-3">
            <Link
              href="/dashboard/profile"
              className="block p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/50 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                      Profile Settings
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Update display name &amp; avatar
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/dashboard/profile#password"
              className="block p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/50 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">
                      Security &amp; Password
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Change account password
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/dashboard/activity"
              className="block p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/50 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      Activity Auditing
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Browse all session events
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
