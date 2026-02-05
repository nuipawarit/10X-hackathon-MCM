import { ArrowRight } from 'lucide-react';
import { LIFECYCLE_STAGE_CONFIG, type LifecycleSegment } from './lifecycle-config';

export function SegmentActions({ segments }: { segments: LifecycleSegment[] }) {
  return (
    <div className="bg-white rounded-xl border border-black/[0.08] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-black/[0.08]">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">Recommended Actions by Segment</h2>
        <p className="text-sm text-[#6B7280]">AI-generated campaign strategies for each customer lifecycle stage</p>
      </div>

      <div className="divide-y divide-black/[0.08]">
        {segments.map((seg) => {
          const config = LIFECYCLE_STAGE_CONFIG[seg.stage];
          return (
            <div key={seg.id} className="p-6 hover:bg-[#F4F6F8] transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="w-1 h-16 rounded-full flex-shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#1A1A1A]">{seg.name}</h3>
                      <div className="px-2 py-1 bg-[#F4F6F8] rounded text-xs font-medium text-[#6B7280]">
                        {config.impactBadge}
                      </div>
                    </div>
                    <p className="text-sm text-[#6B7280] mb-3">{config.insight}</p>
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all group-hover:shadow-md"
                      style={{ backgroundColor: `${config.color}15`, color: config.color }}
                    >
                      {config.actionLabel}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
                <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-[#6B7280] mb-1">Estimated Impact</p>
                  <p className="text-lg font-semibold" style={{ color: config.color }}>
                    +{config.estimatedImpact}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
