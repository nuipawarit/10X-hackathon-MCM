export const dynamic = 'force-dynamic';

import { Sparkles } from 'lucide-react';
import { DistributionClient } from '@/components/distribution/distribution-client';
import { getActiveCampaign, getCampaignDistribution } from '@/lib/db/queries';

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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F1FF] rounded-full">
          <Sparkles className="w-4 h-4 text-[#0052CC]" />
          <span className="text-sm font-medium text-[#0052CC]">AI-Optimized Distribution</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Campaign Distribution Flow</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto">
          AI recommends optimal platform placement based on audience behavior and performance data
        </p>
      </div>

      <DistributionClient
        adSets={dist.adSets}
        platforms={dist.platforms}
        summary={dist.summary}
      />
    </div>
  );
}
