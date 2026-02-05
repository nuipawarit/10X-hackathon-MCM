import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns, audiences } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { analyzeAudience } from '@/lib/ai/claude';

const analyzeSchema = z.object({
  campaignId: z.string().uuid(),
  productCategory: z.string().optional(),
  dataSources: z.array(z.enum(['meta', 'google', 'tiktok', 'line', 'lemon8'])).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = analyzeSchema.parse(body);

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

    const result = await analyzeAudience({
      name: campaign.name,
      objective: campaign.objective || 'conversion',
      budget: Number(campaign.budget) || 10000,
      productCategory: validated.productCategory,
    });

    const insertedPersonas = await Promise.all(
      result.personas.map(async (persona) => {
        const [inserted] = await db
          .insert(audiences)
          .values({
            campaignId: validated.campaignId,
            name: persona.name,
            description: persona.tagline,
            demographics: persona.demographics,
            psychographics: persona.psychographics,
            behaviors: persona.behaviors,
            interests: persona.behaviors.contentPreferences || [],
            intentScore: persona.intentScore.toString(),
            segmentSize: persona.segmentSize,
            aiGenerated: true,
          })
          .returning();

        return {
          id: inserted.id,
          name: persona.name,
          tagline: persona.tagline,
          intentScore: persona.intentScore,
          segmentSize: persona.segmentSize,
          demographics: persona.demographics,
          psychographics: persona.psychographics,
          behaviors: persona.behaviors,
          recommendedMessaging: persona.recommendedMessaging,
          aiGenerated: true,
        };
      })
    );

    return NextResponse.json({
      data: {
        personaCount: insertedPersonas.length,
        personas: insertedPersonas,
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
    console.error('Error analyzing audience:', error);
    return NextResponse.json(
      { error: { code: 'AI_ERROR', message: 'Failed to analyze audience' } },
      { status: 500 }
    );
  }
}
