import { Loader2, ShieldCheck } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="flex-1 min-h-[85vh] flex flex-col items-center justify-center p-4 space-y-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 animate-pulse">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin absolute -bottom-2 -right-2 bg-slate-950 rounded-full p-0.5" />
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-sm font-semibold text-white tracking-tight">
          Loading Workspace...
        </h3>
        <p className="text-xs text-slate-400">
          Verifying security credentials &amp; Row Level Security policies
        </p>
      </div>
    </div>
  );
}
