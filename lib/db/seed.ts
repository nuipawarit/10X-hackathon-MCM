import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

async function seed() {
  const db = drizzle(sql, { schema });

  console.log('Seeding database...');

  // User
  const [user] = await db
    .insert(schema.users)
    .values({
      email: 'demo@mcm.app',
      name: 'Demo User',
      role: 'manager',
    })
    .returning();

  console.log('Created user:', user.email);

  // Campaigns
  const [campaign1] = await db
    .insert(schema.campaigns)
    .values({
      name: 'Summer Skincare Launch',
      objective: 'conversion',
      status: 'active',
      budget: '5000',
      startDate: '2026-01-28',
      endDate: '2026-03-28',
      userId: user.id,
    })
    .returning();

  const [campaign2] = await db
    .insert(schema.campaigns)
    .values({
      name: 'Q1 Brand Awareness',
      objective: 'awareness',
      status: 'active',
      budget: '3000',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      userId: user.id,
    })
    .returning();

  console.log('Created campaigns:', campaign1.name, campaign2.name);

  // Platform Connections
  const platforms = [
    { platform: 'meta', accountId: 'act_123456', status: 'active' as const },
    { platform: 'google', accountId: 'ga_789012', status: 'active' as const },
    { platform: 'tiktok', accountId: 'tt_345678', status: 'active' as const },
    { platform: 'line', accountId: null, status: 'not_connected' as const },
    { platform: 'lemon8', accountId: null, status: 'not_connected' as const },
  ];

  for (const p of platforms) {
    await db.insert(schema.platformConnections).values({
      userId: user.id,
      platform: p.platform,
      accountId: p.accountId,
      status: p.status,
    });
  }

  console.log('Created platform connections');

  // Audiences (Personas)
  const [persona1] = await db
    .insert(schema.audiences)
    .values({
      campaignId: campaign1.id,
      name: 'The Skincare Geeks',
      tagline: 'Science-focused consumers who research ingredients before purchase',
      intentScore: 92,
      demographics: { ageRange: '25-40', education: 'College-educated', lifestyle: 'Urban' },
      psychographics: {
        values: ['Ingredient transparency', 'Scientific backing'],
        painPoints: ['Sensitive skin', 'Misleading claims'],
        motivations: ['Effective results', 'Clean formulations'],
      },
      behaviors: {
        platforms: ['TikTok', 'Lemon8'],
        interests: ['Clean Beauty', 'Dermatology', 'Product Research'],
        purchaseTriggers: ['Clinical studies', 'Before/after photos'],
      },
      recommendedMessaging: 'Focus on ingredient science and clinical results',
    })
    .returning();

  const [persona2] = await db
    .insert(schema.audiences)
    .values({
      campaignId: campaign1.id,
      name: 'The City Commuter',
      tagline: 'Busy professionals who need quick, effective skincare routines',
      intentScore: 88,
      demographics: { ageRange: '28-45', education: 'Working Professionals', lifestyle: 'Metropolitan' },
      psychographics: {
        values: ['Time efficiency', 'Convenience'],
        painPoints: ['Pollution exposure', 'Limited routine time'],
        motivations: ['Quick results', 'Multi-tasking products'],
      },
      behaviors: {
        platforms: ['Instagram', 'Facebook'],
        interests: ['Urban Lifestyle', 'Wellness', 'Productivity'],
        purchaseTriggers: ['Before/after speed', 'Convenience packaging'],
      },
      recommendedMessaging: 'Emphasize quick routines and anti-pollution benefits',
    })
    .returning();

  console.log('Created personas:', persona1.name, persona2.name);

  // Creatives
  const creativeValues = [
    { campaignId: campaign1.id, personaId: persona1.id, type: 'image' as const, status: 'completed' as const, prompt: 'Lab setting skincare', variants: JSON.stringify([{ id: 1, title: 'Clean Lab Setting', headline: 'Science-Backed Skincare', body: 'Formulated with dermatologist-approved ingredients', cta: 'Shop Now', platform: 'tiktok' }, { id: 2, title: 'Natural Ingredients', headline: 'Pure Science, Real Results', body: 'Every ingredient clinically tested', cta: 'Learn More', platform: 'tiktok' }, { id: 3, title: 'Scientific Precision', headline: 'Lab-Tested Formula', body: 'Precision skincare for sensitive skin', cta: 'Try Now', platform: 'lemon8' }]) },
    { campaignId: campaign1.id, personaId: persona2.id, type: 'image' as const, status: 'completed' as const, prompt: 'Urban lifestyle skincare', variants: JSON.stringify([{ id: 1, title: 'Cafe Moment', headline: 'Skincare On The Go', body: 'Your 2-minute morning routine', cta: 'Shop Now', platform: 'instagram' }, { id: 2, title: 'City Lifestyle', headline: 'Urban Shield', body: 'Protection against city pollution', cta: 'Discover', platform: 'instagram' }, { id: 3, title: 'On-the-Go', headline: 'Quick & Effective', body: 'Multi-tasking skincare for busy days', cta: 'Get Yours', platform: 'facebook' }]) },
  ];

  const insertedCreatives = [];
  for (const c of creativeValues) {
    const [creative] = await db.insert(schema.creatives).values(c).returning();
    insertedCreatives.push(creative);
  }

  console.log('Created creatives');

  // Deployments
  const deploymentValues = [
    { campaignId: campaign1.id, creativeId: insertedCreatives[0].id, platform: 'tiktok', budget: '2500', status: 'active' as const, estimatedReach: '450K' },
    { campaignId: campaign1.id, creativeId: insertedCreatives[0].id, platform: 'lemon8', budget: '2500', status: 'active' as const, estimatedReach: '280K' },
    { campaignId: campaign1.id, creativeId: insertedCreatives[1].id, platform: 'instagram', budget: '2500', status: 'active' as const, estimatedReach: '520K' },
    { campaignId: campaign1.id, creativeId: insertedCreatives[1].id, platform: 'facebook', budget: '2500', status: 'active' as const, estimatedReach: '380K' },
  ];

  const insertedDeployments = [];
  for (const d of deploymentValues) {
    const [dep] = await db.insert(schema.deployments).values(d).returning();
    insertedDeployments.push(dep);
  }

  console.log('Created deployments');

  // Analytics (7 days)
  const baseDate = new Date('2026-01-28');
  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const decline = 1 - (i * 0.08);

    await db.insert(schema.analytics).values({
      campaignId: campaign1.id,
      deploymentId: insertedDeployments[0].id,
      platform: 'tiktok',
      impressions: Math.floor(15000 * decline),
      clicks: Math.floor(480 * decline),
      conversions: Math.floor(39 * decline),
      spend: (230 * decline).toFixed(2),
      revenue: (920 * decline * (1 - i * 0.05)).toFixed(2),
      date: dateStr,
    });

    await db.insert(schema.analytics).values({
      campaignId: campaign1.id,
      deploymentId: insertedDeployments[2].id,
      platform: 'facebook',
      impressions: Math.floor(12000 * decline),
      clicks: Math.floor(96 * decline),
      conversions: Math.floor(6 * decline),
      spend: (220 * decline).toFixed(2),
      revenue: (330 * decline * (1 - i * 0.1)).toFixed(2),
      date: dateStr,
    });
  }

  console.log('Created analytics data');

  // Optimization Logs
  await db.insert(schema.optimizationLogs).values({
    campaignId: campaign1.id,
    action: 'increase_budget',
    platform: 'tiktok',
    previousBudget: '1500',
    newBudget: '2500',
    reasoning: 'TikTok shows 95% above expected CPA targets for Skincare Geeks segment',
    applied: true,
    appliedAt: new Date(),
  });

  await db.insert(schema.optimizationLogs).values({
    campaignId: campaign1.id,
    action: 'decrease_budget',
    platform: 'facebook',
    previousBudget: '2500',
    newBudget: '1500',
    reasoning: 'Facebook ROAS declining -47% over 7 days, creative fatigue detected',
    applied: true,
    appliedAt: new Date(),
  });

  console.log('Created optimization logs');
  console.log('Seed complete!');
}

seed().catch(console.error);
