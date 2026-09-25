import { Sliders, ShieldCheck, Database, Server, Lock, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isSupabaseConfigured } from '@/lib/utils';

export default function AdminSettingsPage() {
  const isConfigured = isSupabaseConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System Configuration &amp; Security
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Review architecture parameters, database connectivity, and RLS enforcement status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supabase Status */}
        <Card className="border-purple-900/30 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Database Engine</h3>
                <p className="text-xs text-slate-400">Supabase PostgreSQL 15+</p>
              </div>
            </div>
            <Badge variant={isConfigured ? 'success' : 'warning'}>
              {isConfigured ? 'Connected' : 'Mock Dev Mode'}
            </Badge>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {isConfigured
              ? 'Supabase live credentials detected. Edge Middleware and SSR clients are communicating directly with your PostgreSQL database.'
              : 'Supabase credentials are placeholder values. Safe mock data and session storage are operating to allow frictionless local development.'}
          </p>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono text-slate-400">
            <span>Schema: 01_init.sql</span>
            <span className="text-emerald-400">RLS Active</span>
          </div>
        </Card>

        {/* Access Control & RBAC Policy */}
        <Card className="border-purple-900/30 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Access Control (RBAC)</h3>
                <p className="text-xs text-slate-400">Dual Tier RBAC Structure</p>
              </div>
            </div>
            <Badge variant="purple">Enforced</Badge>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Edge middleware validates tokens and checks assigned roles (<code>admin</code> vs <code>customer</code>). Any customer attempting to enter <code>/admin/*</code> is blocked with a 403 Forbidden redirection.
          </p>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono text-slate-400">
            <span>Security Function: is_admin()</span>
            <span className="text-purple-300">Security Definer</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
