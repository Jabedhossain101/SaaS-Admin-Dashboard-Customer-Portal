import * as React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Mail,
  Calendar,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  KeyRound,
  Zap,
} from 'lucide-react';
import { getCustomerData } from '@/app/actions/customer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/formatDate';

export const metadata = {
  title: 'Account & Subscription | SaaS Portal',
  description: 'View your account status, active subscription plan, and security settings.',
};

export default async function AccountPage() {
  const { profile, stats } = await getCustomerData();

  const isSuspended = profile.status === 'suspended';
  const isPending = profile.status === 'pending';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account &amp; Security Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Review your account credentials, workspace subscription tier, and tenant isolation status.
        </p>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details Card */}
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm dark:shadow-xl">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Account Identification
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Core tenant identity managed through Supabase Auth &amp; PostgreSQL RLS.
                </CardDescription>
              </div>
              <Badge
                variant={isSuspended ? 'destructive' : isPending ? 'warning' : 'success'}
                className="capitalize text-xs font-semibold"
              >
                {stats.accountStatus}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Primary Email */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  Primary Auth Email
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {profile.email}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified by Auth Provider
                </div>
              </div>

              {/* Unique Tenant ID */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                  <KeyRound className="w-4 h-4 text-purple-500" />
                  Account UUID / Principal
                </div>
                <div className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate">
                  {profile.id}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  PostgreSQL Foreign Key Reference
                </div>
              </div>

              {/* Created At */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Member Since
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatDate(profile.createdAt)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Initial registration timestamp
                </div>
              </div>

              {/* Security Level */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                  <Database className="w-4 h-4 text-amber-500" />
                  Data Security Model
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  Row-Level Security (RLS)
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  Enforced at Database Layer
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Need to change your name or update password?
              </div>
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  Edit Profile &amp; Password <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Plan & Subscription Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm dark:shadow-xl flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Subscription Plan
                </CardTitle>
                <Badge variant="purple" className="capitalize text-xs font-semibold">
                  {profile.plan}
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current tenant limits and features
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20">
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                  Active Tier
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 capitalize">
                  {profile.plan} Tier
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                  Includes full access to Customer Portal, REST API integrations, and 99.9% uptime SLA.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Unlimited API calls with bearer authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time session audit logging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>PostgreSQL row-level isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>24/7 Enterprise customer support</span>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="p-6 pt-0">
            <Link href="/dashboard/activity">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md text-xs font-semibold gap-2">
                <Zap className="w-4 h-4" /> View Account Activity Logs
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Security & Access Section */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm dark:shadow-xl">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Security &amp; Tenant Compliance
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Strict compliance standards enforced on your customer account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">SOC-2 Type II Certified</div>
              <p className="text-slate-500 dark:text-slate-400">
                All data in transit is encrypted with TLS 1.3 and at rest with AES-256.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">Row-Level Security (RLS)</div>
              <p className="text-slate-500 dark:text-slate-400">
                Supabase PostgreSQL RLS policies guarantee cross-tenant isolation.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">Automated Session Refresh</div>
              <p className="text-slate-500 dark:text-slate-400">
                Next.js Middleware validates JWT sessions on every authenticated request.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
