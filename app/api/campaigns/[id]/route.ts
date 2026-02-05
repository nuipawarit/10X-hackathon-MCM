import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campaigns, analytics, creatives, deployments } from '@/lib/db/schema';
import { eq, sql, asc } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id));

    if (!campaign) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Campaign not found' } },
        { status: 404 }
      );
    }

    const trend = await db
      .select({
        date: analytics.date,
        spend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
        revenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
      })
      .from(analytics)
      .where(eq(analytics.campaignId, id))
      .groupBy(analytics.date)
      .orderBy(asc(analytics.date));

    const trendData = trend.map((t) => ({
      date: t.date,
      roas: Number(t.spend) > 0
        ? Math.round((Number(t.revenue) / Number(t.spend)) * 10) / 10
        : 0,
    }));

    const metrics = await db
      .select({
        totalConversions: sql<number>`COALESCE(SUM(${analytics.conversions}), 0)`,
        totalSpend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
        totalRevenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
        totalClicks: sql<number>`COALESCE(SUM(${analytics.clicks}), 0)`,
        totalImpressions: sql<number>`COALESCE(SUM(${analytics.impressions}), 0)`,
      })
      .from(analytics)
      .where(eq(analytics.campaignId, id));

    const m = metrics[0];
    const spend = Number(m.totalSpend);
    const revenue = Number(m.totalRevenue);

    const campaignCreatives = await db
      .select()
      .from(creatives)
      .where(eq(creatives.campaignId, id));

    return NextResponse.json({
      data: {
        ...campaign,
        budget: Number(campaign.budget),
        metrics: {
          roas: spend > 0 ? Math.round((revenue / spend) * 10) / 10 : 0,
          cpa: Number(m.totalConversions) > 0
            ? Math.round((spend / Number(m.totalConversions)) * 100) / 100
            : 0,
          ctr: Number(m.totalImpressions) > 0
            ? Math.round((Number(m.totalClicks) / Number(m.totalImpressions)) * 1000) / 10
            : 0,
          conversions: Number(m.totalConversions),
          spend,
          revenue,
        },
        trend: trendData,
        creatives: campaignCreatives,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch campaign' } },
      { status: 500 }
    );
  }
}
