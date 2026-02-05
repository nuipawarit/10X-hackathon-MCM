import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { platformConnections } from '@/lib/db/schema';

export async function GET() {
  try {
    const connections = await db.select().from(platformConnections);

    const allPlatforms = ['meta', 'google', 'tiktok', 'line', 'lemon8'];
    const result = allPlatforms.map((platform) => {
      const connection = connections.find((c) => c.platform === platform);
      if (connection) {
        return connection;
      }
      return { platform, status: 'not_connected' as const };
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch integrations' } },
      { status: 500 }
    );
  }
}
