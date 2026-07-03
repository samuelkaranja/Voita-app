import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'voita_route_cache';

export interface CachedRoute {
  destination: {
    text: string;
    latitude: number;
    longitude: number;
  };
  normalRouteCoords: { latitude: number; longitude: number }[];
  normalRouteInfo: {
    distance: string | null;
    duration: string | null;
  };
  cachedAt: number;
}

export function useRouteCache(userPhone?: string | null) {
  // Scope cache per user if logged in
  const key = userPhone ? `${CACHE_KEY}_${userPhone}` : CACHE_KEY;

  const saveCache = useCallback(
    async (data: Omit<CachedRoute, 'cachedAt'>) => {
      try {
        const payload: CachedRoute = { ...data, cachedAt: Date.now() };
        await AsyncStorage.setItem(key, JSON.stringify(payload));
        console.log('✅ Route cached');
      } catch (err) {
        console.warn('Failed to cache route:', err);
      }
    },
    [key],
  );

  const loadCache = useCallback(async (): Promise<CachedRoute | null> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;

      const parsed: CachedRoute = JSON.parse(raw);

      // Cache expires after 24 hours — route may have changed
      const AGE_LIMIT_MS = 24 * 60 * 60 * 1000;
      if (Date.now() - parsed.cachedAt > AGE_LIMIT_MS) {
        await AsyncStorage.removeItem(key);
        console.log('🗑 Route cache expired');
        return null;
      }

      console.log('📦 Route cache loaded');
      return parsed;
    } catch (err) {
      console.warn('Failed to load route cache:', err);
      return null;
    }
  }, [key]);

  const clearCache = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.warn('Failed to clear route cache:', err);
    }
  }, [key]);

  return { saveCache, loadCache, clearCache };
}
