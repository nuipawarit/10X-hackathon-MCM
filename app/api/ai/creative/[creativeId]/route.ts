import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { creatives } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ creativeId: string }> }
) {
  try {
    const { creativeId } = await params;

    const [creative] = await db
      .select()
      .from(creatives)
      .where(eq(creatives.id, creativeId));

    if (!creative) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Creative not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: creative });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch creative' } },
      { status: 500 }
    );
  }
}
