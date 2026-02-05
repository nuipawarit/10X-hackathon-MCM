'use client';

import { Users, ArrowRight, Target } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface MiniPersona {
  id: number;
  title: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  intent: number;
}

interface TransformationVisualProps {
  personas: MiniPersona[];
}

export function TransformationVisual({ personas }: TransformationVisualProps) {
  return (
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
              <div className="text-xs text-[#6B7280]"><span className="font-medium">Reach:</span> 2.5M</div>
              <div className="text-xs text-[#6B7280]"><span className="font-medium">Avg. Intent:</span> 45%</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <ArrowRight className="w-8 h-8 text-[#0052CC]" />
          <span className="text-xs font-medium text-[#6B7280]">AI Decoding</span>
        </div>

        <div className="flex-1 max-w-md">
          <div className="grid grid-cols-2 gap-4">
            {personas.map((persona) => (
              <div key={persona.id} className="bg-gradient-to-br from-white to-[#F4F6F8] rounded-lg p-4 border border-[rgba(0,0,0,0.08)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: persona.iconBg }}>
                  <persona.icon className="w-6 h-6" style={{ color: persona.iconColor }} />
                </div>
                <h4 className="font-semibold text-sm text-[#1A1A1A] mb-2">{persona.title}</h4>
                <div className="flex items-center gap-1 mb-2">
                  <Target className="w-3 h-3 text-[#00C853]" />
                  <span className="text-xs font-medium text-[#00C853]">{persona.intent}% Intent</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
