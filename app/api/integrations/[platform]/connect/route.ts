import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { platformConnections, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { connectPlatformSchema } from '@/lib/validations/schemas';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const { platform } = await params;
    const body = await request.json();
    const validated = connectPlatformSchema.parse(body);

    const [user] = await db.select().from(users).limit(1);
    if (!user) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'No user found' } },
        { status: 404 }
      );
    }

    const [existing] = await db
      .select()
      .from(platformConnections)
      .where(
        and(
          eq(platformConnections.userId, user.id),
          eq(platformConnections.platform, platform)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(platformConnections)
        .set({
          accountId: validated.accountId,
          accessToken: validated.accessToken,
          status: 'active',
          lastSyncAt: new Date(),
        })
        .where(eq(platformConnections.id, existing.id))
        .returning();

      return NextResponse.json({ data: updated });
    }

    const [connection] = await db
      .insert(platformConnections)
      .values({
        userId: user.id,
        platform,
        accountId: validated.accountId,
        accessToken: validated.accessToken,
        status: 'active',
        lastSyncAt: new Date(),
      })
      .returning();

    return NextResponse.json({ data: connection });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to connect platform' } },
      { status: 500 }
    );
  }
}
