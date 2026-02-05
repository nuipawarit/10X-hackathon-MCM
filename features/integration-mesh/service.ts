import { db } from '@/lib/db';
import { platformConnections, deployments } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { PLATFORM_CONFIGS } from './types';
import type { PlatformConnectionStatus, DeploymentRequest } from './types';

export async function getPlatformStatuses(userId: string): Promise<PlatformConnectionStatus[]> {
  const connections = await db.query.platformConnections.findMany({
    where: eq(platformConnections.userId, userId),
  });

  return PLATFORM_CONFIGS.map((config) => {
    const connection = connections.find((c) => c.platform === config.name);
    return {
      platform: config.name,
      displayName: config.displayName,
      status: connection?.status as PlatformConnectionStatus['status'] ?? 'not_connected',
      accountId: connection?.accountId ?? undefined,
      lastSynced: connection?.lastSyncAt ?? undefined,
    };
  });
}

export async function connectPlatform(userId: string, platform: string, accountId: string, accessToken: string) {
  const existing = await db.query.platformConnections.findFirst({
    where: and(
      eq(platformConnections.userId, userId),
      eq(platformConnections.platform, platform),
    ),
  });

  if (existing) {
    return db.update(platformConnections)
      .set({ accountId, accessToken, status: 'active', lastSyncAt: new Date() })
      .where(eq(platformConnections.id, existing.id))
      .returning();
  }

  return db.insert(platformConnections).values({
    userId,
    platform,
    accountId,
    accessToken,
    status: 'active',
  }).returning();
}

export async function createDeployments(request: DeploymentRequest) {
  const results = [];

  for (const adSet of request.adSets) {
    for (const platformConfig of adSet.platforms) {
      for (const creativeId of adSet.creativeIds) {
        const [deployment] = await db.insert(deployments).values({
          campaignId: request.campaignId,
          creativeId,
          platform: platformConfig.platform,
          budget: String(platformConfig.budget),
          status: 'pending',
          estimatedReach: `${Math.floor(platformConfig.budget * 100)}`,
        }).returning();
        results.push(deployment);
      }
    }
  }

  return results;
}
