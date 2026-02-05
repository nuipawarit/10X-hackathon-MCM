import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns, deployments, analytics } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { optimizeBudget } from '@/lib/ai/claude';

const optimizeSchema = z.object({
  campaignId: z.string().uuid(),
  optimizationGoal: z.enum(['roas', 'cpa', 'reach']).optional(),
  autoApply: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = optimizeSchema.parse(body);

    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, validated.campaignId))
      .limit(1);

    if (!campaign) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Campaign not found' } },
        { status: 404 }
      );
    }

    const platformMetrics = await db
      .select({
        platform: deployments.platform,
        allocatedBudget: deployments.allocatedBudget,
        spend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
        revenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
        conversions: sql<number>`COALESCE(SUM(${analytics.conversions}), 0)`,
      })
      .from(deployments)
      .leftJoin(analytics, eq(analytics.deploymentId, deployments.id))
      .where(eq(deployments.campaignId, validated.campaignId))
      .groupBy(deployments.platform, deployments.allocatedBudget);

    const platformData = platformMetrics.map((p) => {
      const spend = Number(p.spend) || 0;
      const revenue = Number(p.revenue) || 0;
      const conversions = Number(p.conversions) || 0;
      return {
        name: p.platform,
        currentAllocation: Number(p.allocatedBudget) || 0,
        roas: spend > 0 ? revenue / spend : 0,
        cpa: conversions > 0 ? spend / conversions : 0,
        spend,
        conversions,
      };
    });

    if (platformData.length === 0) {
      return NextResponse.json({
        data: {
          recommendationId: null,
          currentState: {
            totalBudget: Number(campaign.budget),
            allocations: [],
          },
          recommendations: [],
          expectedImpact: { roasChange: '0%', cpaChange: '0%' },
          message: 'No active deployments to optimize',
        },
      });
    }

    const result = await optimizeBudget({
      totalBudget: Number(campaign.budget),
      platforms: platformData,
      targetRoas: 3,
      targetCpa: 30,
    });

    const recommendationId = crypto.randomUUID();

    return NextResponse.json({
      data: {
        recommendationId,
        currentState: {
          totalBudget: Number(campaign.budget),
          allocations: platformData.map((p) => ({
            platform: p.name,
            budget: p.currentAllocation,
            roas: p.roas,
          })),
        },
        recommendations: result.recommendations,
        expectedImpact: result.expectedImpact,
        riskAssessment: result.riskAssessment,
        alerts: result.alerts,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }
    console.error('Error optimizing budget:', error);
    return NextResponse.json(
      { error: { code: 'AI_ERROR', message: 'Failed to optimize budget' } },
      { status: 500 }
    );
  }
}
