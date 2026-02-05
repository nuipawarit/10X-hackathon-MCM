'use client';

import { TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RoasChartProps {
  data: { day: string; roas: number }[];
  changePercent?: string;
}

export function RoasChart({ data, changePercent = '-47%' }: RoasChartProps) {
  return (
    <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">Total ROAS</h2>
          <p className="text-sm text-[#6B7280]">Return on Ad Spend - Last 7 Days</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#FFEBEE] rounded-lg">
          <TrendingDown className="w-4 h-4 text-[#FF5252]" />
          <span className="text-sm font-semibold text-[#FF5252]">{changePercent}</span>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E4E8" />
            <XAxis
              dataKey="day"
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'ROAS', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="roas"
              stroke="#FF5252"
              strokeWidth={3}
              dot={{ fill: '#FF5252', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
