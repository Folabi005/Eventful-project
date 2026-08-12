import { Redis } from '@upstash/redis';
import { env } from './env';

export const redis = env.redisUrl && env.redisToken
  ? new Redis({
      url: env.redisUrl,
      token: env.redisToken,
    })
  : null;

export function hasRedisConfig() {
  return Boolean(env.redisUrl && env.redisToken);
}

export function getCacheClient() {
  return redis;
}
