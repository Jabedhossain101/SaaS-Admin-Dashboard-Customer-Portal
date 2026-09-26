import Link from 'next/link';
import {
  ShieldCheck,
  Database,
  Server,
  Layers,
  Lock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Users,
  ArrowRight,
  Terminal,
  Cpu,
  Sparkles,
  Zap,
  BarChart3,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { isSupabaseConfigured } from '@/lib/utils';

export default function HomePage() {
  const supabaseActive = isSupabaseConfigured();

  const techStack = [
    { name: 'Next.js 14+ (App Router)', version: 'Server Components & SSR', badge: 'info' as const, icon: Server },
    { name: 'TypeScript', version: 'Strict Mode Zero Any', badge: 'info' as const, icon: Cpu },
    { name: 'Tailwind CSS & next-themes', version: 'Light & Dark Mode', badge: 'purple' as const, icon: Layers },
    { name: '@supabase/ssr', version: 'Cookie Session Auth', badge: 'success' as const, icon: Database },
    { name: 'Row-Level Security (RLS)', version: 'PostgreSQL Database Isolation', badge: 'success' as const, icon: Lock },
    { name: 'Recharts & Lucide', version: 'Interactive Admin Analytics', badge: 'purple' as const, icon: BarChart3 },
  ];

  const quickNav = [
    {
      title: 'Customer Portal',
      description: 'Customer workspace with profile management, subscription status, and paginated activity logs.',
      href: '/dashboard',
      role: 'Customer Role',
      icon: Users,
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
      tag: 'Role: customer',
    },
    {
      title: 'Admin Control Center',
      description: 'Privileged admin panel with Recharts statistics, user management, audit trails, and settings.',
      href: '/admin',
      role: 'Admin Role',
      icon: ShieldCheck,
      color: 'from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
      tag: 'Role: admin',
    },
    {
      title: 'Authentication & Session',
      description: 'SSR-compatible authentication with login, registration, and password recovery.',
      href: '/login',
      role: 'Public / Auth',
      icon: Lock,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
      tag: 'Auth Flow',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                SaaS Portal
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                v1.0 Production
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md text-xs font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero Header */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-200 dark:border-indigo-900/40 bg-gradient-to-b from-indigo-50/70 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900/40 dark:to-slate-950 p-8 sm:p-12 backdrop-blur-xl shadow-lg dark:shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="purple" className="px-3 py-1 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" />
                  Production Ready SaaS Architecture
                </Badge>
                <Badge variant={supabaseActive ? 'success' : 'warning'} className="px-3 py-1 text-xs font-semibold">
                  {supabaseActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                      Supabase PostgreSQL Active
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />
                      Safe Fallback Mode Active
                    </>
                  )}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                SaaS Admin Dashboard &amp;{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Customer Portal
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                Full-stack multi-tenant platform engineered with Next.js App Router, Supabase SSR,
                PostgreSQL Row Level Security (RLS), and seamless Dark/Light mode.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Link href="/login">
                <Button size="lg" className="w-full justify-between bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                  <span>Enter Application</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="w-full justify-between border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span>Superadmin Portal</span>
                  <ShieldCheck className="w-4 h-4 ml-2 text-purple-600 dark:text-purple-400" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* System Status Banner */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 p-5 flex items-start gap-4 shadow-sm">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Application Framework</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">Next.js 14+ App Router</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational &amp; SSR Ready
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 p-5 flex items-start gap-4 shadow-sm">
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Database Layer</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {supabaseActive ? 'Supabase Postgres Connected' : 'Mock/Safe Dev Mode Active'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Schema: <code className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">01_init.sql</code>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 p-5 flex items-start gap-4 shadow-sm">
            <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Access Control &amp; RBAC</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">Role-Based RLS Policies</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Scopes: <span className="text-purple-600 dark:text-purple-400 font-semibold">Admin</span> &amp; <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Customer</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Routes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Portal Navigation &amp; Workspaces
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Complete &amp; Interactive</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickNav.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="group relative flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} border`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="text-[11px] font-semibold">
                        {item.tag}
                      </Badge>
                    </div>

                    <CardHeader className="p-0">
                      <CardTitle className="text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </div>

                  <CardContent className="p-0 pt-6">
                    <Link href={item.href}>
                      <Button variant="outline" size="sm" className="w-full justify-between group-hover:bg-slate-100 dark:group-hover:bg-slate-800 font-semibold text-xs">
                        <span>Launch Workspace</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Tech Stack Specs */}
        <section className="space-y-4" id="architecture">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Engineering Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 p-4 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{tech.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{tech.version}</div>
                    </div>
                  </div>
                  <Badge variant={tech.badge} className="text-[10px]">
                    Verified
                  </Badge>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} SaaS Admin Dashboard &amp; Customer Portal. Built strictly to SRS specs.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Customer Portal
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Admin Console
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
