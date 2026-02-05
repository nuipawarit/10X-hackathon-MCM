'use client';

import { Wand2 } from 'lucide-react';

export function PromptInput() {
  return (
    <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Refine Creative Prompt</h3>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="E.g., 'Add more natural lighting' or 'Include product benefits text'"
          className="flex-1 px-4 py-3 bg-[#F4F6F8] border border-[rgba(0,0,0,0.08)] rounded-lg text-[#1A1A1A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
        />
        <button className="px-6 py-3 bg-[#F4F6F8] text-[#1A1A1A] rounded-lg font-medium hover:bg-[#E0E4E8] transition-all border border-[rgba(0,0,0,0.08)]">
          <Wand2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
