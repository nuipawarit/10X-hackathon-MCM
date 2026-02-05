import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { optimizationLogs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { applyOptimizationSchema } from '@/lib/validations/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = applyOptimizationSchema.parse(body);

    const [log] = await db
      .select()
      .from(optimizationLogs)
      .where(eq(optimizationLogs.recommendationId, validated.recommendationId));

    if (log) {
      await db
        .update(optimizationLogs)
        .set({ applied: true, appliedAt: new Date() })
        .where(eq(optimizationLogs.id, log.id));

      return NextResponse.json({
        data: {
          applied: true,
          logId: log.id,
          message: `Budget reallocation applied for ${log.platform}`,
          appliedAt: new Date().toISOString(),
        },
      });
    }

    const [newLog] = await db
      .insert(optimizationLogs)
      .values({
        campaignId: '00000000-0000-0000-0000-000000000000',
        recommendationId: validated.recommendationId,
        action: 'apply_recommendation',
        applied: true,
        appliedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      data: {
        applied: true,
        logId: newLog.id,
        message: 'Recommendation applied',
        appliedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to apply optimization' } },
      { status: 500 }
    );
  }
}
