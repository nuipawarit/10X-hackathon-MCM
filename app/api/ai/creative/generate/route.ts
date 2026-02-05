import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { audiences, creatives } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateCreative } from '@/lib/ai/claude';
import { generateAdImage } from '@/lib/ai/image';
import { uploadCreativeImage } from '@/lib/storage/blob';
import { generateCreativeSchema } from '@/lib/validations/schemas';

export const maxDuration = 120;

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

    try {
      const result = await generateCreative({
        name: persona.name,
        tagline: persona.tagline || '',
        interests: behaviors?.interests || [],
        prompt: validated.prompt,
        platforms: validated.platforms,
      });

      const rawVariants = result.variants ?? (Array.isArray(result) ? result : [result]);

      const variantsWithImages = [];
      for (let i = 0; i < rawVariants.length; i++) {
        const v = rawVariants[i] as Record<string, unknown>;
        const imgPrompt = `Professional advertising creative for ${v.platform || 'social media'}: ${v.headline || v.title}. Target audience: ${persona.name}. Style: modern, clean, visually striking ad campaign imagery. No text in image.`;
        try {
          const imgBuffer = await generateAdImage(imgPrompt);
          try {
            const blob = await uploadCreativeImage(imgBuffer, `${creative.id}-${i}.png`);
            variantsWithImages.push({ id: i + 1, ...v, imageUrl: blob.url });
          } catch {
            const dataUrl = `data:image/png;base64,${imgBuffer.toString('base64')}`;
            variantsWithImages.push({ id: i + 1, ...v, imageUrl: dataUrl });
          }
        } catch (imgErr) {
          console.error(`Image generation failed for variant ${i}:`, imgErr);
          variantsWithImages.push({ id: i + 1, ...v });
        }
      }

      await db
        .update(creatives)
        .set({ status: 'completed', variants: variantsWithImages })
        .where(eq(creatives.id, creative.id));

      return NextResponse.json({
        data: { creativeId: creative.id, status: 'completed', variants: variantsWithImages },
      });
    } catch (genError) {
      await db
        .update(creatives)
        .set({ status: 'failed' })
        .where(eq(creatives.id, creative.id));

      console.error('Creative AI generation error:', genError);
      return NextResponse.json(
        { error: { code: 'AI_ERROR', message: 'AI creative generation failed' } },
        { status: 500 }
      );
    }
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
