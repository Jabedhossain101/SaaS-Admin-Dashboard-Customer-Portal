import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-blue-500/10 to-purple-500/15 blur-3xl pointer-events-none rounded-full" />

      {/* Top Brand Link & Theme Toggle */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Overview
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-4 h-4" /> SaaS Auth
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full max-w-md z-10">{children}</div>

      <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 z-10">
        Protected by Supabase SSR &amp; PostgreSQL Row Level Security
      </div>
    </div>
  );
}
