import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { optimizationLogs, campaigns } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    let query = db
      .select({
        id: optimizationLogs.id,
        campaignId: optimizationLogs.campaignId,
        actionType: optimizationLogs.actionType,
        previousState: optimizationLogs.previousState,
        newState: optimizationLogs.newState,
        aiReasoning: optimizationLogs.aiReasoning,
        appliedBy: optimizationLogs.appliedBy,
        appliedAt: optimizationLogs.appliedAt,
        campaignName: campaigns.name,
      })
      .from(optimizationLogs)
      .leftJoin(campaigns, eq(optimizationLogs.campaignId, campaigns.id))
      .orderBy(desc(optimizationLogs.appliedAt));

    if (campaignId) {
      query = query.where(eq(optimizationLogs.campaignId, campaignId)) as typeof query;
    }

    const logs = await query.limit(50);

    return NextResponse.json({
      data: logs.map((log) => ({
        ...log,
        appliedAt: log.appliedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching optimization logs:', error);
    return NextResponse.json(
      { error: { code: 'FETCH_ERROR', message: 'Failed to fetch optimization logs' } },
      { status: 500 }
    );
  }
}
