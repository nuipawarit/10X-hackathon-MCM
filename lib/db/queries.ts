import { db } from '@/lib/db';
import { campaigns, analytics, audiences, creatives, deployments, optimizationLogs } from '@/lib/db/schema';
import { eq, sql, asc, desc } from 'drizzle-orm';
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

// ─── Dashboard ───

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

export async function getDeploymentPerformance(campaignId: string) {
  const rows = await db
    .select({
      deploymentId: analytics.deploymentId,
      platform: analytics.platform,
      totalImpressions: sql<number>`COALESCE(SUM(${analytics.impressions}), 0)`,
      totalClicks: sql<number>`COALESCE(SUM(${analytics.clicks}), 0)`,
      totalConversions: sql<number>`COALESCE(SUM(${analytics.conversions}), 0)`,
      totalSpend: sql<number>`COALESCE(SUM(${analytics.spend}::numeric), 0)`,
    })
    .from(analytics)
    .where(eq(analytics.campaignId, campaignId))
    .groupBy(analytics.deploymentId, analytics.platform);

  const deploymentRows = await db
    .select({ id: deployments.id, creativeId: deployments.creativeId })
    .from(deployments)
    .where(eq(deployments.campaignId, campaignId));

  const creativeRows = await db
    .select({ id: creatives.id, prompt: creatives.prompt })
    .from(creatives)
    .where(eq(creatives.campaignId, campaignId));

  const creativeMap = new Map(creativeRows.map((c) => [c.id, c]));
  const deploymentMap = new Map(deploymentRows.map((d) => [d.id, d]));

  return rows
    .filter((r) => r.platform !== null)
    .map((row, i) => {
      const dep = row.deploymentId ? deploymentMap.get(row.deploymentId) : null;
      const creative = dep?.creativeId ? creativeMap.get(dep.creativeId) : null;
      const platform = row.platform!;
      const platformInfo = PLATFORM_COLORS[platform] ?? { color: '#6B7280', displayName: platform };

      const spend = Number(row.totalSpend);
      const conversions = Number(row.totalConversions);
      const impressions = Number(row.totalImpressions);
      const clicks = Number(row.totalClicks);

      const cpa = conversions > 0 ? spend / conversions : 0;
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const isHighPerf = cpa < 10;

      return {
        id: i + 1,
        thumbnail: getCreativeImage(creative?.prompt ?? ''),
        name: creative?.prompt ?? 'Campaign Creative',
        platform: platformInfo.displayName,
        platformColor: platformInfo.color,
        status: isHighPerf ? 'High Performance' : 'Low Performance',
        statusColor: isHighPerf ? '#00C853' : '#FF5252',
        cpa: `$${cpa.toFixed(2)}`,
        ctr: `${ctr.toFixed(1)}%`,
        conversions,
      };
    });
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

export async function getCampaignPersonas(campaignId: string) {
  const rows = await db
    .select()
    .from(audiences)
    .where(eq(audiences.campaignId, campaignId))
    .orderBy(desc(audiences.intentScore));

  return rows.map((row, index) => {
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

// ─── Creative ───

interface CreativeVariantData { id?: number; title?: string; imageUrl?: string; headline?: string; body?: string; cta?: string; platform?: string }

export async function getCampaignCreatives(campaignId: string) {
  const creativeRows = await db
    .select()
    .from(creatives)
    .where(eq(creatives.campaignId, campaignId));

  const personaIds = [...new Set(creativeRows.map((c) => c.personaId).filter(Boolean))] as string[];
  const personaRows = personaIds.length > 0
    ? await db.select().from(audiences).where(
        sql`${audiences.id} IN ${sql.raw(`('${personaIds.join("','")}')`)}`,
      )
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
    ? await db.select().from(creatives).where(
        sql`${creatives.id} IN ${sql.raw(`('${creativeIds.join("','")}')`)}`,
      )
    : [];

  const personaIds = [...new Set(creativeRows.map((c) => c.personaId).filter(Boolean))] as string[];
  const personaRows = personaIds.length > 0
    ? await db.select().from(audiences).where(
        sql`${audiences.id} IN ${sql.raw(`('${personaIds.join("','")}')`)}`,
      )
    : [];

  const creativeMap = new Map(creativeRows.map((c) => [c.id, c]));
  const personaMap = new Map(personaRows.map((p) => [p.id, p]));

  const adSetMap = new Map<string, { personaName: string; creativeCount: number; totalBudget: number; iconIndex: number }>();
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
      name: `${v.personaName} Ads Set`,
      iconName: config.iconName,
      iconBg: config.iconBg,
      iconColor: config.iconColor,
      creatives: v.creativeCount,
      budget: `$${v.totalBudget.toLocaleString()}`,
    };
  });

  let platformId = 1;
  const platforms = [...platformSet.entries()].map(([name, v]) => {
    const info = PLATFORM_COLORS[name] ?? { color: '#6B7280', logo: '??', displayName: name };
    return {
      id: platformId++,
      name: info.displayName,
      color: info.color,
      logo: info.logo,
      reach: formatReach(v.totalReach),
    };
  });

  const totalReach = [...platformSet.values()].reduce((sum, p) => sum + p.totalReach, 0);
  const totalBudget = depRows.reduce((sum, d) => sum + Number(d.budget), 0);

  return {
    adSets,
    platforms,
    summary: {
      totalAdSets: adSets.length,
      totalPlatforms: platforms.length,
      estimatedReach: formatReach(totalReach),
      totalBudget: `$${totalBudget.toLocaleString()}`,
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
