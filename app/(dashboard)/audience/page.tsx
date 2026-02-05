export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { PersonaCard } from '@/components/audience/persona-card';
import { TransformationVisual } from '@/components/audience/transformation-visual';
import { AudienceClient } from '@/components/audience/audience-client';
import { LifecycleCards } from '@/components/audience/lifecycle-cards';
import { SegmentGrowthChart, RadarComparison } from '@/components/audience/segment-charts';
import { SegmentActions } from '@/components/audience/segment-actions';
import { AnalyzeButton } from '@/components/audience/analyze-button';
import { getActiveCampaign, getConsumerPersonas, getLifecycleSegments } from '@/lib/db/queries';

export default async function AudiencePage() {
  const campaign = await getActiveCampaign();
  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16 text-[#6B7280]">
        <p className="text-lg font-medium">No data available</p>
        <p className="text-sm mt-1">Create a campaign to get started</p>
      </div>
    );
  }

  const [personas, lifecycleSegments] = await Promise.all([
    getConsumerPersonas(campaign.id),
    getLifecycleSegments(campaign.id),
  ]);

  const consumerView = (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F1FF] rounded-full">
          <Sparkles className="w-4 h-4 text-[#0052CC]" />
          <span className="text-sm font-medium text-[#0052CC]">AI-Powered Analysis</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Audience Insight Decoder</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto">
          Our AI has analyzed your campaign data and discovered high-intent audience segments
        </p>
      </div>

      <div className="flex justify-center">
        <AnalyzeButton campaignId={campaign.id} hasExistingPersonas={personas.length > 0} />
      </div>

      {personas.length > 0 && <TransformationVisual personas={personas} />}

      <div className="grid md:grid-cols-2 gap-6">
        {personas.map((persona) => (
          <PersonaCard key={persona.id} {...persona} />
        ))}
      </div>

      {personas.length > 0 && (
        <div className="flex justify-center pt-4">
          <Link
            href="/creative"
            className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate Targeted Creatives
          </Link>
        </div>
      )}
    </div>
  );

  const businessView = (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F1FF] rounded-full">
          <Sparkles className="w-4 h-4 text-[#0052CC]" />
          <span className="text-sm font-medium text-[#0052CC]">AI-Powered Lifecycle Intelligence</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Business Lifecycle Insights</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto">
          Understand your customer journey from acquisition to retention
        </p>
      </div>

      {lifecycleSegments.length > 0 && <LifecycleCards segments={lifecycleSegments} />}

      <div className="grid lg:grid-cols-2 gap-6">
        <SegmentGrowthChart />
        <RadarComparison />
      </div>

      {lifecycleSegments.length > 0 && <SegmentActions segments={lifecycleSegments} />}

      <div className="flex justify-center pt-4">
        <Link
          href="/creative"
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Continue to Creative Studio
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AudienceClient consumerView={consumerView} businessView={businessView} />
    </div>
  );
}
