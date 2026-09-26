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
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCustomerData } from '@/app/actions/customer';
import { formatDate } from '@/lib/utils/formatDate';

export const metadata = {
  title: 'Customer Dashboard | SaaS Portal',
  description: 'Manage your customer workspace, subscription plan, and security logs.',
};

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomerDashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedParams = await searchParams;
  const isUnauthorized = resolvedParams.error === 'unauthorized';
  const data = await getCustomerData();

  const formattedJoinDate = formatDate(data.stats.joinedAt);
  const recentLogs = data.activityLogs.slice(0, 4);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Unauthorized 403 Alert if redirected from /admin */}
      {isUnauthorized && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 p-4 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-lg animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-sm text-slate-900 dark:text-white">
              Admin Access Restricted (403 Forbidden)
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
              Your account is assigned the <strong className="text-slate-900 dark:text-white">customer</strong> role. You were safely returned to your customer workspace.
            </p>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/90 via-white to-blue-50/40 dark:from-slate-900/90 dark:via-slate-900/50 dark:to-blue-950/30 p-6 sm:p-8 backdrop-blur-xl shadow-sm dark:shadow-xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="purple" className="text-[11px] py-0.5 font-semibold">
                <Sparkles className="w-3 h-3 mr-1 text-purple-600 dark:text-purple-400" /> Customer Workspace
              </Badge>
              <Badge variant="success" className="text-[11px] py-0.5 font-semibold">
                {data.stats.accountStatus} Tenant
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {data.profile.fullName}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl">
              Manage your profile credentials, inspect your tenant activity logs, and monitor security statuses with Row Level Security.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/profile">
              <Button size="sm" variant="primary" className="shadow-md">
                <User className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
              </Button>
            </Link>
            <Link href="/dashboard/account">
              <Button size="sm" variant="outline">
                <Layers className="w-3.5 h-3.5 mr-1.5" /> Plan &amp; Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Account Status</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {data.stats.accountStatus}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Operational Tenant</p>
        </Card>

        <Card className="p-5 border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Member Since</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">
            {formattedJoinDate}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Tenant Registration</p>
        </Card>

        <Card className="p-5 border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Activity Events</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">
            {data.stats.totalActions}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Logged Actions</p>
        </Card>

        <Card className="p-5 border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Security Isolation</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            RLS Active
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Strict Postgres Guard</p>
        </Card>
      </div>

      {/* Main Grid: Activity Preview + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Recent Activity
            </h2>
            <Link
              href="/dashboard/activity"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
            >
              Full Log <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 divide-y divide-slate-100 dark:divide-slate-800/60 shadow-sm">
            {recentLogs.map((log) => {
              const timeString = formatDate(log.created_at);

              return (
                <div
                  key={log.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {log.action}
                      </p>
                      {log.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {log.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-mono">
                    {timeString}
                  </span>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Quick Shortcuts Card */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Quick Actions
          </h2>

          <div className="space-y-3">
            <Link
              href="/dashboard/profile"
              className="block p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-slate-700 transition-all group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Profile Settings
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Update contact details &amp; password
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/dashboard/account"
              className="block p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-emerald-300 dark:hover:border-slate-700 transition-all group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Account &amp; Plan Tier
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Review limits and subscription quotas
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/dashboard/activity"
              className="block p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-purple-300 dark:hover:border-slate-700 transition-all group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 transition-colors">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Audit Stream
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Search and filter activity history
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
