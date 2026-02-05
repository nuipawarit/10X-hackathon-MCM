import { Calendar, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { useNavigate } from "react-router";

// Platform data
const platforms = [
  { id: "meta", name: "Meta", shortName: "FB/IG", color: "#1877F2", active: true },
  { id: "google", name: "Google Ads", shortName: "Google", color: "#EA4335", active: true },
  { id: "tiktok", name: "TikTok Ads", shortName: "TikTok", color: "#000000", active: true },
  { id: "line", name: "LINE LAP", shortName: "LINE", color: "#00C300", active: true },
  { id: "lemon8", name: "Lemon8", shortName: "Lemon8", color: "#FFB800", active: true },
  { id: "shopee", name: "Shopee", shortName: "Shopee", color: "#EE4D2D", active: true },
  { id: "lazada", name: "Lazada", shortName: "Lazada", color: "#0F146D", active: true },
];

// Chart data - Daily spend breakdown
const chartData = [
  { day: "Day 1", meta: 45000, google: 32000, tiktok: 28000, line: 18000, lemon8: 12000, shopee: 25000, lazada: 22000, roas: 4.8 },
  { day: "Day 3", meta: 48000, google: 35000, tiktok: 30000, line: 19000, lemon8: 13000, shopee: 27000, lazada: 24000, roas: 4.9 },
  { day: "Day 5", meta: 52000, google: 38000, tiktok: 32000, line: 21000, lemon8: 14000, shopee: 29000, lazada: 26000, roas: 5.1 },
  { day: "Day 7", meta: 50000, google: 36000, tiktok: 31000, line: 20000, lemon8: 13500, shopee: 28000, lazada: 25000, roas: 5.0 },
  { day: "Day 9", meta: 53000, google: 39000, tiktok: 33000, line: 22000, lemon8: 15000, shopee: 30000, lazada: 27000, roas: 5.2 },
  { day: "Day 11", meta: 51000, google: 37000, tiktok: 32000, line: 21000, lemon8: 14000, shopee: 29000, lazada: 26000, roas: 5.0 },
  { day: "Day 13", meta: 54000, google: 40000, tiktok: 34000, line: 23000, lemon8: 16000, shopee: 31000, lazada: 28000, roas: 5.3 },
];

// Platform performance table data
const platformPerformance = [
  {
    platform: "Meta",
    icon: "FB/IG",
    color: "#1877F2",
    spend: "฿520,000",
    impressions: "8,500,000",
    clicks: "425,000",
    ctr: "5.0%",
    cpc: "฿1.22",
    conversions: "1,280",
    cpa: "฿406",
    roas: "5.8x",
  },
  {
    platform: "Google Ads",
    icon: "Google",
    color: "#EA4335",
    spend: "฿380,000",
    impressions: "6,200,000",
    clicks: "310,000",
    ctr: "5.0%",
    cpc: "฿1.23",
    conversions: "950",
    cpa: "฿400",
    roas: "5.5x",
  },
  {
    platform: "TikTok Ads",
    icon: "TikTok",
    color: "#000000",
    spend: "฿320,000",
    impressions: "12,800,000",
    clicks: "384,000",
    ctr: "3.0%",
    cpc: "฿0.83",
    conversions: "640",
    cpa: "฿500",
    roas: "4.4x",
  },
  {
    platform: "Shopee Ads",
    icon: "Shopee",
    color: "#EE4D2D",
    spend: "฿290,000",
    impressions: "5,800,000",
    clicks: "232,000",
    ctr: "4.0%",
    cpc: "฿1.25",
    conversions: "725",
    cpa: "฿400",
    roas: "5.2x",
  },
  {
    platform: "Lazada Ads",
    icon: "Lazada",
    color: "#0F146D",
    spend: "฿260,000",
    impressions: "5,200,000",
    clicks: "208,000",
    ctr: "4.0%",
    cpc: "฿1.25",
    conversions: "650",
    cpa: "฿400",
    roas: "5.0x",
  },
  {
    platform: "LINE LAP",
    icon: "LINE",
    color: "#00C300",
    spend: "฿210,000",
    impressions: "4,500,000",
    clicks: "180,000",
    ctr: "4.0%",
    cpc: "฿1.17",
    conversions: "252",
    cpa: "฿833",
    roas: "3.8x",
  },
  {
    platform: "Lemon8",
    icon: "Lemon8",
    color: "#FFB800",
    spend: "฿70,000",
    impressions: "2,100,000",
    clicks: "84,000",
    ctr: "4.0%",
    cpc: "฿0.83",
    conversions: "78",
    cpa: "฿897",
    roas: "3.5x",
  },
];

export function CrossPlatformDashboard() {
  const [activePlatforms, setActivePlatforms] = useState(
    platforms.map(p => p.id)
  );

  const togglePlatform = (platformId: string) => {
    if (activePlatforms.includes(platformId)) {
      setActivePlatforms(activePlatforms.filter(id => id !== platformId));
    } else {
      setActivePlatforms([...activePlatforms, platformId]);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Alert Banner */}
      <div className="bg-[#FFF3E0] border border-[#FF9800] rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#FF9800] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-[#1A1A1A] mb-1">
            Alert: Creative Fatigue Detected on Facebook Campaign
          </h3>
          <p className="text-sm text-[#6B7280]">
            Your audience may be experiencing ad fatigue. ROAS has declined 47% over the past 7 days.
          </p>
        </div>
      </div>

      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Cross-Platform Command Center</h1>
        
        {/* Filters Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Platform Toggles */}
          <div className="flex items-center gap-2">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  activePlatforms.includes(platform.id)
                    ? "bg-white text-[#1A1A1A] border-[rgba(0,0,0,0.2)] shadow-sm"
                    : "bg-[#F4F7F9] text-[#6B7280] border-transparent hover:bg-[#E0E4E8]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  {platform.name}
                </div>
              </button>
            ))}
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[rgba(0,0,0,0.08)] text-sm">
            <Calendar className="w-4 h-4 text-[#6B7280]" />
            <span className="text-[#1A1A1A] font-medium">Last 30 Days</span>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1: Total Ad Spend */}
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Ad Spend</p>
          <p className="text-3xl font-semibold text-[#1A1A1A] mb-2">฿1,500,000</p>
          <div className="flex items-center gap-1 text-xs">
            <TrendingUp className="w-3 h-3 text-[#00C853]" />
            <span className="text-[#00C853] font-medium">+5%</span>
            <span className="text-[#6B7280]">vs last period</span>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Revenue</p>
          <p className="text-3xl font-semibold text-[#1A1A1A] mb-2">฿7,500,000</p>
          <div className="flex items-center gap-1 text-xs">
            <TrendingUp className="w-3 h-3 text-[#00C853]" />
            <span className="text-[#00C853] font-medium">+12%</span>
            <span className="text-[#6B7280]">vs last period</span>
          </div>
        </div>

        {/* Card 3: Blended ROAS */}
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Blended ROAS</p>
          <p className="text-3xl font-semibold text-[#00C853] mb-2">5.0x</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-[#E8F5E9] rounded-full">
              <div className="w-2 h-2 bg-[#00C853] rounded-full"></div>
              <span className="text-xs font-medium text-[#00C853]">Healthy</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Conversions */}
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Conversions</p>
          <p className="text-3xl font-semibold text-[#1A1A1A] mb-2">3,200</p>
          <div className="flex items-center gap-1 text-xs">
            <TrendingUp className="w-3 h-3 text-[#00C853]" />
            <span className="text-[#00C853] font-medium">+8%</span>
            <span className="text-[#6B7280]">vs last period</span>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">
          Daily Spend & Performance Breakdown by Platform
        </h2>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E4E8" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6B7280' }}
                label={{ value: 'Ad Spend (฿)', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#0052CC"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#0052CC' }}
                label={{ value: 'ROAS (x)', angle: 90, position: 'insideRight', style: { fill: '#0052CC' } }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'roas') return [value + 'x', 'ROAS'];
                  return ['฿' + value.toLocaleString(), name];
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              
              {/* Stacked Bars */}
              <Bar yAxisId="left" dataKey="meta" stackId="a" fill="#1877F2" name="Meta" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="google" stackId="a" fill="#EA4335" name="Google Ads" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="tiktok" stackId="a" fill="#000000" name="TikTok" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="shopee" stackId="a" fill="#EE4D2D" name="Shopee" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="lazada" stackId="a" fill="#0F146D" name="Lazada" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="line" stackId="a" fill="#00C300" name="LINE" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="lemon8" stackId="a" fill="#FFB800" name="Lemon8" radius={[8, 8, 0, 0]} />
              
              {/* ROAS Line */}
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="roas" 
                stroke="#0052CC" 
                strokeWidth={3}
                dot={{ fill: '#0052CC', r: 4 }}
                name="Daily ROAS"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Performance Table */}
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">Platform Performance Details</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F4F7F9]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Spend
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  CTR (%)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  CPC
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  CPA
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  ROAS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
              {platformPerformance.map((row, index) => (
                <tr key={index} className="hover:bg-[#F4F7F9] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: row.color }}
                      >
                        {row.icon.substring(0, 2)}
                      </div>
                      <span className="font-medium text-[#1A1A1A]">{row.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-[#1A1A1A]">
                    {row.spend}
                  </td>
                  <td className="px-6 py-4 text-right text-[#1A1A1A]">
                    {row.impressions}
                  </td>
                  <td className="px-6 py-4 text-right text-[#1A1A1A]">
                    {row.clicks}
                  </td>
                  <td className="px-6 py-4 text-right text-[#1A1A1A]">
                    {row.ctr}
                  </td>
                  <td className="px-6 py-4 text-right text-[#1A1A1A]">
                    {row.cpc}
                  </td>
                  <td className="px-6 py-4 text-right text-[#1A1A1A]">
                    {row.conversions}
                  </td>
                  <td className="px-6 py-4 text-right text-[#1A1A1A]">
                    {row.cpa}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-[#00C853]">{row.roas}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            
            {/* Totals Row */}
            <tfoot className="bg-[#F4F7F9] border-t-2 border-[rgba(0,0,0,0.1)]">
              <tr>
                <td className="px-6 py-4 font-semibold text-[#1A1A1A]">
                  Total / Average
                </td>
                <td className="px-6 py-4 text-right font-semibold text-[#1A1A1A]">
                  ฿1,500,000
                </td>
                <td className="px-6 py-4 text-right font-semibold text-[#1A1A1A]">
                  34,100,000
                </td>
                <td className="px-6 py-4 text-right font-semibold text-[#1A1A1A]">
                  1,383,000
                </td>
                <td className="px-6 py-4 text-right font-semibold text-[#1A1A1A]">
                  4.1%
                </td>
                <td className="px-6 py-4 text-right font-semibold text-[#1A1A1A]">
                  ฿1.09
                </td>
                <td className="px-6 py-4 text-right font-semibold text-[#1A1A1A]">
                  3,200
                </td>
                <td className="px-6 py-4 text-right font-semibold text-[#1A1A1A]">
                  ฿469
                </td>
                <td className="px-6 py-4 text-right font-semibold text-[#00C853]">
                  5.0x
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => navigate("/audience")}
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md"
        >
          Analyze Audience Insights
        </button>
      </div>
    </div>
  );
}