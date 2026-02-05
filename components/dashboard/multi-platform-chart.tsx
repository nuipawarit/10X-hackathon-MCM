'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PLATFORM_COLORS } from '@/lib/db/constants';

interface ChartDataPoint {
  day: string;
  meta: number;
  google: number;
  tiktok: number;
  line: number;
  lemon8: number;
  shopee: number;
  lazada: number;
  instagram: number;
  facebook: number;
  roas: number;
}

interface MultiPlatformChartProps {
  data: ChartDataPoint[];
  activePlatforms: string[];
}

const platformKeys = ['meta', 'google', 'tiktok', 'line', 'lemon8', 'shopee', 'lazada', 'instagram', 'facebook'] as const;

export function MultiPlatformChart({ data, activePlatforms }: MultiPlatformChartProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-black/[0.08]">
      <h3 className="font-medium text-[#1A1A1A] mb-4">Daily Spend by Platform</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6B7280' }} />
          <YAxis yAxisId="spend" tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}K`} />
          <YAxis yAxisId="roas" orientation="right" tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `${v}x`} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', fontSize: 12 }}
            formatter={(value: number, name: string) => {
              if (name === 'ROAS') return [`${value}x`, name];
              return [`฿${Math.round(value).toLocaleString()}`, PLATFORM_COLORS[name]?.displayName ?? name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {platformKeys.map((key) => {
            if (!activePlatforms.includes(key)) return null;
            const info = PLATFORM_COLORS[key];
            if (!info) return null;
            return (
              <Bar
                key={key}
                yAxisId="spend"
                dataKey={key}
                stackId="spend"
                fill={info.color}
                name={info.displayName}
                radius={key === platformKeys.filter(k => activePlatforms.includes(k)).pop() ? [2, 2, 0, 0] : undefined}
              />
            );
          })}
          <Line
            yAxisId="roas"
            type="monotone"
            dataKey="roas"
            stroke="#FF9800"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="ROAS"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
