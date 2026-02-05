import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deployments } from '@/lib/db/schema';
import { createDeploymentSchema } from '@/lib/validations/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createDeploymentSchema.parse(body);

    const insertedDeployments = [];

    for (const adSet of validated.adSets) {
      for (const platform of adSet.platforms) {
        const [deployment] = await db
          .insert(deployments)
          .values({
            campaignId: validated.campaignId,
            creativeId: adSet.creativeIds[0] || null,
            platform: platform.platform,
            budget: platform.budget.toString(),
            status: 'pending',
            estimatedReach: platform.estimatedReach || null,
          })
          .returning();

        insertedDeployments.push(deployment);
      }
    }

    const totalBudget = insertedDeployments.reduce(
      (sum, d) => sum + Number(d.budget),
      0
    );

    return NextResponse.json(
      {
        data: {
          deployments: insertedDeployments,
          summary: {
            totalAdSets: validated.adSets.length,
            totalPlatforms: insertedDeployments.length,
            estimatedReach: '1.63M',
            totalBudget,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create deployments' } },
      { status: 500 }
    );
  }
}
