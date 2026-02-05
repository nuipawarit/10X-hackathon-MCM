import { db } from '@/lib/db';
import { campaigns, analytics, audiences, creatives, deployments, optimizationLogs } from '@/lib/db/schema';
import { eq, sql, asc, desc, inArray } from 'drizzle-orm';
import { PLATFORM_COLORS, getPersonaIconConfig, getCreativeImage, parseReach, formatReach } from './constants';

// ─── Shared ───

export async function getActiveCampaign() {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.status, 'active'))
    .orderBy(asc(campaigns.createdAt))
    .limit(1);
  return campaign ?? null;
}

// ─── Dashboard v2 ───

export async function getCrossPlatformKPIs(campaignId: string) {
  const rows = await db
    .select({
      totalSpend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
      totalRevenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
      totalConversions: sql<number>`COALESCE(SUM(${analytics.conversions}), 0)`,
    })
    .from(analytics)
    .where(eq(analytics.campaignId, campaignId));

  const m = rows[0];
  const spend = Number(m.totalSpend);
  const revenue = Number(m.totalRevenue);
  const conversions = Number(m.totalConversions);
  const roas = spend > 0 ? revenue / spend : 0;

  return {
    totalSpend: spend,
    totalRevenue: revenue,
    overallRoas: Math.round(roas * 10) / 10,
    totalConversions: conversions,
  };
}

export async function getDailyPlatformBreakdown(campaignId: string) {
  const rows = await db
    .select({
      date: analytics.date,
      platform: analytics.platform,
      spend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
      revenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
    })
    .from(analytics)
    .where(eq(analytics.campaignId, campaignId))
    .groupBy(analytics.date, analytics.platform)
    .orderBy(asc(analytics.date));

  const dayMap = new Map<string, Record<string, number>>();
  for (const row of rows) {
    if (!row.platform) continue;
    const day = new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dayMap.has(day)) {
      dayMap.set(day, { meta: 0, google: 0, tiktok: 0, line: 0, lemon8: 0, shopee: 0, lazada: 0, instagram: 0, facebook: 0, totalSpend: 0, totalRevenue: 0 });
    }
    const entry = dayMap.get(day)!;
    const spend = Number(row.spend);
    const revenue = Number(row.revenue);
    entry[row.platform] = Math.round(spend);
    entry.totalSpend += spend;
    entry.totalRevenue += revenue;
  }

  return [...dayMap.entries()].map(([day, data]) => ({
    day,
    meta: data.meta,
    google: data.google,
    tiktok: data.tiktok,
    line: data.line,
    lemon8: data.lemon8,
    shopee: data.shopee,
    lazada: data.lazada,
    instagram: data.instagram,
    facebook: data.facebook,
    roas: data.totalSpend > 0 ? Math.round((data.totalRevenue / data.totalSpend) * 10) / 10 : 0,
  }));
}

export async function getDeploymentPerformanceV2(campaignId: string) {
  const rows = await db
    .select({
      platform: analytics.platform,
      totalImpressions: sql<number>`COALESCE(SUM(${analytics.impressions}), 0)`,
      totalClicks: sql<number>`COALESCE(SUM(${analytics.clicks}), 0)`,
      totalConversions: sql<number>`COALESCE(SUM(${analytics.conversions}), 0)`,
      totalSpend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
      totalRevenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
    })
    .from(analytics)
    .where(eq(analytics.campaignId, campaignId))
    .groupBy(analytics.platform);

  return rows
    .filter((r) => r.platform !== null)
    .map((row) => {
      const platform = row.platform!;
      const platformInfo = PLATFORM_COLORS[platform] ?? { color: '#6B7280', logo: '??', displayName: platform };
      const spend = Number(row.totalSpend);
      const revenue = Number(row.totalRevenue);
      const clicks = Number(row.totalClicks);
      const impressions = Number(row.totalImpressions);
      const conversions = Number(row.totalConversions);
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const cpc = clicks > 0 ? spend / clicks : 0;
      const cpa = conversions > 0 ? spend / conversions : 0;
      const roas = spend > 0 ? revenue / spend : 0;

      return {
        platform: platformInfo.displayName,
        platformKey: platform,
        color: platformInfo.color,
        logo: platformInfo.logo,
        spend: `฿${Math.round(spend).toLocaleString()}`,
        impressions: impressions.toLocaleString(),
        clicks: clicks.toLocaleString(),
        ctr: `${ctr.toFixed(1)}%`,
        cpc: `฿${cpc.toFixed(2)}`,
        conversions: conversions.toLocaleString(),
        cpa: `฿${cpa.toFixed(2)}`,
        roas: `${roas.toFixed(1)}x`,
      };
    })
    .sort((a, b) => parseFloat(b.roas) - parseFloat(a.roas));
}

