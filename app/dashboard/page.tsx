import Link from 'next/link';
import { ArrowLeft, User, Activity, Clock, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isSupabaseConfigured } from '@/lib/utils';

export default function DashboardPage() {
  const isConfigured = isSupabaseConfigured();

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to System Overview
        </Link>
        <Badge variant="info">Customer Workspace</Badge>
      </div>

      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Customer Portal Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Welcome to your customer portal. Row Level Security guarantees data isolation for your tenant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Account Identity</CardTitle>
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {isConfigured ? 'Live Session' : 'Guest / Mock User'}
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Role: <span className="text-blue-400 font-semibold">customer</span>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Database Guard</CardTitle>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">RLS Enforced</div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Scoped to <code className="text-slate-400">auth.uid() = id</code>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">Audit Status</CardTitle>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 mt-2">Active</div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Table: <code className="text-slate-400">public.activity_logs</code>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
