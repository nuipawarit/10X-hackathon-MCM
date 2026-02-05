import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { audiences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params;

    const personas = await db
      .select()
      .from(audiences)
      .where(eq(audiences.campaignId, campaignId));

    return NextResponse.json({ data: personas });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch personas' } },
      { status: 500 }
    );
  }
}
