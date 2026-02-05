'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Users,
  FlaskConical,
  Building2,
  ArrowRight,
  Sparkles,
  Target,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  tagline?: string;
  intentScore: number;
  segmentSize?: number;
  demographics?: {
    ageRange?: string;
    genderSplit?: { male: number; female: number };
    locations?: string[];
  };
  psychographics?: {
    values?: string[];
    painPoints?: string[];
    motivations?: string[];
  };
  behaviors?: {
    platforms?: string[];
    contentPreferences?: string[];
    purchaseTriggers?: string[];
  };
  interests?: string[];
  aiGenerated?: boolean;
}

const fallbackPersonas = [
  {
    id: '1',
    name: 'The Skincare Geeks',
    tagline: 'Science-focused consumers who research product formulations and value transparency',
    intentScore: 92,
    demographics: {
      ageRange: '25-40',
      locations: ['Bangkok', 'Chiang Mai'],
    },
    interests: ['Clean Beauty', 'Dermatology', 'Product Research'],
    aiGenerated: true,
  },
  {
    id: '2',
    name: 'The City Commuter',
    tagline: 'Busy professionals seeking efficient, protective skincare for daily commutes',
    intentScore: 88,
    demographics: {
      ageRange: '28-45',
      locations: ['Bangkok', 'Nonthaburi'],
    },
    interests: ['Time-saving', 'Urban Lifestyle', 'Multi-tasking Products'],
    aiGenerated: true,
  },
];

const iconMap: Record<number, { icon: typeof FlaskConical; bg: string; color: string }> = {
  0: { icon: FlaskConical, bg: '#E8F5E9', color: '#00C853' },
  1: { icon: Building2, bg: '#E3F2FD', color: '#0052CC' },
  2: { icon: Users, bg: '#FFF3E0', color: '#FF9800' },
};

export default function AudiencePage() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>(fallbackPersonas);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const campaignsRes = await fetch('/api/campaigns');
        if (!campaignsRes.ok) throw new Error('Failed to fetch campaigns');
        const campaignsData = await campaignsRes.json();

        if (campaignsData.data?.[0]?.id) {
          const cId = campaignsData.data[0].id;
          setCampaignId(cId);

          const personasRes = await fetch(`/api/ai/audience/${cId}`);
          if (personasRes.ok) {
            const personasData = await personasRes.json();
            if (personasData.data?.personas?.length > 0) {
              setPersonas(personasData.data.personas);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching personas:', err);
        setError('Unable to load personas. Using demo data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleAnalyze() {
    if (!campaignId) return;
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/audience/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });

      if (!response.ok) throw new Error('Failed to analyze audience');

      const data = await response.json();
      if (data.data?.personas) {
        setPersonas(data.data.personas);
      }
    } catch (err) {
      console.error('Error analyzing audience:', err);
      setError('Failed to analyze audience. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  }

  const getPersonaIcon = (index: number) => {
    const config = iconMap[index % 3];
    return config || iconMap[0];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
          <p className="text-[#6B7280]">Loading audience insights...</p>
        </div>
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
          Our AI has analyzed your campaign data and discovered {personas.length} high-intent audience segments
        </p>
        {campaignId && (
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#F4F6F8] text-[#1A1A1A] rounded-lg hover:bg-[#E0E4E8] transition-colors disabled:opacity-50"
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {analyzing ? 'Analyzing...' : 'Re-analyze Audience'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 text-center">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-8 shadow-sm">
        <div className="flex items-center justify-center gap-8">
          <div className="flex-1 max-w-xs">
            <div className="bg-[#F4F6F8] rounded-lg p-8 text-center">
              <div className="w-20 h-20 bg-[#E0E4E8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-[#6B7280]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Broad Audience</h3>
              <p className="text-sm text-[#6B7280]">Generic targeting</p>
              <div className="mt-4 space-y-2">
                <div className="text-xs text-[#6B7280]">
                  <span className="font-medium">Reach:</span> 2.5M
                </div>
                <div className="text-xs text-[#6B7280]">
                  <span className="font-medium">Avg. Intent:</span> 45%
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="w-8 h-8 text-[#0052CC]" />
            <span className="text-xs font-medium text-[#6B7280]">AI Decoding</span>
          </div>

          <div className="flex-1 max-w-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personas.slice(0, 2).map((persona, index) => {
                const { icon: Icon, bg, color } = getPersonaIcon(index);
                return (
                  <div
                    key={persona.id}
                    className="bg-gradient-to-br from-white to-[#F4F6F8] rounded-lg p-4 border border-[rgba(0,0,0,0.08)]"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <h4 className="font-semibold text-sm text-[#1A1A1A] mb-2">{persona.name}</h4>
                    <div className="flex items-center gap-1 mb-2">
                      <Target className="w-3 h-3 text-[#00C853]" />
                      <span className="text-xs font-medium text-[#00C853]">
                        {persona.intentScore}% Intent
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {personas.map((persona, index) => {
          const { icon: Icon, bg, color } = getPersonaIcon(index);
          const tags = persona.behaviors?.purchaseTriggers?.slice(0, 3) ||
            persona.interests?.slice(0, 3) ||
            ['High Intent', 'AI Generated'];

          return (
            <div
              key={persona.id}
              className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 border-b border-[rgba(0,0,0,0.08)]">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-8 h-8" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{persona.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[#F4F6F8] text-[#1A1A1A] text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">Description</h4>
                  <p className="text-sm text-[#6B7280]">{persona.tagline || 'AI-generated persona based on campaign data'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">Demographics</h4>
                  <p className="text-sm text-[#6B7280]">
                    {persona.demographics?.ageRange || 'N/A'}, {persona.demographics?.locations?.join(', ') || 'Various locations'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">Key Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {(persona.interests || []).map((interest) => (
                      <span key={interest} className="px-2 py-1 bg-[#E8F1FF] text-[#0052CC] text-xs rounded">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">Purchase Intent</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280]">Likelihood to convert</span>
                      <span className="font-semibold text-[#00C853]">{persona.intentScore}%</span>
                    </div>
                    <div className="w-full bg-[#E0E4E8] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#00C853] h-full rounded-full transition-all"
                        style={{ width: `${persona.intentScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => router.push('/creative')}
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Generate Targeted Creatives
        </button>
      </div>
    </div>
  );
}
