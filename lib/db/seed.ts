import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import {
  users,
  platformConnections,
  campaigns,
  audiences,
  creatives,
  deployments,
  analytics,
  optimizationLogs,
} from './schema';

const db = drizzle(sql);

async function seed() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const [user] = await db
    .insert(users)
    .values({
      email: 'demo@mcm.app',
      name: 'Demo User',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    })
    .returning();

  console.log('✅ Created user:', user.email);

  // Create platform connections
  const platforms = await db
    .insert(platformConnections)
    .values([
      {
        userId: user.id,
        platform: 'meta',
        status: 'active',
        accountId: 'act_123456789',
        lastSyncAt: new Date(),
      },
      {
        userId: user.id,
        platform: 'tiktok',
        status: 'active',
        accountId: 'tiktok_987654321',
        lastSyncAt: new Date(),
      },
      {
        userId: user.id,
        platform: 'google',
        status: 'active',
        accountId: 'google_456789123',
        lastSyncAt: new Date(),
      },
      {
        userId: user.id,
        platform: 'line',
        status: 'inactive',
        accountId: null,
      },
      {
        userId: user.id,
        platform: 'lemon8',
        status: 'inactive',
        accountId: null,
      },
    ])
    .returning();

  console.log('✅ Created platform connections:', platforms.length);

  // Create campaigns
  const [campaign1, campaign2] = await db
    .insert(campaigns)
    .values([
      {
        userId: user.id,
        name: 'Summer Skincare Launch',
        objective: 'conversion',
        status: 'active',
        budget: '50000',
        startDate: '2026-01-01',
        endDate: '2026-03-31',
      },
      {
        userId: user.id,
        name: 'Q1 Brand Awareness',
        objective: 'awareness',
        status: 'active',
        budget: '30000',
        startDate: '2026-01-15',
        endDate: '2026-02-28',
      },
    ])
    .returning();

  console.log('✅ Created campaigns:', campaign1.name, campaign2.name);

  // Create audiences/personas
  const [persona1, persona2, persona3] = await db
    .insert(audiences)
    .values([
      {
        campaignId: campaign1.id,
        name: 'The Skincare Geeks',
        description: 'Science-driven beauty enthusiasts who research ingredients before purchasing',
        personaType: 'high_intent',
        demographics: {
          ageRange: '25-34',
          genderSplit: { female: 75, male: 25 },
          locations: ['Bangkok', 'Chiang Mai', 'Phuket'],
        },
        psychographics: {
          values: ['Quality', 'Innovation', 'Self-care'],
          painPoints: ['Finding effective products', 'Ingredient transparency'],
          motivations: ['Self-improvement', 'Knowledge', 'Results-driven'],
        },
        behaviors: {
          platforms: ['TikTok', 'Lemon8', 'Instagram'],
          contentPreferences: ['Educational videos', 'Before/after results', 'Reviews'],
          purchaseTriggers: ['Clinical studies', 'Dermatologist recommended', 'Cruelty-free'],
        },
        interests: ['Skincare', 'K-beauty', 'Wellness', 'Science'],
        intentScore: '92',
        segmentSize: 45000,
        aiGenerated: true,
      },
      {
        campaignId: campaign1.id,
        name: 'The City Commuter',
        description: 'Urban professionals looking for quick, effective skincare routines',
        personaType: 'medium_intent',
        demographics: {
          ageRange: '28-40',
          genderSplit: { female: 60, male: 40 },
          locations: ['Bangkok', 'Nonthaburi', 'Samut Prakan'],
        },
        psychographics: {
          values: ['Efficiency', 'Convenience', 'Value'],
          painPoints: ['Limited time', 'Pollution exposure', 'Stress-related skin issues'],
          motivations: ['Quick results', 'Multi-tasking products', 'Professional appearance'],
        },
        behaviors: {
          platforms: ['Facebook', 'Instagram', 'LINE'],
          contentPreferences: ['Quick tips', 'Product comparisons', 'Time-saving hacks'],
          purchaseTriggers: ['Convenience', 'Multi-use products', 'Good reviews'],
        },
        interests: ['Urban lifestyle', 'Career', 'Time management', 'Wellness'],
        intentScore: '88',
        segmentSize: 78000,
        aiGenerated: true,
      },
      {
        campaignId: campaign2.id,
        name: 'Gen Z Trendsetters',
        description: 'Young consumers influenced by social trends and viral content',
        personaType: 'awareness',
        demographics: {
          ageRange: '18-24',
          genderSplit: { female: 65, male: 35 },
          locations: ['Bangkok', 'University towns'],
        },
        psychographics: {
          values: ['Authenticity', 'Sustainability', 'Self-expression'],
          painPoints: ['Budget constraints', 'Information overload', 'FOMO'],
          motivations: ['Trend participation', 'Social validation', 'Discovery'],
        },
        behaviors: {
          platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
          contentPreferences: ['Viral content', 'Influencer recommendations', 'Aesthetic visuals'],
          purchaseTriggers: ['Trending products', 'Influencer endorsement', 'Limited editions'],
        },
        interests: ['Social media', 'Pop culture', 'Sustainability', 'Fashion'],
        intentScore: '72',
        segmentSize: 120000,
        aiGenerated: true,
      },
    ])
    .returning();

  console.log('✅ Created personas:', persona1.name, persona2.name, persona3.name);

  // Create creatives
  const creativesData = await db
    .insert(creatives)
    .values([
      {
        campaignId: campaign1.id,
        audienceId: persona1.id,
        type: 'copy',
        title: 'Science-Backed Skincare',
        headline: 'Discover the Science of Beautiful Skin',
        bodyCopy: 'Clinical-grade ingredients. Proven results. Your skin deserves the best science has to offer.',
        aiPrompt: 'Create ad copy for skincare geeks persona emphasizing scientific ingredients',
        aiGenerated: true,
        status: 'approved',
      },
      {
        campaignId: campaign1.id,
        audienceId: persona1.id,
        type: 'image',
        title: 'Ingredient Spotlight',
        headline: 'Niacinamide: The Powerhouse Ingredient',
        bodyCopy: '10% Niacinamide for visible pore reduction in just 2 weeks.',
        contentUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200',
        aiGenerated: true,
        status: 'approved',
      },
      {
        campaignId: campaign1.id,
        audienceId: persona2.id,
        type: 'copy',
        title: 'Quick Routine',
        headline: '5-Minute Morning Routine',
        bodyCopy: 'Everything your skin needs before you rush out the door. Simple. Effective. Fast.',
        aiPrompt: 'Create ad copy for busy urban professionals',
        aiGenerated: true,
        status: 'approved',
      },
      {
        campaignId: campaign1.id,
        audienceId: persona2.id,
        type: 'image',
        title: 'Urban Protection',
        headline: 'Shield Your Skin from City Life',
        bodyCopy: 'Anti-pollution formula that works as hard as you do.',
        contentUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200',
        aiGenerated: true,
        status: 'approved',
      },
    ])
    .returning();

  console.log('✅ Created creatives:', creativesData.length);

  // Create deployments
  const deploymentsData = await db
    .insert(deployments)
    .values([
      {
        campaignId: campaign1.id,
        creativeId: creativesData[0].id,
        audienceId: persona1.id,
        platform: 'tiktok',
        allocatedBudget: '15000',
        status: 'active',
        deployedAt: new Date('2026-01-15'),
      },
      {
        campaignId: campaign1.id,
        creativeId: creativesData[1].id,
        audienceId: persona1.id,
        platform: 'meta',
        allocatedBudget: '12000',
        status: 'active',
        deployedAt: new Date('2026-01-15'),
      },
      {
        campaignId: campaign1.id,
        creativeId: creativesData[2].id,
        audienceId: persona2.id,
        platform: 'meta',
        allocatedBudget: '13000',
        status: 'active',
        deployedAt: new Date('2026-01-16'),
      },
      {
        campaignId: campaign1.id,
        creativeId: creativesData[3].id,
        audienceId: persona2.id,
        platform: 'google',
        allocatedBudget: '10000',
        status: 'active',
        deployedAt: new Date('2026-01-16'),
      },
    ])
    .returning();

  console.log('✅ Created deployments:', deploymentsData.length);

  // Create analytics data (7 days of data for charts)
  const analyticsEntries = [];
  const baseDate = new Date('2026-01-29');

  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    for (const deployment of deploymentsData) {
      const impressions = Math.floor(Math.random() * 50000) + 20000;
      const clicks = Math.floor(impressions * (Math.random() * 0.03 + 0.02));
      const conversions = Math.floor(clicks * (Math.random() * 0.08 + 0.04));
      const spend = Number((Math.random() * 500 + 200).toFixed(2));
      const revenue = Number((conversions * (Math.random() * 30 + 20)).toFixed(2));
      const ctr = Number((clicks / impressions).toFixed(4));
      const cpa = conversions > 0 ? Number((spend / conversions).toFixed(2)) : 0;
      const roas = spend > 0 ? Number((revenue / spend).toFixed(2)) : 0;

      analyticsEntries.push({
        deploymentId: deployment.id,
        date: dateStr,
        impressions,
        clicks,
        conversions,
        spend: spend.toString(),
        revenue: revenue.toString(),
        ctr: ctr.toString(),
        cpa: cpa.toString(),
        roas: roas.toString(),
      });
    }
  }

  await db.insert(analytics).values(analyticsEntries);
  console.log('✅ Created analytics entries:', analyticsEntries.length);

  // Create optimization logs
  await db.insert(optimizationLogs).values([
    {
      campaignId: campaign1.id,
      actionType: 'budget_reallocation',
      previousState: {
        tiktok: 12000,
        meta: 15000,
        google: 13000,
      },
      newState: {
        tiktok: 15000,
        meta: 12000,
        google: 13000,
      },
      aiReasoning: 'TikTok ROAS (6.5x) is 55% above average. Reallocating ฿3,000 from Meta to TikTok for better performance.',
      appliedBy: 'ai',
    },
    {
      campaignId: campaign1.id,
      actionType: 'creative_refresh',
      previousState: { creative: 'original_v1' },
      newState: { creative: 'optimized_v2' },
      aiReasoning: 'CTR dropped 15% in last 3 days indicating ad fatigue. Generated new creative variants.',
      appliedBy: 'ai',
    },
  ]);

  console.log('✅ Created optimization logs');
  console.log('🎉 Seeding complete!');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
