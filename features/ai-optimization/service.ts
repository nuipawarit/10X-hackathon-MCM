import { db } from '@/lib/db';
import { analytics, optimizationLogs, deployments } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { optimizeBudget } from '@/lib/ai/claude';
import type { PlatformMetrics } from './types';

export async function getCampaignMetrics(campaignId: string): Promise<PlatformMetrics[]> {
  const rows = await db
    .select({
      platform: analytics.platform,
      impressions: sql<number>`sum(${analytics.impressions})::int`,
      clicks: sql<number>`sum(${analytics.clicks})::int`,
      conversions: sql<number>`sum(${analytics.conversions})::int`,
      spend: sql<number>`sum(${analytics.spend}::numeric)::float`,
      revenue: sql<number>`sum(${analytics.revenue}::numeric)::float`,
    })
    .from(analytics)
    .where(eq(analytics.campaignId, campaignId))
    .groupBy(analytics.platform);

  return rows.filter((row) => row.platform !== null).map((row) => ({
    platform: row.platform!,
    impressions: row.impressions,
    clicks: row.clicks,
    conversions: row.conversions,
    spend: row.spend,
    revenue: row.revenue,
    cpa: row.conversions > 0 ? row.spend / row.conversions : 0,
    ctr: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : 0,
    roas: row.spend > 0 ? row.revenue / row.spend : 0,
  }));
}

export async function runOptimization(campaignId: string) {
  const metrics = await getCampaignMetrics(campaignId);

  const totalBudget = metrics.reduce((sum, m) => sum + m.spend, 0);

  const result = await optimizeBudget({
    name: `Campaign ${campaignId}`,
    totalBudget,
    platforms: metrics.map((m) => ({
      platform: m.platform,
      spend: m.spend,
      revenue: m.revenue,
      conversions: m.conversions,
    })),
    goal: 'maximize_roas',
  });

  for (const rec of result.recommendations) {
    await db.insert(optimizationLogs).values({
      campaignId,
      recommendationId: rec.id,
      action: rec.action,
      platform: rec.platform,
      previousBudget: String(rec.previousBudget),
      newBudget: String(rec.newBudget),
      reasoning: rec.reasoning,
      applied: false,
    });
  }

  return result;
}

export async function applyRecommendation(campaignId: string, recommendationId: string) {
  const log = await db.query.optimizationLogs.findFirst({
    where: eq(optimizationLogs.recommendationId, recommendationId),
  });

  if (!log) throw new Error('Recommendation not found');
  if (log.applied) throw new Error('Already applied');

  await db.update(optimizationLogs)
    .set({ applied: true, appliedAt: new Date() })
    .where(eq(optimizationLogs.id, log.id));

  const campaignDeployments = await db.query.deployments.findMany({
    where: eq(deployments.campaignId, campaignId),
  });

  const deployment = campaignDeployments.find((d) => d.platform === log.platform);
  if (deployment) {
    await db.update(deployments)
      .set({ budget: log.newBudget ?? '0', updatedAt: new Date() })
      .where(eq(deployments.id, deployment.id));
  }

  return { success: true, applied: log };
}
