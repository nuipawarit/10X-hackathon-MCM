export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { PersonaCard } from '@/components/audience/persona-card';
import { TransformationVisual } from '@/components/audience/transformation-visual';
import { getActiveCampaign, getCampaignPersonas } from '@/lib/db/queries';

export default async function AudiencePage() {
  const campaign = await getActiveCampaign();
  const personas = campaign ? await getCampaignPersonas(campaign.id) : [];

  if (personas.length === 0) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16 text-[#6B7280]">
        <p className="text-lg font-medium">No data available</p>
        <p className="text-sm mt-1">Create a campaign to get started</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F1FF] rounded-full mb-2">
          <Sparkles className="w-4 h-4 text-[#0052CC]" />
          <span className="text-sm font-medium text-[#0052CC]">AI-Powered Analysis</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Audience Insight Decoder</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto">
          Our AI has analyzed your campaign data and discovered high-intent audience segments
        </p>
      </div>

      <TransformationVisual personas={personas} />

      <div className="grid md:grid-cols-2 gap-6">
        {personas.map((persona) => (
          <PersonaCard key={persona.id} {...persona} />
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Link
          href="/creative"
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Generate Targeted Creatives
        </Link>
      </div>
    </div>
  );
}
