import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Database,
  ArrowRight,
  TrendingUp,
  Clock,
  UserPlus,
  Sparkles,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAdminOverviewData } from '@/app/actions/admin';
import { AdminStatsCharts } from '@/components/admin/AdminStatsCharts';
import { formatDate } from '@/lib/utils/formatDate';

export const metadata = {
  title: 'Admin Dashboard Overview | SaaS Portal',
  description: 'System-wide analytics, user management, and platform audit logs.',
};

export default async function AdminOverviewPage() {
  const { stats, latestLogs, recentUsers } = await getAdminOverviewData();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/50 dark:from-indigo-950/40 dark:via-slate-900/80 dark:to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-sm dark:shadow-xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="purple" className="text-[11px] py-0.5 font-semibold">
                <Sparkles className="w-3 h-3 mr-1 text-purple-600 dark:text-purple-400" /> Superadmin Console
              </Badge>
              <Badge variant="success" className="text-[11px] py-0.5 font-semibold">
                RLS Bypass Enabled
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Administrative Overview &amp; Control
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl">
              System-wide metrics across all customer tenants, user identity management, and real-time security audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/users">
              <Button size="sm" variant="primary" className="shadow-md">
                <Users className="w-3.5 h-3.5 mr-1.5" /> Manage Users
              </Button>
            </Link>
            <Link href="/admin/logs">
              <Button size="sm" variant="outline">
                <Database className="w-3.5 h-3.5 mr-1.5" /> Full Audit Log
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Registered Users</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {stats.totalUsers}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> All tenant profiles
          </div>
        </Card>

        <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Customer Accounts</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {stats.totalCustomers}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Active Tenant Scopes</p>
        </Card>

        <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:border-purple-400 dark:hover:border-purple-600 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Administrator Accounts</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {stats.totalAdmins}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Superuser Privileges</p>
        </Card>

        <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Platform Activity Events</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            {stats.totalLogs}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Audit Entries Captured</p>
        </Card>
      </div>

      {/* Recharts Interactive Charts Section */}
      <AdminStatsCharts />

      {/* Grid: Recent Users & Latest Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Recent Users */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm dark:shadow-xl">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Recently Registered Accounts
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Latest tenants synchronized into PostgreSQL
                </CardDescription>
              </div>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
                      {user.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={user.role === 'admin' ? 'purple' : 'info'}
                      className="text-[10px] capitalize"
                    >
                      {user.role}
                    </Badge>
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px]">
                        Inspect
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 2. Latest Audit Logs */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm dark:shadow-xl">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Live Platform Audit Stream
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time security telemetry and access events
                </CardDescription>
              </div>
              <Link href="/admin/logs">
                <Button variant="ghost" size="sm" className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">
                  Full Stream <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {latestLogs.map((log) => (
                <div
                  key={log.id}
                  className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                      <FileCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {log.action}
                      </div>
                      {log.description && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {log.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0 mt-0.5">
                    {formatDate(log.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Status Footer */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm dark:shadow-xl">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Platform Security &amp; Database Health: 100% Operational
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                PostgreSQL RLS Active • Next.js 14 SSR Middleware Protected • Zero Vulnerabilities
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> All Microservices Connected
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
