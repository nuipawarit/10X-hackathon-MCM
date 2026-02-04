'use client';

import { useRouter } from 'next/navigation';
import {
  Users,
  FlaskConical,
  Building2,
  ArrowRight,
  Sparkles,
  Target,
} from 'lucide-react';

const personas = [
  {
    id: 1,
    title: 'The Skincare Geeks',
    icon: FlaskConical,
    iconBg: '#E8F5E9',
    iconColor: '#00C853',
    tags: ['Ingredients', 'Sensitive Skin', 'Reviews'],
    intent: 92,
    description:
      'Science-focused consumers who research product formulations and value transparency',
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
    description:
      'Busy professionals seeking efficient, protective skincare for daily commutes',
    demographics: '28-45, Working Professionals, Metropolitan',
    interests: ['Time-saving', 'Urban Lifestyle', 'Multi-tasking Products'],
  },
];

export default function AudiencePage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F1FF] rounded-full mb-2">
          <Sparkles className="w-4 h-4 text-[#0052CC]" />
          <span className="text-sm font-medium text-[#0052CC]">
            AI-Powered Analysis
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">
          Audience Insight Decoder
        </h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto">
          Our AI has analyzed your campaign data and discovered two high-intent
          audience segments
        </p>
      </div>

      {/* Transformation Visual */}
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-8 shadow-sm">
        <div className="flex items-center justify-center gap-8">
          {/* Before - Broad Audience */}
          <div className="flex-1 max-w-xs">
            <div className="bg-[#F4F6F8] rounded-lg p-8 text-center">
              <div className="w-20 h-20 bg-[#E0E4E8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-[#6B7280]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">
                Broad Audience
              </h3>
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

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="w-8 h-8 text-[#0052CC]" />
            <span className="text-xs font-medium text-[#6B7280]">
              AI Decoding
            </span>
          </div>

          {/* After - Persona Cards Mini */}
          <div className="flex-1 max-w-md">
            <div className="grid grid-cols-2 gap-4">
              {personas.map((persona) => (
                <div
                  key={persona.id}
                  className="bg-gradient-to-br from-white to-[#F4F6F8] rounded-lg p-4 border border-[rgba(0,0,0,0.08)]"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: persona.iconBg }}
                  >
                    <persona.icon
                      className="w-6 h-6"
                      style={{ color: persona.iconColor }}
                    />
                  </div>
                  <h4 className="font-semibold text-sm text-[#1A1A1A] mb-2">
                    {persona.title}
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    <Target className="w-3 h-3 text-[#00C853]" />
                    <span className="text-xs font-medium text-[#00C853]">
                      {persona.intent}% Intent
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Persona Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="p-6 border-b border-[rgba(0,0,0,0.08)]">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: persona.iconBg }}
                >
                  <persona.icon
                    className="w-8 h-8"
                    style={{ color: persona.iconColor }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    {persona.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {persona.tags.map((tag) => (
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

            {/* Card Body */}
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">
                  Description
                </h4>
                <p className="text-sm text-[#6B7280]">{persona.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">
                  Demographics
                </h4>
                <p className="text-sm text-[#6B7280]">{persona.demographics}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">
                  Key Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {persona.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-1 bg-[#E8F1FF] text-[#0052CC] text-xs rounded"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">
                  Purchase Intent
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Likelihood to convert</span>
                    <span className="font-semibold text-[#00C853]">
                      {persona.intent}%
                    </span>
                  </div>
                  <div className="w-full bg-[#E0E4E8] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#00C853] h-full rounded-full transition-all"
                      style={{ width: `${persona.intent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
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
