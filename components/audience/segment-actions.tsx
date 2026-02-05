import { ArrowRight } from 'lucide-react';

interface LifecycleSegment {
  id: string;
  name: string;
  stage: 'new' | 'active' | 'vip' | 'at_risk';
  recommendedMessaging: string;
}

const stageColors: Record<string, { color: string; bgColor: string }> = {
  new: { color: '#00C853', bgColor: '#E8F5E9' },
  active: { color: '#0052CC', bgColor: '#E3F2FD' },
  vip: { color: '#9C27B0', bgColor: '#F3E5F5' },
  at_risk: { color: '#FF9800', bgColor: '#FFF3E0' },
};

export function SegmentActions({ segments }: { segments: LifecycleSegment[] }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-black/[0.08]">
      <h4 className="font-medium text-[#1A1A1A] mb-4">Actionable Recommendations</h4>
      <div className="space-y-3">
        {segments.map((seg) => {
          const config = stageColors[seg.stage] ?? stageColors.new;
          return (
            <div key={seg.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F4F6F8] transition-colors">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: config.color }} />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm text-[#1A1A1A]">{seg.name}</span>
                <p className="text-xs text-[#6B7280] mt-0.5 truncate">{seg.recommendedMessaging}</p>
              </div>
              <ArrowRight size={14} className="text-[#6B7280] flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
