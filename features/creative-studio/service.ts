import { db } from '@/lib/db';
import { creatives } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateCreative } from '@/lib/ai/claude';
import type { GenerateCreativeRequest } from './types';

export async function getCreativesByCampaign(campaignId: string) {
  return db.query.creatives.findMany({
    where: eq(creatives.campaignId, campaignId),
    orderBy: (creatives, { desc }) => [desc(creatives.createdAt)],
  });
}

export async function getCreativesByPersona(campaignId: string, personaId: string) {
  return db.query.creatives.findMany({
    where: and(
      eq(creatives.campaignId, campaignId),
      eq(creatives.personaId, personaId),
    ),
  });
}

export async function generateAndSaveCreative(request: GenerateCreativeRequest) {
  const [creative] = await db.insert(creatives).values({
    campaignId: request.campaignId,
    personaId: request.personaId,
    type: 'image',
    status: 'generating',
    prompt: `Generate ad creatives for ${request.personaName}: ${request.personaDescription}`,
  }).returning();

  try {
    const result = await generateCreative({
      name: request.personaName,
      tagline: request.personaDescription,
      interests: request.interests,
      prompt: request.campaignObjective,
      platforms: ['tiktok', 'meta', 'lemon8'],
    });

    const [updated] = await db.update(creatives)
      .set({
        status: 'completed',
        variants: result.variants,
      })
      .where(eq(creatives.id, creative.id))
      .returning();

    return updated;
  } catch {
    await db.update(creatives)
      .set({ status: 'failed' })
      .where(eq(creatives.id, creative.id));
    throw new Error('Creative generation failed');
  }
}
