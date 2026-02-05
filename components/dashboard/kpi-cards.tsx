import { DollarSign, TrendingUp, Target, Users } from 'lucide-react';

interface KPICardsProps {
  totalSpend: number;
  totalRevenue: number;
  overallRoas: number;
  totalConversions: number;
}

const kpiConfig = [
  { key: 'totalSpend', label: 'Total Spend', icon: DollarSign, format: (v: number) => `฿${Math.round(v).toLocaleString()}`, color: '#0052CC' },
  { key: 'totalRevenue', label: 'Revenue', icon: TrendingUp, format: (v: number) => `฿${Math.round(v).toLocaleString()}`, color: '#00C853' },
  { key: 'overallRoas', label: 'Overall ROAS', icon: Target, format: (v: number) => `${v}x`, color: '#FF9800' },
  { key: 'totalConversions', label: 'Conversions', icon: Users, format: (v: number) => v.toLocaleString(), color: '#9C27B0' },
] as const;

export function KPICards({ totalSpend, totalRevenue, overallRoas, totalConversions }: KPICardsProps) {
  const values: Record<string, number> = { totalSpend, totalRevenue, overallRoas, totalConversions };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiConfig.map((kpi) => {
        const Icon = kpi.icon;
        const value = values[kpi.key];
        return (
          <div key={kpi.key} className="bg-white rounded-xl p-5 border border-black/[0.08] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#6B7280]">{kpi.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}15` }}>
                <Icon size={16} style={{ color: kpi.color }} />
              </div>
            </div>
            <div className="text-2xl font-medium text-[#1A1A1A]">{kpi.format(value)}</div>
          </div>
        );
      })}
    </div>
  );
}
