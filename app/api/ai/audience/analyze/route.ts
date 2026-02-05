import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campaigns, audiences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { analyzeAudience } from '@/lib/ai/claude';
import { analyzeAudienceSchema } from '@/lib/validations/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = analyzeAudienceSchema.parse(body);

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

    const personas = await analyzeAudience({
      name: campaign.name,
      objective: campaign.objective,
      budget: Number(campaign.budget),
    });

    const insertedPersonas = [];
    for (const persona of personas) {
      const [inserted] = await db
        .insert(audiences)
        .values({
          campaignId: validated.campaignId,
          name: persona.name,
          tagline: persona.tagline,
          intentScore: persona.intentScore,
          demographics: persona.demographics,
          psychographics: persona.psychographics,
          behaviors: persona.behaviors,
          recommendedMessaging: persona.recommendedMessaging,
          tags: persona.tags || [],
        })
        .returning();

      insertedPersonas.push({
        ...inserted,
        tags: persona.tags || [],
      });
    }

    return NextResponse.json({
      data: { campaignId: validated.campaignId, personas: insertedPersonas },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } },
        { status: 400 }
      );
    }
    console.error('Audience analysis error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to analyze audience' } },
      { status: 500 }
    );
  }
}
