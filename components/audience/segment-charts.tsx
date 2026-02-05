'use client';

import {
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { BarChart3, Radar as RadarIcon } from 'lucide-react';

interface GrowthDataPoint {
  month: string;
  new: number;
  active: number;
  vip: number;
  atRisk: number;
}

interface RadarDataPoint {
  metric: string;
  ai: number;
  manual: number;
}

export function SegmentGrowthChart({ data }: { data?: GrowthDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-black/[0.08]">
        <h4 className="font-medium text-[#1A1A1A] mb-4">Segment Growth Trend</h4>
        <div className="flex flex-col items-center justify-center h-[280px] text-[#6B7280]">
          <BarChart3 size={32} className="mb-2 text-[#6B7280]/30" />
          <p className="text-sm">No segment data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-black/[0.08]">
      <h4 className="font-medium text-[#1A1A1A] mb-4">Segment Growth Trend</h4>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
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

export function RadarComparison({ data }: { data?: RadarDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-black/[0.08]">
        <h4 className="font-medium text-[#1A1A1A] mb-4">AI Discovery vs Manual Targeting</h4>
        <div className="flex flex-col items-center justify-center h-[280px] text-[#6B7280]">
          <RadarIcon size={32} className="mb-2 text-[#6B7280]/30" />
          <p className="text-sm">No comparison data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-black/[0.08]">
      <h4 className="font-medium text-[#1A1A1A] mb-4">AI Discovery vs Manual Targeting</h4>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
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
