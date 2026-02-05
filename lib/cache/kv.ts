import { kv } from '@vercel/kv';

const DEFAULT_TTL = 900; // 15 minutes

export async function getCached<T>(key: string): Promise<T | null> {
  return kv.get<T>(key);
}

export async function setCached<T>(key: string, value: T, ttl = DEFAULT_TTL): Promise<void> {
  await kv.set(key, value, { ex: ttl });
}

export async function invalidateCache(key: string): Promise<void> {
  await kv.del(key);
}

export async function invalidatePattern(pattern: string): Promise<void> {
  const keys = await kv.keys(pattern);
  if (keys.length > 0) {
    await kv.del(...keys);
  }
}

export function campaignCacheKey(campaignId: number) {
  return `campaign:${campaignId}`;
}

export function audienceCacheKey(campaignId: number) {
  return `audience:${campaignId}`;
}

export function metricsCacheKey(campaignId: number) {
  return `metrics:${campaignId}`;
}
