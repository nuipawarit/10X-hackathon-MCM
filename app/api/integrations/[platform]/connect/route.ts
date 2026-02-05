import { NextRequest, NextResponse } from 'next/server';
import { db, platformConnections } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const connectSchema = z.object({
  accessToken: z.string().min(1),
  accountId: z.string().min(1),
});

const VALID_PLATFORMS = ['meta', 'google', 'tiktok', 'line', 'lemon8'] as const;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const { platform } = await params;

    if (!VALID_PLATFORMS.includes(platform as typeof VALID_PLATFORMS[number])) {
      return NextResponse.json(
        { error: { code: 'INVALID_PLATFORM', message: 'Invalid platform' } },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = connectSchema.parse(body);

    const [existing] = await db
      .select()
      .from(platformConnections)
      .where(eq(platformConnections.platform, platform))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(platformConnections)
        .set({
          accessToken: validated.accessToken,
          accountId: validated.accountId,
          status: 'active',
          lastSyncAt: new Date(),
        })
        .where(eq(platformConnections.id, existing.id))
        .returning();

      return NextResponse.json({
        data: {
          id: updated.id,
          platform: updated.platform,
          status: updated.status,
          accountId: updated.accountId,
        },
      });
    }

    const [connection] = await db
      .insert(platformConnections)
      .values({
        platform,
        accessToken: validated.accessToken,
        accountId: validated.accountId,
        status: 'active',
        lastSyncAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      {
        data: {
          id: connection.id,
          platform: connection.platform,
          status: connection.status,
          accountId: connection.accountId,
        },
      },
      { status: 201 }
    );
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
    console.error('Error connecting platform:', error);
    return NextResponse.json(
      { error: { code: 'CONNECT_ERROR', message: 'Failed to connect platform' } },
      { status: 500 }
    );
  }
}
