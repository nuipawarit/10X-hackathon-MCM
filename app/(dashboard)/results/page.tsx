'use client';

import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  CheckCircle2,
  ArrowDown,
  ArrowUp,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { day: 'Week 1', roas: 2.2 },
  { day: 'Week 2', roas: 2.8 },
  { day: 'Week 3', roas: 3.5 },
  { day: 'Week 4', roas: 4.8 },
  { day: 'Week 5', roas: 5.2 },
  { day: 'Week 6', roas: 5.8 },
];

const metrics = [
  {
    id: 1,
    label: 'CPA (Cost per Acquisition)',
    value: '-40%',
    icon: ArrowDown,
    color: '#00C853',
    bgColor: '#E8F5E9',
    description: 'Reduced from $15.00 to $9.00',
  },
  {
    id: 2,
    label: 'Conversion Rate',
    value: '+2.5x',
    icon: ArrowUp,
    color: '#00C853',
    bgColor: '#E8F5E9',
    description: 'Improved from 1.2% to 3.0%',
  },
  {
    id: 3,
    label: 'ROAS',
    value: '+164%',
    icon: ArrowUp,
    color: '#00C853',
    bgColor: '#E8F5E9',
    description: 'Increased from 2.2x to 5.8x',
  },
  {
    id: 4,
    label: 'CTR (Click-through Rate)',
    value: '+180%',
    icon: ArrowUp,
    color: '#00C853',
    bgColor: '#E8F5E9',
    description: 'Improved from 0.8% to 2.24%',
  },
];

const insights = [
  {
    id: 1,
    title: 'TikTok Outperformance',
    description:
      'Skincare Geeks ads on TikTok achieved 95% above expected CPA targets',
    impact: 'High',
  },
  {
    id: 2,
    title: 'Instagram Engagement',
    description:
      'City Commuter creatives saw 3.2x higher engagement on Instagram Stories',
    impact: 'High',
  },
  {
    id: 3,
    title: 'Budget Optimization',
    description:
      'AI reallocated 35% more budget to high-performing segments automatically',
    impact: 'Medium',
  },
];

export default function ResultsPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-[#E8F5E9] to-[#E8F1FF] border border-[#00C853] rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#00C853] rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
              Campaign Optimization Complete!
            </h2>
            <p className="text-[#6B7280] mb-3">
              Budget successfully reallocated to high-performing segments. Your
              campaigns are now generating significantly better results.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00C853] rounded-full"></div>
                <span className="text-[#1A1A1A]">6-week optimization period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0052CC] rounded-full"></div>
                <span className="text-[#1A1A1A]">4 platforms active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF9800] rounded-full"></div>
                <span className="text-[#1A1A1A]">2 audience segments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-[#6B7280]">{metric.label}</p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: metric.bgColor }}
              >
                <metric.icon
                  className="w-4 h-4"
                  style={{ color: metric.color }}
                />
              </div>
            </div>
            <p
              className="text-3xl font-semibold mb-2"
              style={{ color: metric.color }}
            >
              {metric.value}
            </p>
            <p className="text-xs text-[#6B7280]">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">
              Total ROAS Trend
            </h2>
            <p className="text-sm text-[#6B7280]">
              Return on Ad Spend - 6 Week Period
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#E8F5E9] rounded-lg">
            <TrendingUp className="w-4 h-4 text-[#00C853]" />
            <span className="text-sm font-semibold text-[#00C853]">+164%</span>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E4E8" />
              <XAxis
                dataKey="day"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                label={{
                  value: 'ROAS',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#6B7280' },
                }}
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
                stroke="#00C853"
                strokeWidth={3}
                dot={{ fill: '#00C853', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[rgba(0,0,0,0.08)] bg-gradient-to-r from-[#F4F6F8] to-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0052CC]" />
            <h2 className="text-xl font-semibold text-[#1A1A1A]">
              Key Insights
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="flex items-start gap-4 p-4 bg-[#F4F6F8] rounded-lg hover:bg-[#E8F1FF] transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <h3 className="font-semibold text-[#1A1A1A] flex-1">
                    {insight.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      insight.impact === 'High'
                        ? 'bg-[#E8F5E9] text-[#00C853]'
                        : 'bg-[#FFF3E0] text-[#FF9800]'
                    }`}
                  >
                    {insight.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-[#6B7280]">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-white text-[#0052CC] rounded-lg font-medium hover:bg-[#F4F6F8] transition-all border-2 border-[#0052CC]"
        >
          View Full Report
        </button>
        <button
          onClick={() => router.push('/creative')}
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md"
        >
          Create New Campaign
        </button>
      </div>
    </div>
  );
}
