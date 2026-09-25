import { Database, Clock, ShieldCheck, Sparkles, Inbox } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminLogsList } from '@/app/actions/admin';

export default async function AdminLogsPage() {
  const logs = await getAdminLogsList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System-Wide Audit Logs
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Global real-time telemetry and audit stream across all tenants.
          </p>
        </div>
        <Badge variant="purple" className="self-start sm:self-auto text-xs py-1">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" />
          {logs.length} System Records
        </Badge>
      </div>

      <Card className="border-purple-900/30 bg-slate-900/60 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                Audit Trail Stream
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Records from public.activity_logs evaluated without tenant isolation filters.
              </CardDescription>
            </div>
            <Badge variant="purple">Universal Scope</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {logs.length > 0 ? (
            <div className="divide-y divide-slate-800/60">
              {logs.map((log) => {
                const dateObj = new Date(log.created_at);
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const formattedTime = dateObj.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <div
                    key={log.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-white truncate">
                          {log.action}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] text-slate-400 font-mono">
                            User ID: {log.user_id ? `${log.user_id.slice(0, 8)}...` : 'System'}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            IP: {log.ip_address || '127.0.0.1'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0 pl-11 sm:pl-0">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formattedDate}</span>
                      <span className="text-slate-600">at</span>
                      <span className="text-slate-300">{formattedTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <Inbox className="w-8 h-8 mx-auto text-slate-500 mb-2" />
              <p className="text-xs">No audit logs recorded yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
