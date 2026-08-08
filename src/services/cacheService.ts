type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export const cacheService = {
  get: <T>(key: string): T | undefined => {
    const entry = cache.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
      cache.delete(key);
      return undefined;
    }
    return entry.value as T;
  },

  set: <T>(key: string, value: T, ttlMs: number) => {
    cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  },

  clear: (key: string) => {
    cache.delete(key);
  },
};
