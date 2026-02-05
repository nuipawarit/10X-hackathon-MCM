import { NextRequest, NextResponse } from 'next/server';
import { db, audiences } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params;

    const personaList = await db
      .select()
      .from(audiences)
      .where(eq(audiences.campaignId, campaignId));

    const personas = personaList.map((persona) => ({
      id: persona.id,
      name: persona.name,
      tagline: persona.description,
      intentScore: Number(persona.intentScore),
      segmentSize: persona.segmentSize,
      demographics: persona.demographics,
      psychographics: persona.psychographics,
      behaviors: persona.behaviors,
      interests: persona.interests,
      aiGenerated: persona.aiGenerated,
      createdAt: persona.createdAt,
    }));

    return NextResponse.json({
      data: {
        personas,
      },
    });
  } catch (error) {
    console.error('Error fetching personas:', error);
    return NextResponse.json(
      { error: { code: 'FETCH_ERROR', message: 'Failed to fetch personas' } },
      { status: 500 }
    );
  }
}
