import { TrendingUp, TrendingDown } from 'lucide-react';
import { LIFECYCLE_STAGE_CONFIG, type LifecycleSegment } from './lifecycle-config';

export function LifecycleCards({ segments }: { segments: LifecycleSegment[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {segments.map((seg) => {
        const config = LIFECYCLE_STAGE_CONFIG[seg.stage];
        const Icon = config.icon;
        return (
          <div key={seg.id} className="bg-white rounded-xl p-5 border border-black/[0.08] hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: config.bgColor }}>
                <Icon size={20} style={{ color: config.color }} />
              </div>
              {config.trend === 'up' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-[#E8F5E9] rounded-full">
                  <TrendingUp className="w-3 h-3 text-[#00C853]" />
                  <span className="text-xs font-medium text-[#00C853]">{config.trendLabel}</span>
                </div>
              )}
              {config.trend === 'down' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-[#FFEBEE] rounded-full">
                  <TrendingDown className="w-3 h-3 text-[#FF5252]" />
                  <span className="text-xs font-medium text-[#FF5252]">{config.trendLabel}</span>
                </div>
              )}
              {config.trend === 'neutral' && (
                <div className="px-2 py-1 bg-[#F4F6F8] rounded-full">
                  <span className="text-xs font-medium text-[#6B7280]">{config.trendLabel}</span>
                </div>
              )}
            </div>
            <h4 className="font-medium text-[#1A1A1A] text-sm">{seg.name}</h4>
            <p className="text-xs text-[#6B7280] mt-1 mb-3">{seg.tagline}</p>
            <div className="space-y-1 text-xs mb-3">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Customers</span>
                <span className="font-medium text-[#1A1A1A]">{seg.customerCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Avg. Order</span>
                <span className="font-medium text-[#1A1A1A]">฿{seg.avgOrderValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Frequency</span>
                <span className="font-medium text-[#1A1A1A]">{seg.purchaseFrequency}x/mo</span>
              </div>
            </div>
            <div
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${config.color}15`, color: config.color }}
            >
              {config.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