// ─── Dashboard (shared) ───

export async function getCampaignTrend(campaignId: string) {
  const trend = await db
    .select({
      date: analytics.date,
      spend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
      revenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
    })
    .from(analytics)
    .where(eq(analytics.campaignId, campaignId))
    .groupBy(analytics.date)
    .orderBy(asc(analytics.date));

  return trend.map((t) => ({
    day: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    roas: Number(t.spend) > 0
      ? Math.round((Number(t.revenue) / Number(t.spend)) * 10) / 10
      : 0,
  }));
}

export async function getAlertInfo(campaignId: string) {
  const logs = await db
    .select()
    .from(optimizationLogs)
    .where(eq(optimizationLogs.campaignId, campaignId))
    .orderBy(desc(optimizationLogs.createdAt));

  const decreaseLog = logs.find((l) => l.action === 'decrease_budget');
  if (!decreaseLog) return null;

  const trend = await getCampaignTrend(campaignId);
  let changePercent = '-47%';
  if (trend.length >= 2) {
    const first = trend[0].roas;
    const last = trend[trend.length - 1].roas;
    if (first > 0) {
      const change = Math.round(((last - first) / first) * 100);
      changePercent = `${change >= 0 ? '+' : ''}${change}%`;
    }
  }

  const platform = decreaseLog.platform
    ? (PLATFORM_COLORS[decreaseLog.platform]?.displayName ?? decreaseLog.platform)
    : 'Campaign';

  return {
    title: `Alert: Creative Fatigue Detected on ${platform} Campaign`,
    description: decreaseLog.reasoning ?? 'Performance has declined. Consider reviewing your campaign.',
    changePercent,
  };
}

// ─── Audience ───

interface Demographics { ageRange?: string; education?: string; lifestyle?: string }
interface Psychographics { values?: string[]; painPoints?: string[]; motivations?: string[] }
interface Behaviors { platforms?: string[]; interests?: string[]; purchaseTriggers?: string[] }

export async function getConsumerPersonas(campaignId: string) {
  const rows = await db
    .select()
    .from(audiences)
    .where(eq(audiences.campaignId, campaignId))
    .orderBy(desc(audiences.intentScore));

  return rows
    .filter((row) => (row.segmentType ?? 'consumer') === 'consumer')
    .map((row, index) => {
      const demo = (row.demographics as Demographics) ?? {};
      const psycho = (row.psychographics as Psychographics) ?? {};
      const behav = (row.behaviors as Behaviors) ?? {};
      const config = getPersonaIconConfig(index);

      return {
        id: row.id,
        title: row.name,
        iconName: config.iconName,
        iconBg: config.iconBg,
        iconColor: config.iconColor,
        tags: behav.interests?.slice(0, 3) ?? [],
        intent: row.intentScore,
        description: row.tagline ?? '',
        demographics: [demo.ageRange, demo.education, demo.lifestyle].filter(Boolean).join(', '),
        interests: [...(psycho.values ?? []), ...(psycho.motivations ?? [])].slice(0, 3),
      };
    });
}

export async function getLifecycleSegments(campaignId: string) {
  const rows = await db
    .select()
    .from(audiences)
    .where(eq(audiences.campaignId, campaignId))
    .orderBy(desc(audiences.intentScore));

  return rows
    .filter((row) => row.segmentType === 'business')
    .map((row) => ({
      id: row.id,
      name: row.name,
      tagline: row.tagline ?? '',
      stage: row.lifecycleStage as 'new' | 'active' | 'vip' | 'at_risk',
      customerCount: row.customerCount ?? 0,
      avgOrderValue: Number(row.avgOrderValue ?? 0),
      purchaseFrequency: Number(row.purchaseFrequency ?? 0),
      intentScore: row.intentScore,
      recommendedMessaging: row.recommendedMessaging ?? '',
    }));
}

// ─── Creative ───

interface CreativeVariantData { id?: number; title?: string; imageUrl?: string; headline?: string; body?: string; cta?: string; platform?: string }

