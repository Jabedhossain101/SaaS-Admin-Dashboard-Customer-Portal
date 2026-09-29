'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AdminUserRow, PaginationMeta } from '@/types';

interface UseUsersOptions {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface UseUsersReturn {
  users: AdminUserRow[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUsers(options: UseUsersOptions = {}): UseUsersReturn {
  const { search = '', role = 'all', status = 'all', page = 1, limit = 10 } = options;
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        search,
        role,
        status,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.error?.message || `HTTP Error ${res.status}`);
      }
      const json = await res.json();
      setUsers(json.data || []);
      setMeta(json.meta || null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [search, role, status, page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    meta,
    loading,
    error,
    refetch: fetchUsers,
  };
}
