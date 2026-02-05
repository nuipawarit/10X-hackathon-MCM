import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campaigns, analytics, deployments } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { optimizeBudget } from '@/lib/ai/claude';
import { optimizeBudgetSchema } from '@/lib/validations/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = optimizeBudgetSchema.parse(body);

    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, validated.campaignId));

    if (!campaign) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Campaign not found' } },
        { status: 404 }
      );
    }

    const platformMetrics = await db
      .select({
        platform: analytics.platform,
        totalSpend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
        totalRevenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
        totalConversions: sql<number>`COALESCE(SUM(${analytics.conversions}), 0)`,
      })
      .from(analytics)
      .where(eq(analytics.campaignId, validated.campaignId))
      .groupBy(analytics.platform);

    const result = await optimizeBudget({
      name: campaign.name,
      totalBudget: Number(campaign.budget),
      platforms: platformMetrics.map((m) => ({
        platform: m.platform || 'unknown',
        spend: Number(m.totalSpend),
        revenue: Number(m.totalRevenue),
        conversions: Number(m.totalConversions),
      })),
      goal: validated.optimizationGoal,
    });

    return NextResponse.json({
      data: {
        campaignId: validated.campaignId,
        recommendations: result.recommendations,
        projectedMetrics: result.projectedMetrics,
      },
    });
  } catch (error) {
    console.error('Budget optimization error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to optimize budget' } },
      { status: 500 }
    );
  }
}
