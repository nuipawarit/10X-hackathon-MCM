'use client';

import {
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const growthData = [
  { month: 'Sep', new: 620, active: 1800, vip: 240, atRisk: 340 },
  { month: 'Oct', new: 700, active: 1900, vip: 260, atRisk: 380 },
  { month: 'Nov', new: 750, active: 1950, vip: 280, atRisk: 420 },
  { month: 'Dec', new: 800, active: 2000, vip: 300, atRisk: 450 },
  { month: 'Jan', new: 830, active: 2050, vip: 310, atRisk: 470 },
  { month: 'Feb', new: 850, active: 2100, vip: 320, atRisk: 480 },
];

const radarData = [
  { metric: 'Precision', ai: 92, manual: 65 },
  { metric: 'Reach', ai: 85, manual: 78 },
  { metric: 'Cost Efficiency', ai: 88, manual: 55 },
  { metric: 'Speed', ai: 95, manual: 40 },
  { metric: 'Scalability', ai: 90, manual: 50 },
  { metric: 'Relevance', ai: 87, manual: 72 },
];

export function SegmentGrowthChart() {
  return (
    <div className="bg-white rounded-xl p-6 border border-black/[0.08]">
      <h4 className="font-medium text-[#1A1A1A] mb-4">Segment Growth Trend</h4>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={growthData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
          <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="new" stackId="1" stroke="#00C853" fill="#00C853" fillOpacity={0.6} name="New" />
          <Area type="monotone" dataKey="active" stackId="1" stroke="#0052CC" fill="#0052CC" fillOpacity={0.6} name="Active" />
          <Area type="monotone" dataKey="vip" stackId="1" stroke="#9C27B0" fill="#9C27B0" fillOpacity={0.6} name="VIP" />
          <Area type="monotone" dataKey="atRisk" stackId="1" stroke="#FF9800" fill="#FF9800" fillOpacity={0.6} name="At-Risk" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RadarComparison() {
  return (
    <div className="bg-white rounded-xl p-6 border border-black/[0.08]">
      <h4 className="font-medium text-[#1A1A1A] mb-4">AI Discovery vs Manual Targeting</h4>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6B7280' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} />
          <Radar name="AI Discovery" dataKey="ai" stroke="#0052CC" fill="#0052CC" fillOpacity={0.3} />
          <Radar name="Manual" dataKey="manual" stroke="#6B7280" fill="#6B7280" fillOpacity={0.15} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
