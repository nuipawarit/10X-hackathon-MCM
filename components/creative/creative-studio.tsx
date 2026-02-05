'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, RefreshCw, ArrowRight, TrendingUp, Target, Zap, Check } from 'lucide-react';
import { getCreativeImage } from '@/lib/db/constants';

const businessGoals = [
  { id: 'vip', label: 'VIP Retention & Upsell', stage: 'Retain & Grow', tag: 'VIP', color: '#9C27B0' },
  { id: 'new', label: 'New Customer Acquisition', stage: 'Attract', tag: 'Acquisition', color: '#00C853' },
  { id: 'returning', label: 'Active Returning Boost', stage: 'Engage', tag: 'Engagement', color: '#0052CC' },
  { id: 'atrisk', label: 'At-Risk Recovery', stage: 'Win-Back', tag: 'Recovery', color: '#FF9800' },
];

const targetPersonas = [
  { id: 'geeks', label: 'The Skincare Geeks', segment: 'Science-focused', tag: 'Research-driven', color: '#00C853' },
  { id: 'minimalist', label: 'Clean Minimalist', segment: 'Simple routine', tag: 'Less-is-more', color: '#0052CC' },
  { id: 'luxury', label: 'Luxury Seekers', segment: 'Premium products', tag: 'High-end', color: '#9C27B0' },
  { id: 'eco', label: 'Eco Conscious', segment: 'Sustainable beauty', tag: 'Green', color: '#00C853' },
];

const strategySuggestions: Record<string, Record<string, string>> = {
  vip: {
    geeks: 'VIP geeks respond to exclusive early-access to clinical formulations. Leverage scientific credibility with premium packaging.',
    minimalist: 'VIP minimalists value curated, limited-edition simple routines. Focus on quality over quantity messaging.',
    luxury: 'High-LTV luxury seekers expect exclusive, personalized premium experiences. Emphasize rarity and craftsmanship.',
    eco: 'Eco-conscious VIPs want sustainable luxury. Highlight ethical sourcing and premium eco-packaging.',
  },
  new: {
    geeks: 'New science-focused customers need education-first content. Lead with ingredient transparency and clinical proof.',
    minimalist: 'First-time minimalists seek starter kits. Simple, clean messaging with easy-to-follow routines.',
    luxury: 'Premium-curious newcomers respond to aspirational lifestyle content. Showcase the luxury experience.',
    eco: 'New eco-conscious shoppers look for brand values alignment. Lead with sustainability credentials.',
  },
  returning: {
    geeks: 'Returning geeks are ready for advanced formulations. Cross-sell complementary products from their routine.',
    minimalist: 'Loyal minimalists respond to refill programs and routine optimization. Keep it simple and consistent.',
    luxury: 'Returning luxury customers expect personalized recommendations. Use purchase history for upsell.',
    eco: 'Eco-returning customers value loyalty rewards tied to sustainability impact. Show their contribution.',
  },
  atrisk: {
    geeks: 'At-risk geeks may have found alternatives. Win back with new clinical studies and exclusive formulations.',
    minimalist: 'Lapsing minimalists might feel overwhelmed. Simplify their return with a single hero product.',
    luxury: 'At-risk luxury customers need exclusive re-engagement. VIP-only comeback offers with personal touch.',
    eco: 'Eco-conscious at-risk users may have concerns about practices. Address transparency and improvements.',
  },
};

interface CreativeGroup {
  persona: string;
  theme: string;
  images: Array<{ id: number | string; url: string; title: string }>;
}

interface CreativeStudioProps {
  creativeGroups: CreativeGroup[];
}

