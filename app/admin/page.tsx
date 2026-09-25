import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Users, Database, Terminal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to System Overview
        </Link>
        <Badge variant="purple">Admin Workspace</Badge>
      </div>

      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-purple-400" />
          Admin Control Center
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Full elevated privileges across all profiles, activity logs, and global SaaS management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Total Tenants / Users</CardTitle>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">All Profiles Access</div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Evaluates <code className="text-purple-300">is_admin() = true</code>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Global Activity Log</CardTitle>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-400 mt-2">System-wide Scope</div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Unrestricted audit query access
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Security Policies</CardTitle>
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">PostgreSQL RLS</div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Migration <code className="text-slate-400">01_init.sql</code> loaded
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
