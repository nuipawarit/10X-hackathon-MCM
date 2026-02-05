import { NextRequest, NextResponse } from 'next/server';
import { db, deployments, campaigns, creatives } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const createDeploymentSchema = z.object({
  campaignId: z.string().uuid(),
  creativeIds: z.array(z.string().uuid()),
  platforms: z.array(
    z.object({
      platform: z.enum(['meta', 'google', 'tiktok', 'line', 'lemon8']),
      budget: z.number().positive(),
    })
  ),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    let query = db.select().from(deployments);

    if (campaignId) {
      const deploymentList = await db
        .select()
        .from(deployments)
        .where(eq(deployments.campaignId, campaignId));

      return NextResponse.json({
        data: {
          deployments: deploymentList.map((d) => ({
            ...d,
            allocatedBudget: Number(d.allocatedBudget),
          })),
        },
      });
    }

    const deploymentList = await query;

    return NextResponse.json({
      data: {
        deployments: deploymentList.map((d) => ({
          ...d,
          allocatedBudget: Number(d.allocatedBudget),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching deployments:', error);
    return NextResponse.json(
      { error: { code: 'FETCH_ERROR', message: 'Failed to fetch deployments' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createDeploymentSchema.parse(body);

    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, validated.campaignId))
      .limit(1);

    if (!campaign) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Campaign not found' } },
        { status: 404 }
      );
    }

    const creativeList = await Promise.all(
      validated.creativeIds.map(async (id) => {
        const [creative] = await db
          .select()
          .from(creatives)
          .where(eq(creatives.id, id))
          .limit(1);
        return creative;
      })
    );

    const validCreatives = creativeList.filter(Boolean);
    if (validCreatives.length === 0) {
      return NextResponse.json(
        { error: { code: 'NO_CREATIVES', message: 'No valid creatives found' } },
        { status: 400 }
      );
    }

    const deploymentValues = [];
    for (const platformConfig of validated.platforms) {
      for (const creative of validCreatives) {
        deploymentValues.push({
          campaignId: validated.campaignId,
          creativeId: creative.id,
          audienceId: creative.audienceId,
          platform: platformConfig.platform,
          allocatedBudget: (platformConfig.budget / validCreatives.length).toString(),
          status: 'pending' as const,
        });
      }
    }

    const insertedDeployments = await db
      .insert(deployments)
      .values(deploymentValues)
      .returning();

    const estimatedReach: Record<string, string> = {
      meta: '450K - 650K',
      google: '300K - 500K',
      tiktok: '500K - 800K',
      line: '200K - 350K',
      lemon8: '100K - 200K',
    };

    return NextResponse.json(
      {
        data: {
          deployments: insertedDeployments.map((d) => ({
            id: d.id,
            platform: d.platform,
            status: d.status,
            estimatedReach: estimatedReach[d.platform] || 'N/A',
            budget: Number(d.allocatedBudget),
          })),
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
    console.error('Error creating deployments:', error);
    return NextResponse.json(
      { error: { code: 'CREATE_ERROR', message: 'Failed to create deployments' } },
      { status: 500 }
    );
  }
}