export async function getCampaignCreatives(campaignId: string) {
  const creativeRows = await db
    .select()
    .from(creatives)
    .where(eq(creatives.campaignId, campaignId));

  const personaIds = [...new Set(creativeRows.map((c) => c.personaId).filter(Boolean))] as string[];
  const personaRows = personaIds.length > 0
    ? await db.select().from(audiences).where(inArray(audiences.id, personaIds))
    : [];

  const personaMap = new Map(personaRows.map((p) => [p.id, p]));

  const grouped = new Map<string, { persona: typeof personaRows[0]; creativeList: typeof creativeRows }>();
  for (const c of creativeRows) {
    const pid = c.personaId ?? 'unknown';
    if (!grouped.has(pid)) {
      grouped.set(pid, { persona: personaMap.get(pid)!, creativeList: [] });
    }
    grouped.get(pid)!.creativeList.push(c);
  }

  let index = 0;
  const results: Array<{
    persona: string;
    iconName: string;
    iconBg: string;
    iconColor: string;
    theme: string;
    images: Array<{ id: number | string; url: string; title: string }>;
  }> = [];

  for (const [, group] of grouped) {
    const config = getPersonaIconConfig(index);
    const personaName = group.persona?.name?.replace('The ', '') ?? 'Unknown';
    const allImages: Array<{ id: number | string; url: string; title: string }> = [];

    for (const c of group.creativeList) {
      const variants = (c.variants as CreativeVariantData[]) ?? [];
      for (const v of variants) {
        allImages.push({
          id: v.id ?? allImages.length + 1,
          url: getCreativeImage(v.title ?? ''),
          title: v.title ?? 'Creative',
        });
      }
    }

    results.push({
      persona: personaName,
      iconName: config.iconName,
      iconBg: config.iconBg,
      iconColor: config.iconColor,
      theme: group.creativeList[0]?.prompt ?? 'AI Generated',
      images: allImages,
    });
    index++;
  }

  return results;
}

// ─── Distribution ───

export async function getCampaignDistribution(campaignId: string) {
  const depRows = await db
    .select()
    .from(deployments)
    .where(eq(deployments.campaignId, campaignId));

  if (depRows.length === 0) return null;

  const creativeIds = [...new Set(depRows.map((d) => d.creativeId).filter(Boolean))] as string[];
  const creativeRows = creativeIds.length > 0
    ? await db.select().from(creatives).where(inArray(creatives.id, creativeIds))
    : [];

  const personaIds = [...new Set(creativeRows.map((c) => c.personaId).filter(Boolean))] as string[];
  const personaRows = personaIds.length > 0
    ? await db.select().from(audiences).where(inArray(audiences.id, personaIds))
    : [];

  const creativeMap = new Map(creativeRows.map((c) => [c.id, c]));
  const personaMap = new Map(personaRows.map((p) => [p.id, p]));

  const adSetMap = new Map<string, {
    personaName: string;
    creativeCount: number;
    totalBudget: number;
    iconIndex: number;
    aiRecommendedPlatforms: string[];
    confidenceScore: number;
    recommendationReason: string;
  }>();
  const platformSet = new Map<string, { totalReach: number; totalBudget: number }>();

  let personaIndex = 0;
  for (const dep of depRows) {
    const creative = dep.creativeId ? creativeMap.get(dep.creativeId) : null;
    const persona = creative?.personaId ? personaMap.get(creative.personaId) : null;
    const personaId = persona?.id ?? 'unknown';

    if (!adSetMap.has(personaId)) {
      adSetMap.set(personaId, {
        personaName: persona?.name?.replace('The ', '') ?? 'Unknown',
        creativeCount: 0,
        totalBudget: 0,
        iconIndex: personaIndex++,
        aiRecommendedPlatforms: (dep.aiRecommendedPlatforms as string[]) ?? [],
        confidenceScore: Number(dep.confidenceScore ?? 0),
        recommendationReason: dep.recommendationReason ?? '',
      });
    }
    const adSet = adSetMap.get(personaId)!;
    adSet.creativeCount++;
    adSet.totalBudget += Number(dep.budget);

    const platform = dep.platform;
    if (!platformSet.has(platform)) {
      platformSet.set(platform, { totalReach: 0, totalBudget: 0 });
    }
    const plat = platformSet.get(platform)!;
    plat.totalReach += parseReach(dep.estimatedReach);
    plat.totalBudget += Number(dep.budget);
  }

  const adSets = [...adSetMap.entries()].map(([, v]) => {
    const config = getPersonaIconConfig(v.iconIndex);
    return {
      id: v.iconIndex + 1,
      name: `${v.personaName} Ad Set`,
      iconName: config.iconName,
      iconBg: config.iconBg,
      iconColor: config.iconColor,
      creatives: v.creativeCount,
      budget: `฿${v.totalBudget.toLocaleString()}`,
      aiRecommendedPlatforms: v.aiRecommendedPlatforms,
      confidenceScore: v.confidenceScore,
      recommendationReason: v.recommendationReason,
    };
  });

  let platformId = 1;
  const platforms = [...platformSet.entries()].map(([name, v]) => {
    const info = PLATFORM_COLORS[name] ?? { color: '#6B7280', logo: '??', displayName: name };
    return {
      id: platformId++,
      name: info.displayName,
      key: name,
      color: info.color,
      logo: info.logo,
      reach: formatReach(v.totalReach),
    };
  });

  const allPlatformKeys = Object.keys(PLATFORM_COLORS);
  for (const key of allPlatformKeys) {
    if (!platformSet.has(key)) {
      const info = PLATFORM_COLORS[key];
      platforms.push({
        id: platformId++,
        name: info.displayName,
        key,
        color: info.color,
        logo: info.logo,
        reach: '0',
      });
    }
  }

  const totalReach = [...platformSet.values()].reduce((sum, p) => sum + p.totalReach, 0);
  const totalBudget = depRows.reduce((sum, d) => sum + Number(d.budget), 0);

  return {
    adSets,
    platforms,
    summary: {
      totalAdSets: adSets.length,
      totalPlatforms: platformSet.size,
      estimatedReach: formatReach(totalReach),
      totalBudget: `฿${totalBudget.toLocaleString()}`,
    },
  };
}

