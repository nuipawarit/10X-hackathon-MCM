'use client';

import { useState } from 'react';
import { Users, Briefcase } from 'lucide-react';

interface AudienceClientProps {
  consumerView: React.ReactNode;
  businessView: React.ReactNode;
}

export function AudienceClient({ consumerView, businessView }: AudienceClientProps) {
  const [viewMode, setViewMode] = useState<'consumer' | 'business'>('consumer');

  return (
    <>
      <div className="flex justify-center">
        <div className="inline-flex bg-white rounded-xl p-1 border border-black/[0.08]">
          <button
            onClick={() => setViewMode('consumer')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'consumer'
                ? 'bg-[#0052CC] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            <Users size={16} />
            Consumer Insights
          </button>
          <button
            onClick={() => setViewMode('business')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'business'
                ? 'bg-[#0052CC] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            <Briefcase size={16} />
            Business Insights
          </button>
        </div>
      </div>

      {viewMode === 'consumer' ? consumerView : businessView}
    </>
  );
}
