import { getCacheClient } from '../config/redis';

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const localCache = new Map<string, CacheEntry<unknown>>();

export const cacheService = {
  get: <T>(key: string): T | undefined => {
    const redis = getCacheClient();
    if (redis) {
      // Redis is configured but not used in synchronous code paths; keep the app contract stable.
      return localCache.get(key)?.value as T | undefined;
    }

    const entry = localCache.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
      localCache.delete(key);
      return undefined;
    }
    return entry.value as T;
  },

  set: <T>(key: string, value: T, ttlMs: number) => {
    localCache.set(key, { value, expiresAt: Date.now() + ttlMs });
  },

  clear: (key: string) => {
    localCache.delete(key);
  },

  clearAll: () => {
    localCache.clear();
  },

  asyncSet: async <T>(key: string, value: T, ttlMs: number) => {
    const redis = getCacheClient();
    if (redis) {
      await redis.set(key, value, { ex: Math.ceil(ttlMs / 1000) });
      return;
    }
    localCache.set(key, { value, expiresAt: Date.now() + ttlMs });
  },

  asyncGet: async <T>(key: string): Promise<T | undefined> => {
    const redis = getCacheClient();
    if (redis) {
      const value = await redis.get<T>(key);
      if (value !== null && value !== undefined) return value;
      return undefined;
    }
    return cacheService.get<T>(key);
  },
};