// ─── Results ───

export async function getCampaignResults(campaignId: string) {
  const metrics = await db
    .select({
      totalImpressions: sql<number>`COALESCE(SUM(${analytics.impressions}), 0)`,
      totalClicks: sql<number>`COALESCE(SUM(${analytics.clicks}), 0)`,
      totalConversions: sql<number>`COALESCE(SUM(${analytics.conversions}), 0)`,
      totalSpend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
      totalRevenue: sql<number>`COALESCE(SUM(${analytics.revenue}::numeric), 0)`,
    })
    .from(analytics)
    .where(eq(analytics.campaignId, campaignId));

  const m = metrics[0];
  const spend = Number(m.totalSpend);
  const revenue = Number(m.totalRevenue);
  const conversions = Number(m.totalConversions);
  const clicks = Number(m.totalClicks);
  const impressions = Number(m.totalImpressions);

  const cpa = conversions > 0 ? spend / conversions : 0;
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
  const roas = spend > 0 ? revenue / spend : 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  const metricsCards = [
    {
      id: 1,
      label: 'CPA (Cost per Acquisition)',
      value: `$${cpa.toFixed(2)}`,
      direction: 'down' as const,
      color: '#00C853',
      bgColor: '#E8F5E9',
      description: `Cost per acquisition across all platforms`,
    },
    {
      id: 2,
      label: 'Conversion Rate',
      value: `${conversionRate.toFixed(1)}%`,
      direction: 'up' as const,
      color: '#00C853',
      bgColor: '#E8F5E9',
      description: `${conversions} conversions from ${clicks} clicks`,
    },
    {
      id: 3,
      label: 'ROAS',
      value: `${roas.toFixed(1)}x`,
      direction: 'up' as const,
      color: '#00C853',
      bgColor: '#E8F5E9',
      description: `$${revenue.toFixed(0)} revenue from $${spend.toFixed(0)} spend`,
    },
    {
      id: 4,
      label: 'CTR (Click-through Rate)',
      value: `${ctr.toFixed(2)}%`,
      direction: 'up' as const,
      color: '#00C853',
      bgColor: '#E8F5E9',
      description: `${clicks} clicks from ${impressions} impressions`,
    },
  ];

  const trend = await getCampaignTrend(campaignId);
  let roasChange = '+0%';
  if (trend.length >= 2) {
    const first = trend[0].roas;
    const last = trend[trend.length - 1].roas;
    if (first > 0) {
      const change = Math.round(((last - first) / first) * 100);
      roasChange = `${change >= 0 ? '+' : ''}${change}%`;
    }
  }

  const logs = await db
    .select()
    .from(optimizationLogs)
    .where(eq(optimizationLogs.campaignId, campaignId))
    .orderBy(desc(optimizationLogs.createdAt));

  const insights = logs.map((log, i) => {
    const platformName = log.platform
      ? (PLATFORM_COLORS[log.platform]?.displayName ?? log.platform)
      : 'Campaign';
    return {
      id: i + 1,
      title: `${platformName} ${log.action === 'increase_budget' ? 'Outperformance' : 'Optimization'}`,
      description: log.reasoning ?? 'Budget adjustment recommendation',
      impact: log.action === 'increase_budget' ? 'High' as const : 'Medium' as const,
    };
  });

  return {
    metrics: metricsCards,
    chartData: trend,
    roasChange,
    insights,
    campaignInfo: {
      platforms: [...new Set(logs.map((l) => l.platform).filter(Boolean))].length,
      period: `${trend.length}-day optimization period`,
    },
  };
}
