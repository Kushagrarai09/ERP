import { useCallback, useEffect, useState } from 'react';
import { ApiError, api } from '../lib/api';

export function useApiResource<T>(path: string, enabled = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<ApiError | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      setData(await api.get<T>(path));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : new ApiError('Unable to load data', 0));
    } finally {
      setLoading(false);
    }
  }, [enabled, path]);

  useEffect(() => { void reload(); }, [reload]);

  return { data, loading, error, empty: !loading && Array.isArray(data) && data.length === 0, reload };
}