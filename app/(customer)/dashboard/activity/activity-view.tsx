'use client';

import * as React from 'react';
import {
  Activity,
  Search,
  FileCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ActivityLog } from '@/types/database';
import { formatDate } from '@/lib/utils/formatDate';

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
        (log.description && log.description.toLowerCase().includes(term))
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
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search activity events or action descriptions..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Badge variant="purple" className="text-xs py-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" />
            {filteredLogs.length} Total Events
          </Badge>
        </div>
      </div>

      {/* Main Activity Table or Empty State */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm dark:shadow-xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Audit Trail Stream
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time security log entries recorded for your tenant identity.
              </CardDescription>
            </div>
            <Badge variant="success" className="text-xs font-semibold">
              RLS Enforced
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {paginatedLogs.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
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
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-blue-500/10 border border-indigo-100 dark:border-blue-500/20 text-indigo-600 dark:text-blue-400 shrink-0 mt-0.5 sm:mt-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {log.action}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {log.description && (
                            <span className="text-[11px] text-slate-600 dark:text-slate-300">
                              {log.description}
                            </span>
                          )}
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ID: {log.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0 pl-11 sm:pl-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{formattedDate}</span>
                      <span className="text-slate-400 dark:text-slate-600">at</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{formattedTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 px-4 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
                <Inbox className="w-7 h-7 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Activity Logs Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchTerm
                  ? `No security actions match "${searchTerm}". Check the spelling or clear the filter.`
                  : 'No account activities have been recorded yet.'}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Page {currentPage} of {totalPages} ({filteredLogs.length} total)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="text-xs"
                >
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
