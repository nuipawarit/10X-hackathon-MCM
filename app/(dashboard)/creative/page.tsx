'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FlaskConical, Building2, Wand2, Send, Loader2, Users } from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  tagline?: string;
}

interface Creative {
  id: string;
  title: string;
  headline?: string;
  bodyCopy?: string;
  thumbnailUrl?: string;
}

const iconMap: Record<number, { icon: typeof FlaskConical; bg: string; color: string }> = {
  0: { icon: FlaskConical, bg: '#E8F5E9', color: '#00C853' },
  1: { icon: Building2, bg: '#E3F2FD', color: '#0052CC' },
  2: { icon: Users, bg: '#FFF3E0', color: '#FF9800' },
};

const fallbackImages = [
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=300&fit=crop',
];

const fallbackCreativeGroups = [
  {
    persona: { id: '1', name: 'Skincare Geeks', tagline: 'Laboratory & Science' },
    images: fallbackImages.map((url, i) => ({ id: `${i}`, url, title: `Creative ${i + 1}` })),
  },
  {
    persona: { id: '2', name: 'City Commuter', tagline: 'Urban & Lifestyle' },
    images: [
      { id: '4', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop', title: 'Cafe Moment' },
      { id: '5', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop', title: 'City Lifestyle' },
      { id: '6', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', title: 'On-the-Go' },
    ],
  },
];

export default function CreativePage() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [creativeGroups, setCreativeGroups] = useState(fallbackCreativeGroups);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const campaignsRes = await fetch('/api/campaigns');
        if (!campaignsRes.ok) throw new Error('Failed to fetch campaigns');
        const campaignsData = await campaignsRes.json();

        if (campaignsData.data?.[0]?.id) {
          const campaignId = campaignsData.data[0].id;

          const personasRes = await fetch(`/api/ai/audience/${campaignId}`);
          if (personasRes.ok) {
            const personasData = await personasRes.json();
            if (personasData.data?.personas?.length > 0) {
              setPersonas(personasData.data.personas);
              setCreativeGroups(
                personasData.data.personas.slice(0, 3).map((p: Persona, i: number) => ({
                  persona: p,
                  images: fallbackImages.map((url, j) => ({
                    id: `${p.id}-${j}`,
                    url,
                    title: `${p.name} Creative ${j + 1}`,
                  })),
                }))
              );
            }
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load data. Using demo content.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleGenerate() {
    if (!selectedPersona || !prompt) return;
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/creative/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: selectedPersona,
          type: 'copy',
          prompt,
          platforms: ['tiktok', 'instagram', 'facebook'],
        }),
      });

      if (!response.ok) throw new Error('Failed to generate creative');

      const data = await response.json();
      if (data.data?.variants) {
        setCreativeGroups((prev) =>
          prev.map((group) =>
            group.persona.id === selectedPersona
              ? {
                  ...group,
                  generatedCopy: data.data.variants,
                }
              : group
          )
        );
      }
      setPrompt('');
    } catch (err) {
      console.error('Error generating creative:', err);
      setError('Failed to generate creative. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
          <p className="text-[#6B7280]">Loading creative studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F5E9] rounded-full mb-2">
          <Wand2 className="w-4 h-4 text-[#00C853]" />
          <span className="text-sm font-medium text-[#00C853]">AI-Generated Creatives</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Generative AI Creative Studio</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto">
          Tailored ad creatives generated for each persona using AI
        </p>
      </div>

      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 text-center">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {creativeGroups.map((group, index) => {
          const { icon: Icon, bg, color } = iconMap[index % 3];
          return (
            <div key={group.persona.id} className="bg-[#2A2A2E] rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: bg }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-1">
                    Target: {group.persona.name}
                  </h2>
                  <p className="text-sm text-gray-400">{group.persona.tagline || 'AI-generated persona'}</p>
                </div>
                <button
                  onClick={() => setSelectedPersona(group.persona.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPersona === group.persona.id
                      ? 'bg-[#0052CC] text-white'
                      : 'bg-[#3A3A3E] text-gray-300 hover:bg-[#4A4A4E]'
                  }`}
                >
                  {selectedPersona === group.persona.id ? 'Selected' : 'Select'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative bg-[#1A1A1E] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#0052CC] transition-all"
                  >
                    <img src={image.url} alt={image.title} className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm font-medium">{image.title}</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="px-2 py-1 bg-[#00C853] text-white text-xs rounded-full font-medium">
                        AI Generated
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Generate New Creative</h3>
        <p className="text-sm text-[#6B7280] mb-4">
          {selectedPersona
            ? `Generating for: ${personas.find((p) => p.id === selectedPersona)?.name || creativeGroups.find((g) => g.persona.id === selectedPersona)?.persona.name}`
            : 'Select a persona above to generate creative'}
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., 'Create ad copy emphasizing scientific ingredients' or 'Focus on time-saving benefits'"
            className="flex-1 px-4 py-3 bg-[#F4F6F8] border border-[rgba(0,0,0,0.08)] rounded-lg text-[#1A1A1A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
            disabled={!selectedPersona}
          />
          <button
            onClick={handleGenerate}
            disabled={!selectedPersona || !prompt || generating}
            className="px-6 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => router.push('/distribution')}
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Deploy to A/B Testing
        </button>
      </div>
    </div>
  );
}
