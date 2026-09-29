'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CustomerProfile } from '@/types';

interface UseUserReturn {
  user: CustomerProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/profile');
      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        throw new Error(errorJson?.error?.message || `HTTP Error ${res.status}`);
      }
      const json = await res.json();
      setUser(json.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
