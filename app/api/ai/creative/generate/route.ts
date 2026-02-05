import { NextRequest, NextResponse } from 'next/server';
import { db, audiences, creatives } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { generateCreative } from '@/lib/ai/claude';

const generateSchema = z.object({
  personaId: z.string().uuid(),
  type: z.enum(['image', 'video', 'copy']),
  prompt: z.string().min(1),
  platforms: z.array(z.enum(['meta', 'google', 'tiktok', 'line', 'lemon8', 'instagram', 'facebook'])).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = generateSchema.parse(body);

    const [persona] = await db
      .select()
      .from(audiences)
      .where(eq(audiences.id, validated.personaId))
      .limit(1);

    if (!persona) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Persona not found' } },
        { status: 404 }
      );
    }

    const [creative] = await db
      .insert(creatives)
      .values({
        campaignId: persona.campaignId!,
        audienceId: validated.personaId,
        type: validated.type,
        title: `Creative for ${persona.name}`,
        aiPrompt: validated.prompt,
        aiGenerated: true,
        status: 'draft',
      })
      .returning();

    const platforms = validated.platforms || ['tiktok', 'instagram', 'facebook'];

    const result = await generateCreative(
      {
        name: persona.name,
        demographics: persona.demographics as Record<string, unknown>,
        psychographics: persona.psychographics as Record<string, unknown>,
        behaviors: persona.behaviors as Record<string, unknown>,
        recommendedMessaging: persona.description || undefined,
      },
      validated.prompt,
      platforms
    );

    const firstVariant = result.variants[0];
    await db
      .update(creatives)
      .set({
        headline: firstVariant?.headline,
        bodyCopy: firstVariant?.body,
        status: 'approved',
      })
      .where(eq(creatives.id, creative.id));

    return NextResponse.json({
      data: {
        creativeId: creative.id,
        status: 'completed',
        variants: result.variants,
        visualDirection: result.visualDirection,
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
    console.error('Error generating creative:', error);
    return NextResponse.json(
      { error: { code: 'AI_ERROR', message: 'Failed to generate creative' } },
      { status: 500 }
    );
  }
}
