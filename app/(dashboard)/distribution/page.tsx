export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { FlaskConical, Building2, Rocket, Users } from 'lucide-react';
import { getActiveCampaign, getCampaignDistribution } from '@/lib/db/queries';

const PERSONA_ICONS: Record<string, typeof FlaskConical> = { FlaskConical, Building2 };

export default async function DistributionPage() {
  const campaign = await getActiveCampaign();
  const dist = campaign ? await getCampaignDistribution(campaign.id) : null;

  if (!dist) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16 text-[#6B7280]">
        <p className="text-lg font-medium">No data available</p>
        <p className="text-sm mt-1">Create a campaign to get started</p>
      </div>
    );
  }

  const { adSets, platforms, summary } = dist;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F1FF] rounded-full mb-2">
          <Rocket className="w-4 h-4 text-[#0052CC]" />
          <span className="text-sm font-medium text-[#0052CC]">Campaign Distribution</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Campaign Distribution Flow</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto">
          Strategic platform placement based on audience behavior and platform performance
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-8 shadow-sm">
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-4 space-y-6">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-4">Ad Sets</h3>
            {adSets.map((adSet) => {
              const Icon = PERSONA_ICONS[adSet.iconName] ?? FlaskConical;
              return (
                <div key={adSet.id} className="bg-gradient-to-br from-white to-[#F4F6F8] rounded-lg p-5 border border-[rgba(0,0,0,0.08)] shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: adSet.iconBg }}>
                      <Icon className="w-6 h-6" style={{ color: adSet.iconColor }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1A1A1A] mb-1">{adSet.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                        <span>{adSet.creatives} Creatives</span>
                        <span>&bull;</span>
                        <span className="font-medium text-[#0052CC]">{adSet.budget}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-span-4 relative h-96">
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              <path d="M 0 60 Q 100 60, 200 40" fill="none" stroke="#00C853" strokeWidth="3" strokeDasharray="5,5" />
              <path d="M 0 60 Q 100 60, 200 100" fill="none" stroke="#00C853" strokeWidth="3" strokeDasharray="5,5" />
              <path d="M 0 260 Q 100 260, 200 240" fill="none" stroke="#0052CC" strokeWidth="3" strokeDasharray="5,5" />
              <path d="M 0 260 Q 100 260, 200 300" fill="none" stroke="#0052CC" strokeWidth="3" strokeDasharray="5,5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[#F4F6F8] rounded-lg px-4 py-2 border border-[rgba(0,0,0,0.08)]">
                <p className="text-xs font-medium text-[#6B7280]">AI-Optimized Routing</p>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-4">Platforms</h3>
            {platforms.map((platform) => (
              <div key={platform.id} className="bg-white rounded-lg p-5 border-2 transition-all hover:shadow-md" style={{ borderColor: platform.color }}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold" style={{ backgroundColor: platform.color }}>
                    {platform.logo}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#1A1A1A] mb-1">{platform.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <Users className="w-3 h-3" />
                      <span>Est. Reach: {platform.reach}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Ad Sets</p>
          <p className="text-3xl font-semibold text-[#1A1A1A]">{summary.totalAdSets}</p>
        </div>
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Platforms</p>
          <p className="text-3xl font-semibold text-[#1A1A1A]">{summary.totalPlatforms}</p>
        </div>
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Estimated Reach</p>
          <p className="text-3xl font-semibold text-[#0052CC]">{summary.estimatedReach}</p>
        </div>
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Budget</p>
          <p className="text-3xl font-semibold text-[#1A1A1A]">{summary.totalBudget}</p>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Link
          href="/results"
          className="px-8 py-3 bg-[#00C853] text-white rounded-lg font-medium hover:bg-[#00A843] transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
        >
          <Rocket className="w-5 h-5" />
          Launch Campaign
        </Link>
      </div>
    </div>
  );
}
