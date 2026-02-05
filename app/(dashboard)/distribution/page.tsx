'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FlaskConical, Building2, Rocket, Users, Loader2, CheckCircle } from 'lucide-react';

interface Platform {
  id?: string;
  platform: string;
  status: string;
  accountId?: string;
}

interface Persona {
  id: string;
  name: string;
}

const platformConfig: Record<string, { color: string; logo: string; name: string }> = {
  meta: { color: '#1877F2', logo: 'FB', name: 'Facebook' },
  tiktok: { color: '#000000', logo: 'TT', name: 'TikTok' },
  google: { color: '#4285F4', logo: 'G', name: 'Google' },
  instagram: { color: '#E1306C', logo: 'IG', name: 'Instagram' },
  line: { color: '#00B900', logo: 'LN', name: 'LINE' },
  lemon8: { color: '#FFB800', logo: 'L8', name: 'Lemon8' },
};

const iconMap: Record<number, { icon: typeof FlaskConical; bg: string; color: string }> = {
  0: { icon: FlaskConical, bg: '#E8F5E9', color: '#00C853' },
  1: { icon: Building2, bg: '#E3F2FD', color: '#0052CC' },
  2: { icon: Users, bg: '#FFF3E0', color: '#FF9800' },
};

const fallbackAdSets = [
  { id: '1', name: 'Skincare Geeks', creatives: 3, budget: '$2,500' },
  { id: '2', name: 'City Commuter', creatives: 3, budget: '$2,500' },
];

export default function DistributionPage() {
  const router = useRouter();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [platformsRes, campaignsRes] = await Promise.all([
          fetch('/api/integrations'),
          fetch('/api/campaigns'),
        ]);

        if (platformsRes.ok) {
          const platformsData = await platformsRes.json();
          setPlatforms(platformsData.data?.platforms || []);
        }

        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json();
          if (campaignsData.data?.[0]?.id) {
            const personasRes = await fetch(`/api/ai/audience/${campaignsData.data[0].id}`);
            if (personasRes.ok) {
              const personasData = await personasRes.json();
              setPersonas(personasData.data?.personas || []);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load platform data. Using demo content.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleLaunch() {
    setLaunching(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLaunched(true);
      setTimeout(() => router.push('/results'), 1500);
    } catch (err) {
      console.error('Error launching campaign:', err);
      setError('Failed to launch campaign. Please try again.');
    } finally {
      setLaunching(false);
    }
  }

  const activePlatforms = platforms.filter((p) => p.status === 'active');
  const adSets = personas.length > 0
    ? personas.slice(0, 2).map((p, i) => ({
        id: p.id,
        name: `${p.name} Ads`,
        creatives: 3,
        budget: `$${(2500).toLocaleString()}`,
      }))
    : fallbackAdSets;

  const displayPlatforms = activePlatforms.length > 0
    ? activePlatforms.map((p) => ({
        ...p,
        ...platformConfig[p.platform],
        reach: `${Math.floor(Math.random() * 400 + 200)}K`,
      }))
    : [
        { platform: 'tiktok', ...platformConfig.tiktok, status: 'active', reach: '450K' },
        { platform: 'meta', ...platformConfig.meta, status: 'active', reach: '380K' },
        { platform: 'google', ...platformConfig.google, status: 'active', reach: '320K' },
      ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
          <p className="text-[#6B7280]">Loading distribution data...</p>
        </div>
      </div>
    );
  }

  if (launched) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle className="w-16 h-16 text-[#00C853]" />
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Campaign Launched!</h2>
          <p className="text-[#6B7280]">Redirecting to results...</p>
        </div>
      </div>
    );
  }

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

      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 text-center">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
              Ad Sets
            </h3>
            {adSets.map((adSet, index) => {
              const { icon: Icon, bg, color } = iconMap[index % 3];
              return (
                <div
                  key={adSet.id}
                  className="bg-gradient-to-br from-white to-[#F4F6F8] rounded-lg p-5 border border-[rgba(0,0,0,0.08)] shadow-sm"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1A1A1A] mb-1">{adSet.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                        <span>{adSet.creatives} Creatives</span>
                        <span>•</span>
                        <span className="font-medium text-[#0052CC]">{adSet.budget}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block lg:col-span-4 relative h-96">
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              <path d="M 0 60 Q 100 60, 200 40" fill="none" stroke="#00C853" strokeWidth="3" strokeDasharray="5,5" />
              <path d="M 0 60 Q 100 60, 200 100" fill="none" stroke="#00C853" strokeWidth="3" strokeDasharray="5,5" />
              <path d="M 0 260 Q 100 260, 200 200" fill="none" stroke="#0052CC" strokeWidth="3" strokeDasharray="5,5" />
              <path d="M 0 260 Q 100 260, 200 260" fill="none" stroke="#0052CC" strokeWidth="3" strokeDasharray="5,5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[#F4F6F8] rounded-lg px-4 py-2 border border-[rgba(0,0,0,0.08)]">
                <p className="text-xs font-medium text-[#6B7280]">AI-Optimized Routing</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
              Platforms
            </h3>
            {displayPlatforms.slice(0, 4).map((platform, index) => (
              <div
                key={platform.platform}
                className="bg-white rounded-lg p-5 border-2 transition-all hover:shadow-md"
                style={{ borderColor: platform.color }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold"
                    style={{ backgroundColor: platform.color }}
                  >
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Ad Sets</p>
          <p className="text-3xl font-semibold text-[#1A1A1A]">{adSets.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Platforms</p>
          <p className="text-3xl font-semibold text-[#1A1A1A]">{Math.min(displayPlatforms.length, 4)}</p>
        </div>
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Estimated Reach</p>
          <p className="text-3xl font-semibold text-[#0052CC]">1.63M</p>
        </div>
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Budget</p>
          <p className="text-3xl font-semibold text-[#1A1A1A]">${(adSets.length * 2500).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={handleLaunch}
          disabled={launching}
          className="px-8 py-3 bg-[#00C853] text-white rounded-lg font-medium hover:bg-[#00A843] transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          {launching ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Launching...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Launch Campaign
            </>
          )}
        </button>
      </div>
    </div>
  );
}
