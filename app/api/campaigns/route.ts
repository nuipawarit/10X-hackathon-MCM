import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campaigns, analytics } from '@/lib/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { createCampaignSchema } from '@/lib/validations/schemas';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const allCampaigns = await db
      .select()
      .from(campaigns)
      .orderBy(desc(campaigns.createdAt))
      .limit(limit)
      .offset(offset);

    const campaignsWithMetrics = await Promise.all(
      allCampaigns.map(async (campaign) => {
        const metrics = await db
          .select({
            totalImpressions: sql<number>`COALESCE(SUM(${analytics.impressions}), 0)`,
            totalClicks: sql<number>`COALESCE(SUM(${analytics.clicks}), 0)`,
            totalConversions: sql<number>`COALESCE(SUM(${analytics.conversions}), 0)`,
            totalSpend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
            totalRevenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
          })
          .from(analytics)
          .where(eq(analytics.campaignId, campaign.id));

        const m = metrics[0];
        const spend = Number(m.totalSpend);
        const revenue = Number(m.totalRevenue);
        const clicks = Number(m.totalClicks);
        const impressions = Number(m.totalImpressions);

        return {
          ...campaign,
          budget: Number(campaign.budget),
          metrics: {
            roas: spend > 0 ? Math.round((revenue / spend) * 10) / 10 : 0,
            cpa: Number(m.totalConversions) > 0
              ? Math.round((spend / Number(m.totalConversions)) * 100) / 100
              : 0,
            ctr: impressions > 0
              ? Math.round((clicks / impressions) * 1000) / 10
              : 0,
            conversions: Number(m.totalConversions),
            spend,
            revenue,
          },
        };
      })
    );

    const total = await db.select({ count: sql<number>`count(*)` }).from(campaigns);

    return NextResponse.json({
      data: campaignsWithMetrics,
      pagination: { page, limit, total: Number(total[0].count) },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch campaigns' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createCampaignSchema.parse(body);

    const [campaign] = await db
      .insert(campaigns)
      .values({
        name: validated.name,
        objective: validated.objective,
        budget: validated.budget.toString(),
        startDate: validated.startDate || null,
        endDate: validated.endDate || null,
      })
      .returning();

    return NextResponse.json({ data: campaign }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create campaign' } },
      { status: 500 }
    );
  }
}
