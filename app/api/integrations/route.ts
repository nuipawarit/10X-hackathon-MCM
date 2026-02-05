import { NextRequest, NextResponse } from 'next/server';
import { db, platformConnections } from '@/lib/db';

const ALL_PLATFORMS = ['meta', 'google', 'tiktok', 'line', 'lemon8'] as const;

export async function GET() {
  try {
    const connections = await db.select().from(platformConnections);

    const platformMap = new Map(
      connections.map((c) => [c.platform, c])
    );

    const platforms = ALL_PLATFORMS.map((platform) => {
      const connection = platformMap.get(platform);
      if (connection) {
        return {
          id: connection.id,
          platform,
          accountId: connection.accountId,
          status: connection.status,
          lastSyncAt: connection.lastSyncAt,
        };
      }
      return {
        platform,
        status: 'not_connected',
      };
    });

    return NextResponse.json({
      data: {
        platforms,
      },
    });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json(
      { error: { code: 'FETCH_ERROR', message: 'Failed to fetch integrations' } },
      { status: 500 }
    );
  }
}
