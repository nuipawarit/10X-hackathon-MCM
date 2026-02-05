'use client';

import { useState } from 'react';
import { FlaskConical, Building2, Sparkles, Check, RotateCcw, Rocket, Users } from 'lucide-react';
import { PLATFORM_COLORS } from '@/lib/db/constants';

interface AdSet {
  id: number;
  name: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  creatives: number;
  budget: string;
  aiRecommendedPlatforms: string[];
  confidenceScore: number;
  recommendationReason: string;
}

interface Platform {
  id: number;
  name: string;
  key: string;
  color: string;
  logo: string;
  reach: string;
}

interface DistributionClientProps {
  adSets: AdSet[];
  platforms: Platform[];
  summary: { totalAdSets: number; totalPlatforms: number; estimatedReach: string; totalBudget: string };
}

const PERSONA_ICONS: Record<string, typeof FlaskConical> = { FlaskConical, Building2 };

export function DistributionClient({ adSets, platforms, summary }: DistributionClientProps) {
  const [selections, setSelections] = useState<Record<number, string[]>>(() => {
    const init: Record<number, string[]> = {};
    for (const adSet of adSets) {
      init[adSet.id] = [...adSet.aiRecommendedPlatforms];
    }
    return init;
  });

  const togglePlatform = (adSetId: number, platformKey: string) => {
    setSelections(prev => {
      const current = prev[adSetId] ?? [];
      return {
        ...prev,
        [adSetId]: current.includes(platformKey) ? current.filter(p => p !== platformKey) : [...current, platformKey],
      };
    });
  };

  const matchesAI = (adSetId: number) => {
    const adSet = adSets.find(a => a.id === adSetId);
    if (!adSet) return true;
    const current = selections[adSetId] ?? [];
    return JSON.stringify([...current].sort()) === JSON.stringify([...adSet.aiRecommendedPlatforms].sort());
  };

  const resetToAI = (adSetId: number) => {
    const adSet = adSets.find(a => a.id === adSetId);
    if (!adSet) return;
    setSelections(prev => ({ ...prev, [adSetId]: [...adSet.aiRecommendedPlatforms] }));
  };

  return (
    <div className="space-y-6">
      {adSets.map((adSet) => {
        const Icon = PERSONA_ICONS[adSet.iconName] ?? FlaskConical;
        const isAI = matchesAI(adSet.id);
        const selected = selections[adSet.id] ?? [];

        return (
          <div key={adSet.id} className="bg-white rounded-xl border border-black/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: adSet.iconBg }}>
                  <Icon className="w-5 h-5" style={{ color: adSet.iconColor }} />
                </div>
                <div>
                  <h4 className="font-medium text-[#1A1A1A]">{adSet.name}</h4>
                  <p className="text-xs text-[#6B7280]">{adSet.creatives} Creatives &bull; {adSet.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isAI ? 'bg-[#E8F1FF] text-[#0052CC]' : 'bg-[#FFF3E0] text-[#FF9800]'}`}>
                  {isAI ? 'AI Suggested' : 'Custom Selection'}
                </span>
                {!isAI && (
                  <button onClick={() => resetToAI(adSet.id)} className="text-xs text-[#0052CC] hover:underline flex items-center gap-1">
                    <RotateCcw size={12} /> Reset to AI
                  </button>
                )}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-gradient-to-r from-[#E8F1FF] to-white rounded-lg p-4 mb-4 border border-[#0052CC]/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-[#0052CC]" />
                <span className="text-xs font-medium text-[#0052CC]">AI Recommendation</span>
                <span className="ml-auto text-xs font-medium text-[#0052CC]">{adSet.confidenceScore}% confidence</span>
              </div>
              <p className="text-xs text-[#6B7280]">{adSet.recommendationReason}</p>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {platforms.map((platform) => {
                const isSelected = selected.includes(platform.key);
                const isRecommended = adSet.aiRecommendedPlatforms.includes(platform.key);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(adSet.id, platform.key)}
                    className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? isRecommended ? 'border-[#0052CC] bg-[#E8F1FF]' : 'border-[#FF9800] bg-[#FFF3E0]'
                        : isRecommended ? 'border-dashed border-[#0052CC]/30 bg-white' : 'border-transparent bg-[#F4F6F8]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0052CC] flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-2" style={{ backgroundColor: platform.color }}>
                      {platform.logo}
                    </div>
                    <p className="text-xs font-medium text-[#1A1A1A]">{platform.name}</p>
                    <p className="text-xs text-[#6B7280]">{platform.reach} reach</p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-black/[0.08] p-5">
          <p className="text-xs text-[#6B7280] mb-1">Ad Sets</p>
          <p className="text-2xl font-medium text-[#1A1A1A]">{summary.totalAdSets}</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.08] p-5">
          <p className="text-xs text-[#6B7280] mb-1">Active Platforms</p>
          <p className="text-2xl font-medium text-[#1A1A1A]">{summary.totalPlatforms}</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.08] p-5">
          <p className="text-xs text-[#6B7280] mb-1">Est. Total Reach</p>
          <p className="text-2xl font-medium text-[#0052CC]">{summary.estimatedReach}</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.08] p-5">
          <p className="text-xs text-[#6B7280] mb-1">Total Budget</p>
          <p className="text-2xl font-medium text-[#1A1A1A]">{summary.totalBudget}</p>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <a
          href="/results"
          className="px-8 py-3 bg-[#00C853] text-white rounded-lg font-medium hover:bg-[#00A843] transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
        >
          <Rocket size={18} />
          Launch Campaign
        </a>
      </div>
    </div>
  );
}
