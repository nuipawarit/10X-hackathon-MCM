import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns, analytics, deployments, audiences } from '@/lib/db';
import { eq, sql, and, gte, lte } from 'drizzle-orm';
import { z } from 'zod';

const updateCampaignSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  objective: z.enum(['awareness', 'consideration', 'conversion']).optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
  budget: z.number().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7';

    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1);

    if (!campaign) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Campaign not found' } },
        { status: 404 }
      );
    }

    const metricsResult = await db
      .select({
        impressions: sql<number>`COALESCE(SUM(${analytics.impressions}), 0)`,
        clicks: sql<number>`COALESCE(SUM(${analytics.clicks}), 0)`,
        conversions: sql<number>`COALESCE(SUM(${analytics.conversions}), 0)`,
        spend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
        revenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
      })
      .from(analytics)
      .innerJoin(deployments, eq(analytics.deploymentId, deployments.id))
      .where(eq(deployments.campaignId, id));

    const metrics = metricsResult[0];
    const spend = Number(metrics.spend) || 0;
    const revenue = Number(metrics.revenue) || 0;
    const conversions = Number(metrics.conversions) || 0;
    const clicks = Number(metrics.clicks) || 0;
    const impressions = Number(metrics.impressions) || 0;

    const trendData = await db
      .select({
        date: analytics.date,
        roas: sql<number>`COALESCE(AVG(${analytics.roas}::numeric), 0)`,
        spend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
        conversions: sql<number>`COALESCE(SUM(${analytics.conversions}), 0)`,
      })
      .from(analytics)
      .innerJoin(deployments, eq(analytics.deploymentId, deployments.id))
      .where(eq(deployments.campaignId, id))
      .groupBy(analytics.date)
      .orderBy(analytics.date);

    const personasCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(audiences)
      .where(eq(audiences.campaignId, id));

    const deploymentsData = await db
      .select({
        platform: deployments.platform,
        status: deployments.status,
        allocatedBudget: deployments.allocatedBudget,
      })
      .from(deployments)
      .where(eq(deployments.campaignId, id));

    return NextResponse.json({
      data: {
        ...campaign,
        budget: Number(campaign.budget),
        metrics: {
          impressions,
          clicks,
          conversions,
          spend,
          revenue,
          ctr: impressions > 0 ? clicks / impressions : 0,
          cpa: conversions > 0 ? spend / conversions : 0,
          roas: spend > 0 ? revenue / spend : 0,
        },
        trend: trendData.map((d) => ({
          date: d.date,
          roas: Number(d.roas),
          spend: Number(d.spend),
          conversions: Number(d.conversions),
        })),
        personasCount: Number(personasCount[0]?.count || 0),
        deployments: deploymentsData.map((d) => ({
          ...d,
          allocatedBudget: Number(d.allocatedBudget),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: { code: 'FETCH_ERROR', message: 'Failed to fetch campaign' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateCampaignSchema.parse(body);

    const [existing] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Campaign not found' } },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (validated.name) updateData.name = validated.name;
    if (validated.objective) updateData.objective = validated.objective;
    if (validated.status) updateData.status = validated.status;
    if (validated.budget) updateData.budget = validated.budget.toString();
    if (validated.startDate) updateData.startDate = validated.startDate;
    if (validated.endDate) updateData.endDate = validated.endDate;

    const [updated] = await db
      .update(campaigns)
      .set(updateData)
      .where(eq(campaigns.id, id))
      .returning();

    return NextResponse.json({ data: updated });
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
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: { code: 'UPDATE_ERROR', message: 'Failed to update campaign' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [existing] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Campaign not found' } },
        { status: 404 }
      );
    }

    await db.delete(campaigns).where(eq(campaigns.id, id));

    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: { code: 'DELETE_ERROR', message: 'Failed to delete campaign' } },
      { status: 500 }
    );
  }
}
