import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns, analytics, deployments, audiences } from '@/lib/db';
import { eq, sql, desc } from 'drizzle-orm';
import { z } from 'zod';

const createCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  objective: z.enum(['awareness', 'consideration', 'conversion']),
  budget: z.number().positive(),
  startDate: z.string(),
  endDate: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const campaignList = await db
      .select({
        id: campaigns.id,
        name: campaigns.name,
        objective: campaigns.objective,
        status: campaigns.status,
        budget: campaigns.budget,
        startDate: campaigns.startDate,
        endDate: campaigns.endDate,
        createdAt: campaigns.createdAt,
      })
      .from(campaigns)
      .orderBy(desc(campaigns.createdAt))
      .limit(limit)
      .offset(offset);

    const campaignsWithMetrics = await Promise.all(
      campaignList.map(async (campaign) => {
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
          .where(eq(deployments.campaignId, campaign.id));

        const metrics = metricsResult[0];
        const spend = Number(metrics.spend) || 0;
        const revenue = Number(metrics.revenue) || 0;
        const conversions = Number(metrics.conversions) || 0;
        const clicks = Number(metrics.clicks) || 0;
        const impressions = Number(metrics.impressions) || 0;

        return {
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
        };
      })
    );

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(campaigns);
    const total = Number(totalResult[0]?.count || 0);

    return NextResponse.json({
      data: campaignsWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: { code: 'FETCH_ERROR', message: 'Failed to fetch campaigns' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createCampaignSchema.parse(body);

    const [newCampaign] = await db
      .insert(campaigns)
      .values({
        name: validated.name,
        objective: validated.objective,
        budget: validated.budget.toString(),
        startDate: validated.startDate,
        endDate: validated.endDate,
        status: 'draft',
      })
      .returning();

    return NextResponse.json(
      { data: { id: newCampaign.id, status: newCampaign.status } },
      { status: 201 }
    );
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
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: { code: 'CREATE_ERROR', message: 'Failed to create campaign' } },
      { status: 500 }
    );
  }
}
