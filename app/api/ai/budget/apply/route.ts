import { NextRequest, NextResponse } from 'next/server';
import { db, deployments, optimizationLogs, campaigns } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const applySchema = z.object({
  campaignId: z.string().uuid(),
  recommendations: z.array(
    z.object({
      platform: z.string(),
      currentBudget: z.number(),
      recommendedBudget: z.number(),
      reasoning: z.string(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = applySchema.parse(body);

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

    const previousState: Record<string, number> = {};
    const newState: Record<string, number> = {};

    for (const rec of validated.recommendations) {
      previousState[rec.platform] = rec.currentBudget;
      newState[rec.platform] = rec.recommendedBudget;

      await db
        .update(deployments)
        .set({ allocatedBudget: rec.recommendedBudget.toString() })
        .where(eq(deployments.campaignId, validated.campaignId));
    }

    const [log] = await db
      .insert(optimizationLogs)
      .values({
        campaignId: validated.campaignId,
        actionType: 'budget_reallocation',
        previousState,
        newState,
        aiReasoning: validated.recommendations
          .map((r) => `${r.platform}: ${r.reasoning}`)
          .join(' | '),
        appliedBy: 'ai',
      })
      .returning();

    return NextResponse.json({
      data: {
        applied: true,
        logId: log.id,
        message: 'Budget reallocation applied successfully',
        changes: validated.recommendations.map((r) => ({
          platform: r.platform,
          from: r.currentBudget,
          to: r.recommendedBudget,
        })),
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
    console.error('Error applying optimization:', error);
    return NextResponse.json(
      { error: { code: 'APPLY_ERROR', message: 'Failed to apply optimization' } },
      { status: 500 }
    );
  }
}
