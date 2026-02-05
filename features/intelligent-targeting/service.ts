import { db } from '@/lib/db';
import { audiences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { analyzeAudience } from '@/lib/ai/claude';
import type { AudienceAnalysisRequest } from './types';

export async function getPersonasByCampaign(campaignId: string) {
  return db.query.audiences.findMany({
    where: eq(audiences.campaignId, campaignId),
    orderBy: (audiences, { desc }) => [desc(audiences.intentScore)],
  });
}

export async function analyzeAndSaveAudience(request: AudienceAnalysisRequest) {
  const result = await analyzeAudience({
    name: request.campaignName,
    objective: request.objective,
    budget: Number(request.budget),
  });

  const savedPersonas = [];
  for (const persona of result) {
    const [saved] = await db.insert(audiences).values({
      campaignId: request.campaignId,
      name: persona.title,
      tagline: persona.description,
      intentScore: persona.intentScore,
      demographics: persona.demographics,
      psychographics: persona.psychographics,
      behaviors: persona.behaviors,
      recommendedMessaging: persona.recommendedMessaging,
      aiGenerated: true,
    }).returning();
    savedPersonas.push(saved);
  }

  return savedPersonas;
}

export async function deletePersonasByCampaign(campaignId: string) {
  return db.delete(audiences).where(eq(audiences.campaignId, campaignId));
}
