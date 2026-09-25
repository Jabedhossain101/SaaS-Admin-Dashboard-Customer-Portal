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

export default async function AdminOverviewPage() {
  const { stats, latestLogs, recentUsers } = await getAdminOverviewData();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/40 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="purple" className="text-[11px] py-0.5">
                <Sparkles className="w-3 h-3 mr-1 text-purple-400" /> Superadmin Console
              </Badge>
              <Badge variant="success" className="text-[11px] py-0.5">
                RLS Bypass Enabled
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-purple-400" />
              Administrative Overview &amp; Control
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              System-wide metrics across all customer tenants, user identity management, and real-time security audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/users">
              <Button size="sm" variant="primary">
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
        <Card className="p-5 border-purple-900/30 bg-slate-900/50 hover:border-purple-800/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Registered Users</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {stats.totalUsers}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> All tenant profiles
          </div>
        </Card>

        <Card className="p-5 border-purple-900/30 bg-slate-900/50 hover:border-purple-800/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Customer Accounts</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            {stats.totalCustomers}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tenant Scoped</p>
        </Card>

        <Card className="p-5 border-purple-900/30 bg-slate-900/50 hover:border-purple-800/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Administrator Accounts</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2">
            {stats.totalAdmins}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Full Elevated Tier</p>
        </Card>

        <Card className="p-5 border-purple-900/30 bg-slate-900/50 hover:border-purple-800/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total System Events</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-400 mt-2">
            {stats.totalLogs}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Recorded audit entries</p>
        </Card>
      </div>

      {/* Main Grid: User Summary + System Log Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registered Users */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-400" /> Recent Tenant Profiles
            </h2>
            <Link
              href="/admin/users"
              className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors"
            >
              Manage All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="border-slate-800/80 bg-slate-900/40 divide-y divide-slate-800/60 overflow-hidden">
            {recentUsers.map((user) => {
              const initials = user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={user.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {user.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant={user.role === 'admin' ? 'purple' : 'info'}
                      className="text-[10px] capitalize"
                    >
                      {user.role}
                    </Badge>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-xs text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Real-time Audit Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Latest System Events
            </h2>
            <Link
              href="/admin/logs"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Live Feed
            </Link>
          </div>

          <Card className="border-slate-800/80 bg-slate-900/40 divide-y divide-slate-800/60">
            {latestLogs.map((log) => {
              const timeString = new Date(log.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={log.id} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate max-w-[200px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {timeString}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>IP: {log.ip_address || '127.0.0.1'}</span>
                    <span className="text-emerald-400 text-[10px]">Logged</span>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
