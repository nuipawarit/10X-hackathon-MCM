import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { audiences, creatives } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateCreative } from '@/lib/ai/claude';
import { generateCreativeSchema } from '@/lib/validations/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = generateCreativeSchema.parse(body);

    const [persona] = await db
      .select()
      .from(audiences)
      .where(eq(audiences.id, validated.personaId));

    if (!persona) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Persona not found' } },
        { status: 404 }
      );
    }

    const [creative] = await db
      .insert(creatives)
      .values({
        campaignId: validated.campaignId,
        personaId: validated.personaId,
        type: validated.type,
        status: 'generating',
        prompt: validated.prompt,
      })
      .returning();

    const behaviors = persona.behaviors as { interests?: string[] } | null;

    generateCreative({
      name: persona.name,
      tagline: persona.tagline || '',
      interests: behaviors?.interests || [],
      prompt: validated.prompt,
      platforms: validated.platforms,
    }).then(async (result) => {
      await db
        .update(creatives)
        .set({
          status: 'completed',
          variants: result.variants.map((v: Record<string, unknown>, i: number) => ({ id: i + 1, ...v })),
        })
        .where(eq(creatives.id, creative.id));
    }).catch(async () => {
      await db
        .update(creatives)
        .set({ status: 'failed' })
        .where(eq(creatives.id, creative.id));
    });

    return NextResponse.json({
      data: { creativeId: creative.id, status: 'generating', estimatedTime: 30 },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } },
        { status: 400 }
      );
    }
    console.error('Creative generation error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to generate creative' } },
      { status: 500 }
    );
  }
}
