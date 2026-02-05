import { UserPlus, RefreshCw, Crown, AlertTriangle } from 'lucide-react';

interface LifecycleSegment {
  id: string;
  name: string;
  tagline: string;
  stage: 'new' | 'active' | 'vip' | 'at_risk';
  customerCount: number;
  avgOrderValue: number;
  purchaseFrequency: number;
}

const stageConfig = {
  new: { icon: UserPlus, color: '#00C853', bgColor: '#E8F5E9', label: 'Low CAC' },
  active: { icon: RefreshCw, color: '#0052CC', bgColor: '#E3F2FD', label: 'High Engagement' },
  vip: { icon: Crown, color: '#9C27B0', bgColor: '#F3E5F5', label: 'High LTV' },
  at_risk: { icon: AlertTriangle, color: '#FF9800', bgColor: '#FFF3E0', label: 'Needs Attention' },
};

export function LifecycleCards({ segments }: { segments: LifecycleSegment[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {segments.map((seg) => {
        const config = stageConfig[seg.stage];
        const Icon = config.icon;
        return (
          <div key={seg.id} className="bg-white rounded-xl p-5 border border-black/[0.08] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: config.bgColor }}>
                <Icon size={20} style={{ color: config.color }} />
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: config.bgColor, color: config.color }}>
                {config.label}
              </span>
            </div>
            <h4 className="font-medium text-[#1A1A1A] text-sm">{seg.name}</h4>
            <p className="text-xs text-[#6B7280] mt-1 mb-3">{seg.tagline}</p>
            <div className="space-y-1 text-xs">
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
          </div>
        );
      })}
    </div>
  );
}
