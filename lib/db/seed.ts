import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export async function seedDatabase() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log('Truncating tables...');
  await db.delete(schema.optimizationLogs);
  await db.delete(schema.analytics);
  await db.delete(schema.deployments);
  await db.delete(schema.creatives);
  await db.delete(schema.audiences);
  await db.delete(schema.platformConnections);
  await db.delete(schema.campaigns);
  await db.delete(schema.users);

  console.log('Seeding database...');

  const [user] = await db
    .insert(schema.users)
    .values({
      email: 'demo@mcm.app',
      name: 'Demo User',
      role: 'manager',
    })
    .returning();

  console.log('Created user:', user.email);

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

  const platforms = [
    { platform: 'meta', accountId: 'act_123456', status: 'active' as const },
    { platform: 'google', accountId: 'ga_789012', status: 'active' as const },
    { platform: 'tiktok', accountId: 'tt_345678', status: 'active' as const },
    { platform: 'line', accountId: 'ln_901234', status: 'active' as const },
    { platform: 'lemon8', accountId: 'l8_567890', status: 'active' as const },
    { platform: 'shopee', accountId: 'sp_112233', status: 'active' as const },
    { platform: 'lazada', accountId: 'lz_445566', status: 'active' as const },
  ];

  for (const p of platforms) {
    await db.insert(schema.platformConnections).values({
      userId: user.id,
      platform: p.platform,
      accountId: p.accountId,
      status: p.status,
    });
  }

  console.log('Created platform connections (7 platforms)');

  // --- Consumer Personas ---
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
      segmentType: 'consumer',
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
      segmentType: 'consumer',
    })
    .returning();

  console.log('Created consumer personas:', persona1.name, persona2.name);

  // --- Business Lifecycle Segments ---
  const lifecycleSegments = [
    {
      name: 'New Customers',
      tagline: 'Recently acquired customers with low CAC',
      intentScore: 65,
      lifecycleStage: 'new',
      segmentType: 'business',
      customerCount: 850,
      avgOrderValue: '1200',
      purchaseFrequency: '1.2',
      demographics: { segment: 'First-time buyers', avgAge: '28' },
      psychographics: { motivations: ['Curiosity', 'Promotions'] },
      behaviors: { platforms: ['TikTok', 'Shopee'], interests: ['Deals', 'New products'] },
      recommendedMessaging: 'Welcome series with onboarding offers',
    },
    {
      name: 'Active/Returning',
      tagline: 'Engaged customers with high repeat purchase rate',
      intentScore: 78,
      lifecycleStage: 'active',
      segmentType: 'business',
      customerCount: 2100,
      avgOrderValue: '2800',
      purchaseFrequency: '2.8',
      demographics: { segment: 'Repeat buyers', avgAge: '32' },
      psychographics: { motivations: ['Brand loyalty', 'Product satisfaction'] },
      behaviors: { platforms: ['Instagram', 'LINE'], interests: ['Skincare routines', 'Reviews'] },
      recommendedMessaging: 'Cross-sell and loyalty program promotions',
    },
    {
      name: 'Top Spenders/VIP',
      tagline: 'High-value customers with premium purchasing habits',
      intentScore: 95,
      lifecycleStage: 'vip',
      segmentType: 'business',
      customerCount: 320,
      avgOrderValue: '4250',
      purchaseFrequency: '3.2',
      demographics: { segment: 'Premium buyers', avgAge: '35' },
      psychographics: { motivations: ['Exclusivity', 'Premium quality'] },
      behaviors: { platforms: ['Instagram', 'Lemon8'], interests: ['Luxury skincare', 'Exclusive launches'] },
      recommendedMessaging: 'Exclusive VIP offers and early access',
    },
    {
      name: 'At-Risk/Drop-off',
      tagline: 'Previously active customers showing declining engagement',
      intentScore: 35,
      lifecycleStage: 'at_risk',
      segmentType: 'business',
      customerCount: 480,
      avgOrderValue: '1800',
      purchaseFrequency: '0.5',
      demographics: { segment: 'Lapsed buyers', avgAge: '30' },
      psychographics: { motivations: ['Re-engagement', 'Better alternatives'] },
      behaviors: { platforms: ['Facebook', 'Lazada'], interests: ['Competitor brands', 'Price comparison'] },
      recommendedMessaging: 'Win-back campaigns with personalized incentives',
    },
  ];

  for (const seg of lifecycleSegments) {
    await db.insert(schema.audiences).values({
      campaignId: campaign1.id,
      ...seg,
    });
  }

  console.log('Created business lifecycle segments');

  // --- Creatives with AI context ---
  const creativeValues = [
    {
      campaignId: campaign1.id,
      personaId: persona1.id,
      type: 'image' as const,
      status: 'completed' as const,
      prompt: 'Lab setting skincare',
      variants: JSON.stringify([
        { id: 1, title: 'Clean Lab Setting', headline: 'Science-Backed Skincare', body: 'Formulated with dermatologist-approved ingredients', cta: 'Shop Now', platform: 'tiktok' },
        { id: 2, title: 'Natural Ingredients', headline: 'Pure Science, Real Results', body: 'Every ingredient clinically tested', cta: 'Learn More', platform: 'tiktok' },
        { id: 3, title: 'Scientific Precision', headline: 'Lab-Tested Formula', body: 'Precision skincare for sensitive skin', cta: 'Try Now', platform: 'lemon8' },
      ]),
      businessGoal: 'vip',
      targetPersonaId: persona1.id,
      predictionScore: '85.5',
      aiReasoning: 'VIP skincare geeks respond strongly to scientific credibility and exclusive formulations. Predicted high engagement based on ingredient-focused messaging.',
      impactMetrics: JSON.stringify({ convRate: 4.8, ctr: 3.2, cpaImprovement: -35, roasBoost: 4.5 }),
    },
    {
      campaignId: campaign1.id,
      personaId: persona2.id,
      type: 'image' as const,
      status: 'completed' as const,
      prompt: 'Urban lifestyle skincare',
      variants: JSON.stringify([
        { id: 1, title: 'Cafe Moment', headline: 'Skincare On The Go', body: 'Your 2-minute morning routine', cta: 'Shop Now', platform: 'instagram' },
        { id: 2, title: 'City Lifestyle', headline: 'Urban Shield', body: 'Protection against city pollution', cta: 'Discover', platform: 'instagram' },
        { id: 3, title: 'On-the-Go', headline: 'Quick & Effective', body: 'Multi-tasking skincare for busy days', cta: 'Get Yours', platform: 'facebook' },
      ]),
      businessGoal: 'new',
      targetPersonaId: persona2.id,
      predictionScore: '78.2',
      aiReasoning: 'New customer acquisition through convenience messaging. City commuters respond to time-saving and multi-tasking product benefits.',
      impactMetrics: JSON.stringify({ convRate: 3.5, ctr: 2.8, cpaImprovement: -20, roasBoost: 3.2 }),
    },
  ];

  const insertedCreatives = [];
  for (const c of creativeValues) {
    const [creative] = await db.insert(schema.creatives).values(c).returning();
    insertedCreatives.push(creative);
  }

  console.log('Created creatives with AI context');

  // --- Deployments with AI recommendations ---
  const deploymentValues = [
    {
      campaignId: campaign1.id,
      creativeId: insertedCreatives[0].id,
      platform: 'tiktok',
      budget: '2500',
      status: 'active' as const,
      estimatedReach: '450K',
      aiRecommendedPlatforms: JSON.stringify(['tiktok', 'lemon8']),
      confidenceScore: '92',
      recommendationReason: 'High engagement from tech-savvy users on TikTok. Skincare Geeks audience is 3.2x more active on short-form video platforms.',
    },
    {
      campaignId: campaign1.id,
      creativeId: insertedCreatives[0].id,
      platform: 'lemon8',
      budget: '2500',
      status: 'active' as const,
      estimatedReach: '280K',
      aiRecommendedPlatforms: JSON.stringify(['tiktok', 'lemon8']),
      confidenceScore: '88',
      recommendationReason: 'Lemon8 beauty community aligns well with ingredient-focused content. High conversion rate for skincare products.',
    },
    {
      campaignId: campaign1.id,
      creativeId: insertedCreatives[1].id,
      platform: 'instagram',
      budget: '2500',
      status: 'active' as const,
      estimatedReach: '520K',
      aiRecommendedPlatforms: JSON.stringify(['instagram', 'facebook']),
      confidenceScore: '90',
      recommendationReason: 'Instagram Stories and Reels perform well for lifestyle-focused urban audiences. High reach among 28-45 professionals.',
    },
    {
      campaignId: campaign1.id,
      creativeId: insertedCreatives[1].id,
      platform: 'facebook',
      budget: '2500',
      status: 'active' as const,
      estimatedReach: '380K',
      aiRecommendedPlatforms: JSON.stringify(['instagram', 'facebook']),
      confidenceScore: '85',
      recommendationReason: 'Facebook retargeting is effective for commuter demographics. Good for building awareness and driving conversions.',
    },
    {
      campaignId: campaign1.id,
      creativeId: insertedCreatives[0].id,
      platform: 'shopee',
      budget: '1500',
      status: 'active' as const,
      estimatedReach: '320K',
      aiRecommendedPlatforms: JSON.stringify(['shopee']),
      confidenceScore: '82',
      recommendationReason: 'Shopee beauty category shows strong search intent for clinical skincare products.',
    },
    {
      campaignId: campaign1.id,
      creativeId: insertedCreatives[1].id,
      platform: 'lazada',
      budget: '1200',
      status: 'active' as const,
      estimatedReach: '250K',
      aiRecommendedPlatforms: JSON.stringify(['lazada']),
      confidenceScore: '79',
      recommendationReason: 'Lazada premium beauty segment aligns with urban professionals seeking convenience.',
    },
  ];

  const insertedDeployments = [];
  for (const d of deploymentValues) {
    const [dep] = await db.insert(schema.deployments).values(d).returning();
    insertedDeployments.push(dep);
  }

  console.log('Created deployments with AI recommendations (6 deployments, 6 platforms)');

  // --- Analytics: 7 days × 9 platforms ---
  const baseDate = new Date('2026-01-28');
  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const decline = 1 - (i * 0.08);

    // TikTok
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

    // Lemon8
    await db.insert(schema.analytics).values({
      campaignId: campaign1.id,
      deploymentId: insertedDeployments[1].id,
      platform: 'lemon8',
      impressions: Math.floor(8000 * decline),
      clicks: Math.floor(320 * decline),
      conversions: Math.floor(28 * decline),
      spend: (180 * decline).toFixed(2),
      revenue: (720 * decline * (1 - i * 0.04)).toFixed(2),
      date: dateStr,
    });

    // Instagram
    await db.insert(schema.analytics).values({
      campaignId: campaign1.id,
      deploymentId: insertedDeployments[2].id,
      platform: 'instagram',
      impressions: Math.floor(18000 * decline),
      clicks: Math.floor(540 * decline),
      conversions: Math.floor(32 * decline),
      spend: (280 * decline).toFixed(2),
      revenue: (840 * decline * (1 - i * 0.06)).toFixed(2),
      date: dateStr,
    });

    // Facebook
    await db.insert(schema.analytics).values({
      campaignId: campaign1.id,
      deploymentId: insertedDeployments[3].id,
      platform: 'facebook',
      impressions: Math.floor(12000 * decline),
      clicks: Math.floor(96 * decline),
      conversions: Math.floor(6 * decline),
      spend: (220 * decline).toFixed(2),
      revenue: (330 * decline * (1 - i * 0.1)).toFixed(2),
      date: dateStr,
    });

    // Meta (aggregate)
    await db.insert(schema.analytics).values({
      campaignId: campaign1.id,
      platform: 'meta',
      impressions: Math.floor(10000 * decline),
      clicks: Math.floor(350 * decline),
      conversions: Math.floor(22 * decline),
      spend: (200 * decline).toFixed(2),
      revenue: (680 * decline * (1 - i * 0.05)).toFixed(2),
      date: dateStr,
    });

    // Google Ads
    await db.insert(schema.analytics).values({
      campaignId: campaign1.id,
      platform: 'google',
      impressions: Math.floor(22000 * decline),
      clicks: Math.floor(660 * decline),
      conversions: Math.floor(42 * decline),
      spend: (350 * decline).toFixed(2),
      revenue: (1260 * decline * (1 - i * 0.03)).toFixed(2),
      date: dateStr,
    });

    // Shopee
    await db.insert(schema.analytics).values({
      campaignId: campaign1.id,
      deploymentId: insertedDeployments[4].id,
      platform: 'shopee',
      impressions: Math.floor(9500 * decline),
      clicks: Math.floor(380 * decline),
      conversions: Math.floor(25 * decline),
      spend: (170 * decline).toFixed(2),
      revenue: (560 * decline * (1 - i * 0.04)).toFixed(2),
      date: dateStr,
    });

    // Lazada
    await db.insert(schema.analytics).values({
      campaignId: campaign1.id,
      deploymentId: insertedDeployments[5].id,
      platform: 'lazada',
      impressions: Math.floor(7500 * decline),
      clicks: Math.floor(300 * decline),
      conversions: Math.floor(19 * decline),
      spend: (145 * decline).toFixed(2),
      revenue: (440 * decline * (1 - i * 0.05)).toFixed(2),
      date: dateStr,
    });

    // LINE LAP
    await db.insert(schema.analytics).values({
      campaignId: campaign1.id,
      platform: 'line',
      impressions: Math.floor(6000 * decline),
      clicks: Math.floor(240 * decline),
      conversions: Math.floor(15 * decline),
      spend: (120 * decline).toFixed(2),
      revenue: (380 * decline * (1 - i * 0.06)).toFixed(2),
      date: dateStr,
    });
  }

  console.log('Created analytics data (7 days × 9 platform entries)');

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

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().catch(console.error);
}
