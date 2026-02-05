'use client';

import { useRouter } from 'next/navigation';
import { FlaskConical, Building2, Sparkles } from 'lucide-react';
import { PersonaCard } from '@/components/audience/persona-card';
import { TransformationVisual } from '@/components/audience/transformation-visual';

const fallbackPersonas = [
  {
    id: 1,
    title: 'The Skincare Geeks',
    icon: FlaskConical,
    iconBg: '#E8F5E9',
    iconColor: '#00C853',
    tags: ['Ingredients', 'Sensitive Skin', 'Reviews'],
    intent: 92,
    description: 'Science-focused consumers who research product formulations and value transparency',
    demographics: '25-40, College-educated, Urban',
    interests: ['Clean Beauty', 'Dermatology', 'Product Research'],
  },
  {
    id: 2,
    title: 'The City Commuter',
    icon: Building2,
    iconBg: '#E3F2FD',
    iconColor: '#0052CC',
    tags: ['Anti-pollution', 'Quick Routine', 'Office'],
    intent: 88,
    description: 'Busy professionals seeking efficient, protective skincare for daily commutes',
    demographics: '28-45, Working Professionals, Metropolitan',
    interests: ['Time-saving', 'Urban Lifestyle', 'Multi-tasking Products'],
  },
];

export default function AudiencePage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F1FF] rounded-full mb-2">
          <Sparkles className="w-4 h-4 text-[#0052CC]" />
          <span className="text-sm font-medium text-[#0052CC]">AI-Powered Analysis</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Audience Insight Decoder</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto">
          Our AI has analyzed your campaign data and discovered two high-intent audience segments
        </p>
      </div>

      <TransformationVisual personas={fallbackPersonas} />

      <div className="grid md:grid-cols-2 gap-6">
        {fallbackPersonas.map((persona) => (
          <PersonaCard key={persona.id} {...persona} />
        ))}
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
