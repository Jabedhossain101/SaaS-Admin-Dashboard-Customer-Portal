'use client';

import * as React from 'react';
import {
  Activity,
  Search,
  FileCheck,
  ShieldAlert,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ActivityLog } from '@/types/database';

interface ActivityViewProps {
  logs: ActivityLog[];
}

export function ActivityView({ logs }: ActivityViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  // Filter logs by search term
  const filteredLogs = React.useMemo(() => {
    if (!searchTerm.trim()) return logs;
    const term = searchTerm.toLowerCase();
    return logs.filter(
      (log) =>
        log.action.toLowerCase().includes(term) ||
        (log.ip_address && log.ip_address.toLowerCase().includes(term))
    );
  }, [logs, searchTerm]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search activity events, keywords, or IP..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Badge variant="purple" className="text-xs py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" />
            {filteredLogs.length} Total Events
          </Badge>
        </div>
      </div>

      {/* Main Activity Table or Empty State */}
      <Card className="border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Audit Trail Stream
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Real-time security log entries recorded for your tenant identity.
              </CardDescription>
            </div>
            <Badge variant="success">RLS Enforced</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {paginatedLogs.length > 0 ? (
            <div className="divide-y divide-slate-800/60">
              {paginatedLogs.map((log) => {
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
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5 sm:mt-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-white truncate">
                          {log.action}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] text-slate-400 font-mono">
                            ID: {log.id.slice(0, 8)}...
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
            /* Empty State Component */
            <div className="py-16 px-4 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
                <Inbox className="w-7 h-7 text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-white">No Activity Logs Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchTerm
                  ? `No activity events match "${searchTerm}". Try searching for another keyword.`
                  : 'There are currently no logged actions for your tenant. Future session and profile updates will show here.'}
              </p>
            </div>
          )}
        </CardContent>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page <strong className="text-white">{currentPage}</strong> of{' '}
              <strong className="text-white">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
