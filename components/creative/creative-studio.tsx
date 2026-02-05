'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ChevronDown, RefreshCw, ArrowRight, TrendingUp, Target, Zap, Check, AlertCircle } from 'lucide-react';

const businessGoals = [
  { id: 'vip', label: 'VIP Retention & Upsell', stage: 'Retain & Grow', tag: 'VIP', color: '#9C27B0' },
  { id: 'new', label: 'New Customer Acquisition', stage: 'Attract', tag: 'Acquisition', color: '#00C853' },
  { id: 'returning', label: 'Active Returning Boost', stage: 'Engage', tag: 'Engagement', color: '#0052CC' },
  { id: 'atrisk', label: 'At-Risk Recovery', stage: 'Win-Back', tag: 'Recovery', color: '#FF9800' },
];

const PERSONA_COLORS = ['#00C853', '#0052CC', '#9C27B0', '#FF9800'];

interface DbPersona {
  id: string;
  title: string;
  description: string;
  tags: string[];
  intent: number | null;
  interests: string[];
}

interface CreativeVariant {
  id: number;
  title: string;
  headline: string;
  body: string;
  cta: string;
  platform: string;
  imageUrl?: string;
}

interface CreativeGroup {
  persona: string;
  theme: string;
  images: Array<{ id: number | string; url: string | null; title: string }>;
}

interface CreativeStudioProps {
  campaignId: string;
  personas: DbPersona[];
  creativeGroups: CreativeGroup[];
}

