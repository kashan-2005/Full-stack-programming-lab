'use client';
import { useState, useEffect, useCallback } from 'react';
import API from '@/lib/axios';

export function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(endpoint);
      setData(res.data.data || res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (!options.skip) fetchData();
  }, [fetchData, options.skip]);

  return { data, loading, error, refetch: fetchData };
}
