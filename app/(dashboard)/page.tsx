'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
    ctr: number;
    cpa: number;
    roas: number;
  };
}

interface CampaignDetail {
  trend: { date: string; roas: number; spend: number; conversions: number }[];
}

const fallbackChartData = [
  { day: 'Jan 28', roas: 4.2 },
  { day: 'Jan 29', roas: 4.0 },
  { day: 'Jan 30', roas: 3.8 },
  { day: 'Jan 31', roas: 3.5 },
  { day: 'Feb 1', roas: 3.2 },
  { day: 'Feb 2', roas: 2.8 },
  { day: 'Feb 3', roas: 2.5 },
  { day: 'Feb 4', roas: 2.2 },
];

const fallbackPerformanceData = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1572534244649-8882340e53b5?w=200&h=200&fit=crop',
    name: 'Lifestyle Video',
    platform: 'Facebook',
    platformColor: '#1877F2',
    status: 'Low Performance',
    statusColor: '#FF5252',
    cpa: '$15.00',
    ctr: '0.8%',
    conversions: 24,
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop',
    name: 'Texture Zoom Image',
    platform: 'TikTok',
    platformColor: '#000000',
    status: 'High Performance',
    statusColor: '#00C853',
    cpa: '$4.50',
    ctr: '3.2%',
    conversions: 156,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [chartData, setChartData] = useState(fallbackChartData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/campaigns');
        if (!response.ok) throw new Error('Failed to fetch campaigns');
        const data = await response.json();
        setCampaigns(data.data || []);

        if (data.data?.[0]?.id) {
          const detailResponse = await fetch(`/api/campaigns/${data.data[0].id}`);
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            if (detailData.data?.trend?.length > 0) {
              setChartData(
                detailData.data.trend.map((t: { date: string; roas: number }) => ({
                  day: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  roas: Number(t.roas.toFixed(2)),
                }))
              );
            }
          }
        }
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Unable to load campaign data. Using demo data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalRoas = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + (c.metrics?.roas || 0), 0) / campaigns.length
    : 2.2;

  const roasChange = chartData.length >= 2
    ? ((chartData[chartData.length - 1].roas - chartData[0].roas) / chartData[0].roas) * 100
    : -47;

  const isRoasDecline = roasChange < 0;

  const performanceData = campaigns.length > 0
    ? campaigns.slice(0, 3).map((c, i) => ({
        id: c.id,
        thumbnail: `https://images.unsplash.com/photo-${1572534244649 + i}?w=200&h=200&fit=crop`,
        name: c.name,
        platform: i % 2 === 0 ? 'Facebook' : 'TikTok',
        platformColor: i % 2 === 0 ? '#1877F2' : '#000000',
        status: (c.metrics?.roas || 0) > 3 ? 'High Performance' : 'Low Performance',
        statusColor: (c.metrics?.roas || 0) > 3 ? '#00C853' : '#FF5252',
        cpa: `$${(c.metrics?.cpa || 0).toFixed(2)}`,
        ctr: `${((c.metrics?.ctr || 0) * 100).toFixed(1)}%`,
        conversions: c.metrics?.conversions || 0,
      }))
    : fallbackPerformanceData;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
          <p className="text-[#6B7280]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          {error}
        </div>
      )}

      {isRoasDecline && (
        <div className="bg-[#FFF3E0] border border-[#FF9800] rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FF9800] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-[#1A1A1A] mb-1">
              Alert: Creative Fatigue Detected on Facebook Campaign
            </h3>
            <p className="text-sm text-[#6B7280]">
              Your audience may be experiencing ad fatigue. ROAS has declined {Math.abs(roasChange).toFixed(0)}%
              over the past 7 days.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">
              Total ROAS
            </h2>
            <p className="text-sm text-[#6B7280]">
              Return on Ad Spend - Last 7 Days
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isRoasDecline ? 'bg-[#FFEBEE]' : 'bg-[#E8F5E9]'
          }`}>
            {isRoasDecline ? (
              <TrendingDown className="w-4 h-4 text-[#FF5252]" />
            ) : (
              <TrendingUp className="w-4 h-4 text-[#00C853]" />
            )}
            <span className={`text-sm font-semibold ${
              isRoasDecline ? 'text-[#FF5252]' : 'text-[#00C853]'
            }`}>
              {roasChange > 0 ? '+' : ''}{roasChange.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E4E8" />
              <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
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
                stroke={isRoasDecline ? '#FF5252' : '#00C853'}
                strokeWidth={3}
                dot={{ fill: isRoasDecline ? '#FF5252' : '#00C853', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">
            Cross-Platform Creative Performance
          </h2>
          <p className="text-sm text-[#6B7280]">
            Compare creative performance across platforms
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F4F6F8]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Creative
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  CPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Conversions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.08)]">
              {performanceData.map((item) => (
                <tr key={item.id} className="hover:bg-[#F4F6F8] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <span className="font-medium text-[#1A1A1A]">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.platformColor }}
                      />
                      <span className="text-sm text-[#1A1A1A]">{item.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${item.statusColor}15`,
                        color: item.statusColor,
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold" style={{ color: item.statusColor }}>
                      {item.cpa}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1A1A1A]">{item.ctr}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1A1A1A]">{item.conversions}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => router.push('/audience')}
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md"
        >
          Analyze Audience Insights
        </button>
      </div>
    </div>
  );
}
