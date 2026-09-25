import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-purple-600/15 blur-3xl pointer-events-none rounded-full" />

      {/* Top Brand Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Overview
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
          <ShieldCheck className="w-4 h-4" /> SaaS Portal Auth
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full max-w-md z-10">{children}</div>

      <div className="mt-8 text-center text-xs text-slate-500 z-10">
        Protected by Supabase SSR &amp; PostgreSQL Row Level Security
      </div>
    </div>
  );
}
