'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ActivityLog, PaginationMeta } from '@/types';

interface UseActivityOptions {
  search?: string;
  page?: number;
  limit?: number;
}

interface UseActivityReturn {
  logs: ActivityLog[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useActivity(options: UseActivityOptions = {}): UseActivityReturn {
  const { search = '', page = 1, limit = 10 } = options;
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`/api/activity?${params.toString()}`);
      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.error?.message || `HTTP Error ${res.status}`);
      }
      const json = await res.json();
      setLogs(json.data || []);
      setMeta(json.meta || null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch activity logs';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    meta,
    loading,
    error,
    refetch: fetchLogs,
  };
}
