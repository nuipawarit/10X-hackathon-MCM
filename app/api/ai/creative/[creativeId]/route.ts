import { NextRequest, NextResponse } from 'next/server';
import { db, creatives, audiences } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ creativeId: string }> }
) {
  try {
    const { creativeId } = await params;

    const [creative] = await db
      .select()
      .from(creatives)
      .where(eq(creatives.id, creativeId))
      .limit(1);

    if (!creative) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Creative not found' } },
        { status: 404 }
      );
    }

    let personaName = 'Unknown';
    if (creative.audienceId) {
      const [persona] = await db
        .select({ name: audiences.name })
        .from(audiences)
        .where(eq(audiences.id, creative.audienceId))
        .limit(1);
      if (persona) {
        personaName = persona.name;
      }
    }

    return NextResponse.json({
      data: {
        id: creative.id,
        type: creative.type,
        status: creative.status,
        title: creative.title,
        headline: creative.headline,
        bodyCopy: creative.bodyCopy,
        contentUrl: creative.contentUrl,
        thumbnailUrl: creative.thumbnailUrl,
        aiPrompt: creative.aiPrompt,
        aiGenerated: creative.aiGenerated,
        personaName,
        createdAt: creative.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching creative:', error);
    return NextResponse.json(
      { error: { code: 'FETCH_ERROR', message: 'Failed to fetch creative' } },
      { status: 500 }
    );
  }
}