export function CreativeStudio({ creativeGroups }: CreativeStudioProps) {
  const [selectedGoal, setSelectedGoal] = useState(businessGoals[0]);
  const [selectedPersona, setSelectedPersona] = useState(targetPersonas[0]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const suggestion = strategySuggestions[selectedGoal.id]?.[selectedPersona.id] ?? 'Select a goal and persona to see AI suggestions.';

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 2000);
  };

  const allImages = creativeGroups.flatMap(g => g.images).slice(0, 2);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Sidebar */}
      <div className="col-span-3 space-y-4">
        <div className="bg-white rounded-xl p-5 border border-black/[0.08] space-y-4">
          <h3 className="font-medium text-[#1A1A1A] text-sm">Campaign Context</h3>

          {/* Business Goal */}
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">Business Goal</label>
            <div className="relative">
              <select
                value={selectedGoal.id}
                onChange={(e) => setSelectedGoal(businessGoals.find(g => g.id === e.target.value)!)}
                className="w-full px-3 py-2 text-sm border border-black/[0.08] rounded-lg bg-[#F4F6F8] appearance-none pr-8"
              >
                {businessGoals.map(g => (
                  <option key={g.id} value={g.id}>{g.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium" style={{ backgroundColor: `${selectedGoal.color}15`, color: selectedGoal.color }}>
              {selectedGoal.tag}
            </span>
          </div>

          {/* Target Persona */}
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">Target Persona</label>
            <div className="relative">
              <select
                value={selectedPersona.id}
                onChange={(e) => setSelectedPersona(targetPersonas.find(p => p.id === e.target.value)!)}
                className="w-full px-3 py-2 text-sm border border-black/[0.08] rounded-lg bg-[#F4F6F8] appearance-none pr-8"
              >
                {targetPersonas.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium" style={{ backgroundColor: `${selectedPersona.color}15`, color: selectedPersona.color }}>
              {selectedPersona.tag}
            </span>
          </div>
        </div>

        {/* AI Strategy Fusion */}
        <div className="bg-gradient-to-br from-[#E8F1FF] to-white rounded-xl p-5 border border-[#0052CC]/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#0052CC]" />
            <span className="text-xs font-medium text-[#0052CC]">AI Strategy Fusion</span>
          </div>
          <p className="text-xs text-[#1A1A1A] leading-relaxed">{suggestion}</p>
        </div>

        {/* Context Stats */}
        <div className="bg-white rounded-xl p-5 border border-black/[0.08]">
          <h4 className="text-xs text-[#6B7280] mb-3">Context Stats</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-[#6B7280]">Segment Size</span><span className="font-medium">2,400</span></div>
            <div className="flex justify-between"><span className="text-[#6B7280]">Avg. Order Value</span><span className="font-medium">฿4,250</span></div>
            <div className="flex justify-between"><span className="text-[#6B7280]">Purchase Freq.</span><span className="font-medium">3.2x/mo</span></div>
          </div>
        </div>
      </div>

      {/* Center Canvas */}
      <div className="col-span-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[#1A1A1A]">Generated Creatives</h3>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0052CC] bg-[#E8F1FF] rounded-lg hover:bg-[#D0E3FF] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {allImages.map((image) => (
            <div key={image.id} className="group relative bg-white rounded-xl border border-black/[0.08] overflow-hidden hover:shadow-lg transition-all">
              <img src={image.url} alt={image.title} className="w-full h-56 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium">{image.title}</p>
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-[#00C853] text-white text-xs rounded-full font-medium">AI Generated</span>
              </div>
            </div>
          ))}
        </div>

        {allImages.length === 0 && (
          <div className="bg-[#F4F6F8] rounded-xl p-12 text-center border-2 border-dashed border-black/[0.08]">
            <Sparkles size={32} className="text-[#6B7280] mx-auto mb-3" />
            <p className="text-[#6B7280]">Select a goal and persona, then generate creatives</p>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="col-span-3 space-y-4">
        <div className="bg-white rounded-xl p-5 border border-black/[0.08]">
          <h3 className="font-medium text-[#1A1A1A] text-sm mb-4">Performance Prediction</h3>

          <div className="text-center mb-4">
            <p className="text-4xl font-medium text-[#00C853]">4.8%</p>
            <p className="text-xs text-[#6B7280] mt-1">Predicted Conversion Rate</p>
            <p className="text-xs text-[#00C853] font-medium">+2.1% vs category avg</p>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-2">
              <Check size={14} className="text-[#00C853] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#6B7280]">Strong ingredient-science messaging matches geek persona preferences</p>
            </div>
            <div className="flex items-start gap-2">
              <Check size={14} className="text-[#00C853] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#6B7280]">VIP exclusivity triggers higher engagement from loyal customers</p>
            </div>
            <div className="flex items-start gap-2">
              <Check size={14} className="text-[#00C853] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#6B7280]">Visual format optimized for TikTok and Lemon8 feeds</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-black/[0.08]">
          <h4 className="text-xs text-[#6B7280] mb-3">Expected Impact</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TrendingUp size={14} className="text-[#00C853]" />
              <div className="flex-1">
                <p className="text-xs text-[#6B7280]">Click-Through Rate</p>
                <p className="text-sm font-medium">3.2% (estimated)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target size={14} className="text-[#0052CC]" />
              <div className="flex-1">
                <p className="text-xs text-[#6B7280]">CPA Improvement</p>
                <p className="text-sm font-medium">-35% vs current</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap size={14} className="text-[#FF9800]" />
              <div className="flex-1">
                <p className="text-xs text-[#6B7280]">Expected ROAS</p>
                <p className="text-sm font-medium">4.5x</p>
              </div>
            </div>
          </div>
        </div>

        <a
          href="/distribution"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-colors text-sm"
        >
          Push to Ad Manager
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
