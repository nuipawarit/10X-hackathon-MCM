import { kv } from '@vercel/kv';
import type { CampaignMetrics, Persona } from '@/types';

// Cache TTL constants (in seconds)
const TTL = {
  ANALYTICS: 300,      // 5 minutes
  PERSONAS: 3600,      // 1 hour
  CAMPAIGN: 600,       // 10 minutes
  RATE_LIMIT: 60,      // 1 minute
} as const;

// ============================================
// Analytics Cache
// ============================================

/**
 * Cache campaign analytics data
 */
export async function cacheAnalytics(
  campaignId: string,
  data: CampaignMetrics
): Promise<void> {
  await kv.set(`analytics:${campaignId}`, data, { ex: TTL.ANALYTICS });
}

/**
 * Get cached analytics data
 */
export async function getAnalytics(
  campaignId: string
): Promise<CampaignMetrics | null> {
  return await kv.get(`analytics:${campaignId}`);
}

/**
 * Invalidate analytics cache
 */
export async function invalidateAnalytics(campaignId: string): Promise<void> {
  await kv.del(`analytics:${campaignId}`);
}

// ============================================
// Persona Cache
// ============================================

/**
 * Cache persona data
 */
export async function cachePersonas(
  campaignId: string,
  personas: Persona[]
): Promise<void> {
  await kv.set(`personas:${campaignId}`, personas, { ex: TTL.PERSONAS });
}

/**
 * Get cached personas
 */
export async function getPersonas(
  campaignId: string
): Promise<Persona[] | null> {
  return await kv.get(`personas:${campaignId}`);
}

// ============================================
// Rate Limiting
// ============================================

/**
 * Check and update rate limit for AI endpoints
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string,
  limit: number = 10
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `ratelimit:${endpoint}:${userId}`;

  const current = await kv.incr(key);

  // Set expiry on first request
  if (current === 1) {
    await kv.expire(key, TTL.RATE_LIMIT);
  }

  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
  };
}

// ============================================
// Session Cache
// ============================================

/**
 * Store user session data
 */
export async function setSession(
  sessionId: string,
  data: Record<string, unknown>,
  ttl: number = 86400 // 24 hours
): Promise<void> {
  await kv.set(`session:${sessionId}`, data, { ex: ttl });
}

/**
 * Get session data
 */
export async function getSession(
  sessionId: string
): Promise<Record<string, unknown> | null> {
  return await kv.get(`session:${sessionId}`);
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await kv.del(`session:${sessionId}`);
}

// ============================================
// Generic Cache Helpers
// ============================================

/**
 * Get or set cache with automatic refresh
 */
export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  const cached = await kv.get<T>(key);

  if (cached !== null) {
    return cached;
  }

  const fresh = await fetcher();
  await kv.set(key, fresh, { ex: ttl });

  return fresh;
}

/**
 * Clear all cache for a campaign
 */
export async function clearCampaignCache(campaignId: string): Promise<void> {
  await Promise.all([
    kv.del(`analytics:${campaignId}`),
    kv.del(`personas:${campaignId}`),
    kv.del(`campaign:${campaignId}`),
  ]);
}
