import Link from 'next/link';
import {
  ShieldCheck,
  Database,
  Server,
  Layers,
  Lock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Activity,
  Users,
  ArrowRight,
  Terminal,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured } from '@/lib/utils';

export default function HomePage() {
  const supabaseActive = isSupabaseConfigured();

  const techStack = [
    { name: 'Next.js 15', version: 'App Router', badge: 'info', icon: Server },
    { name: 'TypeScript', version: 'Strict Mode', badge: 'info', icon: Cpu },
    { name: 'Tailwind CSS', version: 'v4 Styling', badge: 'purple', icon: Layers },
    { name: '@supabase/ssr', version: 'Server & Client', badge: 'success', icon: Database },
    { name: 'Row Level Security', version: 'Postgres RLS', badge: 'success', icon: Lock },
    { name: 'RBAC Architecture', version: 'Admin & Customer', badge: 'purple', icon: ShieldCheck },
  ];

  const quickNav = [
    {
      title: 'Customer Portal',
      description: 'Customer workspace with profile management, resource usage, and activity logs.',
      href: '/dashboard',
      role: 'Customer Role',
      icon: Users,
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      tag: 'Role: customer',
    },
    {
      title: 'Admin Control Center',
      description: 'Privileged admin panel for user management, system audit logs, and global analytics.',
      href: '/admin',
      role: 'Admin Role',
      icon: ShieldCheck,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      tag: 'Role: admin',
    },
    {
      title: 'Authentication & Session',
      description: 'SSR-compatible authentication with login, registration, and magic link support.',
      href: '/login',
      role: 'Public / Auth',
      icon: Lock,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
      tag: 'Auth Flow',
    },
  ];

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-950 p-8 sm:p-12 backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="purple" className="px-3 py-1 text-xs">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" />
                Production Baseline Initialized
              </Badge>
              <Badge variant={supabaseActive ? 'success' : 'warning'} className="px-3 py-1 text-xs">
                {supabaseActive ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Supabase Live Connected
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    Safe Fallback Mode Active
                  </>
                )}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              SaaS Admin Dashboard & <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Customer Portal</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Full-stack multi-tenant foundation engineered with Next.js 15 App Router, Supabase SSR,
              PostgreSQL Row Level Security (RLS), and fail-safe environment resilience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link href="/login">
              <Button size="lg" className="w-full justify-between">
                <span>Access Portal</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a
              href="#architecture"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 border border-slate-700 hover:bg-slate-800/60 text-slate-300 hover:text-white text-sm px-4 py-2 h-10"
            >
              <Terminal className="w-4 h-4 mr-2 text-slate-400" />
              View Architecture
            </a>
          </div>
        </div>
      </section>

      {/* System Status Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Server Engine</div>
            <div className="text-sm font-semibold text-white mt-0.5">Next.js 15.2 (Turbopack Ready)</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Operational (Port 3000)
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Database Layer</div>
            <div className="text-sm font-semibold text-white mt-0.5">
              {supabaseActive ? 'Supabase Postgres Connected' : 'Mock/Safe Dev Mode'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Schema: <code className="text-slate-300 bg-slate-800/80 px-1 py-0.5 rounded">01_init.sql</code>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Access Control</div>
            <div className="text-sm font-semibold text-white mt-0.5">Role-Based RLS Policies</div>
            <div className="text-xs text-slate-400 mt-1">
              Dual scopes: <span className="text-purple-300">Admin</span> &amp; <span className="text-blue-300">Customer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Routes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Portal Navigation &amp; Workspaces
          </h2>
          <span className="text-xs text-slate-400">Phase 1 Baseline Ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickNav.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="group relative flex flex-col justify-between hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} border`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-[11px]">
                      {item.tag}
                    </Badge>
                  </div>

                  <CardHeader className="p-0">
                    <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-400 mt-2 leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{item.role}</span>
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Open View <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="space-y-4" id="architecture">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          Configured Stack &amp; Libraries
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 flex flex-col items-center text-center space-y-2 hover:bg-slate-800/40 transition-colors"
              >
                <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold text-white">{tech.name}</div>
                <div className="text-[11px] text-slate-400">{tech.version}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Database Schema & Migration Guide */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Database Architecture (SQL Migration Ready)
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              File: <code className="text-blue-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">supabase/migrations/01_init.sql</code>
            </p>
          </div>
          <Badge variant="success">PostgreSQL 15+ Schema</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-white">public.profiles</span>
              <Badge variant="outline">Extends auth.users</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Stores user metadata including role (<code>admin</code> | <code>customer</code>), avatar URL, full name, and automatic timestamps.
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-1">
              RLS: Self-read/update for customers, universal read/write for admins.
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-white">public.activity_logs</span>
              <Badge variant="outline">Audit Trail</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Captures user actions, client IP addresses, and timestamps with automatic indexing for high performance.
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-1">
              RLS: Isolated user log access + elevated admin auditing.
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/80 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-mono text-slate-300">
              Run Supabase CLI or execute <span className="text-emerald-400">01_init.sql</span> in your Supabase SQL Editor.
            </span>
          </div>
          <a
            href="https://supabase.com/docs/guides/database"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Supabase Documentation <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>
    </main>
  );
}