export function CreativeStudio({ campaignId, personas, creativeGroups }: CreativeStudioProps) {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState(businessGoals[0]);
  const [selectedPersonaIdx, setSelectedPersonaIdx] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [variants, setVariants] = useState<CreativeVariant[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hasPersonas = personas.length > 0;
  const selectedPersona = hasPersonas ? personas[selectedPersonaIdx] : null;
  const personaColor = PERSONA_COLORS[selectedPersonaIdx % PERSONA_COLORS.length];

  const handleRegenerate = async () => {
    if (!selectedPersona) return;
    setIsRegenerating(true);
    setError(null);
    setVariants([]);

    try {
      const res = await fetch('/api/ai/creative/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          personaId: selectedPersona.id,
          type: 'image',
          prompt: `${selectedGoal.label} campaign targeting ${selectedPersona.title}: ${selectedPersona.description}`,
          platforms: ['tiktok', 'meta', 'lemon8'],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? 'Failed to generate');
      }

      const { data } = await res.json();
      if (data.variants) setVariants(data.variants);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsRegenerating(false);
    }
  };

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
                value={selectedPersonaIdx}
                onChange={(e) => setSelectedPersonaIdx(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-black/[0.08] rounded-lg bg-[#F4F6F8] appearance-none pr-8"
              >
                {hasPersonas ? (
                  personas.map((p, i) => (
                    <option key={p.id} value={i}>{p.title}</option>
                  ))
                ) : (
                  <option value={0}>No personas available</option>
                )}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            </div>
            {selectedPersona && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {selectedPersona.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ backgroundColor: `${personaColor}15`, color: personaColor }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Strategy Fusion */}
        <div className="bg-gradient-to-br from-[#E8F1FF] to-white rounded-xl p-5 border border-[#0052CC]/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#0052CC]" />
            <span className="text-xs font-medium text-[#0052CC]">AI Strategy Fusion</span>
          </div>
          <p className="text-xs text-[#1A1A1A] leading-relaxed">
            {selectedPersona
              ? `${selectedGoal.label} strategy for ${selectedPersona.title}. ${selectedPersona.description}`
              : 'Select a persona to see AI suggestions.'}
          </p>
        </div>

        {/* Context Stats */}
        <div className="bg-white rounded-xl p-5 border border-black/[0.08]">
          <h4 className="text-xs text-[#6B7280] mb-3">Context Stats</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Intent Score</span>
              <span className="font-medium">{selectedPersona?.intent ?? '-'}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Interests</span>
              <span className="font-medium">{selectedPersona?.interests.length ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Variants Generated</span>
              <span className="font-medium">{variants.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Canvas */}
      <div className="col-span-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-[#7B61FF]" />
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Generated Assets (Business + Interest Fusion)
              </h3>
            </div>
            <p className="text-xs text-[#6B7280]">
              AI-crafted creatives optimized for {selectedGoal.label}{selectedPersona ? ` targeting ${selectedPersona.title}` : ''}
            </p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating || !hasPersonas}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-black/[0.08] rounded-lg hover:border-[#7B61FF] hover:bg-[#7B61FF]/5 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={`text-[#7B61FF] ${isRegenerating ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-[#7B61FF]">
              {isRegenerating ? 'Generating...' : 'Regenerate All'}
            </span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!hasPersonas && (
          <div className="text-center py-12 text-[#6B7280]">
            <Sparkles size={32} className="mx-auto mb-3 text-[#7B61FF]/40" />
            <p className="font-medium">No personas available</p>
            <p className="text-sm mt-1">Go to Audience page to analyze and generate personas first</p>
          </div>
        )}

        {/* AI Generated Variants */}
        {variants.length > 0 && (
          <div className="grid grid-cols-2 gap-6">
            {variants.slice(0, 4).map((v, i) => (
              <div key={v.id ?? i} className="bg-white rounded-xl border border-black/[0.08] shadow-md hover:shadow-xl transition-all overflow-hidden group">
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#F4F6F8] to-white">
                  {v.imageUrl ? (
                    <img src={v.imageUrl} alt={v.headline} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/10 via-[#0052CC]/5 to-[#00C853]/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <div className="space-y-3">
                      <span className="inline-block px-2 py-0.5 text-xs bg-white/20 backdrop-blur rounded-full text-white font-medium uppercase">{v.platform}</span>
                      <h3 className="text-xl font-bold text-white leading-tight">{v.headline}</h3>
                      <p className="text-sm text-white/80">{v.body}</p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0052CC] text-white rounded-full text-sm font-medium">
                        {v.cta}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleRegenerate}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-white"
                  >
                    <RefreshCw size={18} className="text-[#7B61FF]" />
                  </button>
                </div>
                <div className="p-4 border-t border-black/[0.08]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-[#1A1A1A] mb-1">{v.title}</p>
                      <div className="flex items-center gap-1">
                        <Check size={12} className="text-[#00C853]" />
                        <span className="text-xs text-[#00C853] font-medium">AI Generated</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-[#E8F1FF] text-[#0052CC] rounded font-medium">{v.platform}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Existing creatives (from DB) when no fresh variants */}
        {variants.length === 0 && hasPersonas && (
          <div className="grid grid-cols-2 gap-6">
            {creativeGroups.length > 0 ? (
              creativeGroups.slice(0, 2).map((group, gi) => (
                <div key={gi} className="bg-white rounded-xl border border-black/[0.08] shadow-md hover:shadow-xl transition-all overflow-hidden group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#F4F6F8] to-white">
                    {group.images[0]?.url ? (
                      <img src={group.images[0].url} alt={group.images[0].title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[#6B7280]">
                        <Sparkles size={32} className="text-[#7B61FF]/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#9C27B0] rounded-full">
                          <Zap size={12} className="text-white" />
                          <span className="text-xs font-semibold text-white">{group.persona}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight">{group.theme}</h3>
                      </div>
                    </div>
                    <button
                      onClick={handleRegenerate}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-white"
                    >
                      <RefreshCw size={18} className="text-[#7B61FF]" />
                    </button>
                  </div>
                  <div className="p-4 border-t border-black/[0.08]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Existing Creative</p>
                        <div className="flex items-center gap-1">
                          <Check size={12} className="text-[#00C853]" />
                          <span className="text-xs text-[#00C853] font-medium">{group.images.length} variant{group.images.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-[#6B7280]">
                <p className="font-medium">No creatives yet</p>
                <p className="text-sm mt-1">Click &quot;Regenerate All&quot; to generate AI creatives</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="col-span-3 space-y-4">
        <div className="bg-white rounded-xl p-5 border border-black/[0.08]">
          <h3 className="font-medium text-[#1A1A1A] text-sm mb-4">Performance Prediction</h3>

          {variants.length > 0 ? (
            <>
              <div className="text-center mb-4">
                <p className="text-4xl font-medium text-[#00C853]">{variants.length}</p>
                <p className="text-xs text-[#6B7280] mt-1">Variants Generated</p>
                <p className="text-xs text-[#00C853] font-medium">{variants.filter(v => v.imageUrl).length} with AI images</p>
              </div>
              <div className="space-y-3 mb-4">
                {variants.slice(0, 3).map((v, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check size={14} className="text-[#00C853] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-[#6B7280]">{v.platform}: {v.headline}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-[#6B7280]">
              <Target size={24} className="mx-auto mb-2 text-[#6B7280]/40" />
              <p className="text-xs">Generate creatives to see predictions</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-black/[0.08]">
          <h4 className="text-xs text-[#6B7280] mb-3">Generation Summary</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TrendingUp size={14} className="text-[#00C853]" />
              <div className="flex-1">
                <p className="text-xs text-[#6B7280]">Platforms</p>
                <p className="text-sm font-medium">{variants.length > 0 ? [...new Set(variants.map(v => v.platform))].join(', ') : '--'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target size={14} className="text-[#0052CC]" />
              <div className="flex-1">
                <p className="text-xs text-[#6B7280]">Target Persona</p>
                <p className="text-sm font-medium">{selectedPersona?.title ?? '--'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap size={14} className="text-[#FF9800]" />
              <div className="flex-1">
                <p className="text-xs text-[#6B7280]">Business Goal</p>
                <p className="text-sm font-medium">{selectedGoal.label}</p>
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
