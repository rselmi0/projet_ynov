import { useState, useEffect, useCallback } from 'react';
import { cache } from '@/lib/storage';

// Simple hook for cache
export const useSimpleCache = <T>(key: string) => {
  const [data, setData] = useState<T | null>(() => {
    return cache.get<T>(key);
  });

  const updateData = (newData: T) => {
    cache.set(key, newData);
    setData(newData);
  };

  const clearData = () => {
    cache.remove(key);
    setData(null);
  };

  return {
    data,
    setData: updateData,
    clearData,
  };
}; 