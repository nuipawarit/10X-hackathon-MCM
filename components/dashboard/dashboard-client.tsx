'use client';

import { useState } from 'react';
import { MultiPlatformChart } from './multi-platform-chart';
import { PlatformToggle } from './platform-toggle';

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

interface PerformanceRow {
  platform: string;
  platformKey: string;
  color: string;
  logo: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  conversions: string;
  cpa: string;
  roas: string;
}

interface DashboardClientProps {
  chartData: ChartDataPoint[];
  performanceData: PerformanceRow[];
}

export function DashboardClient({ chartData, performanceData }: DashboardClientProps) {
  const allPlatforms = [...new Set(performanceData.map(p => p.platformKey))];
  const [activePlatforms, setActivePlatforms] = useState<string[]>(allPlatforms);

  const togglePlatform = (platform: string) => {
    setActivePlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const filteredPerformance = performanceData.filter(p => activePlatforms.includes(p.platformKey));

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[#1A1A1A]">Platform Performance</h3>
        <PlatformToggle activePlatforms={activePlatforms} onToggle={togglePlatform} />
      </div>

      {chartData.length > 0 && (
        <MultiPlatformChart data={chartData} activePlatforms={activePlatforms} />
      )}

      {filteredPerformance.length > 0 && (
        <div className="bg-white rounded-xl border border-black/[0.08] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/[0.08]">
                  <th className="text-left p-4 text-[#6B7280] font-medium">Platform</th>
                  <th className="text-right p-4 text-[#6B7280] font-medium">Spend</th>
                  <th className="text-right p-4 text-[#6B7280] font-medium">Impressions</th>
                  <th className="text-right p-4 text-[#6B7280] font-medium">Clicks</th>
                  <th className="text-right p-4 text-[#6B7280] font-medium">CTR</th>
                  <th className="text-right p-4 text-[#6B7280] font-medium">CPC</th>
                  <th className="text-right p-4 text-[#6B7280] font-medium">Conversions</th>
                  <th className="text-right p-4 text-[#6B7280] font-medium">CPA</th>
                  <th className="text-right p-4 text-[#6B7280] font-medium">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerformance.map((row) => (
                  <tr key={row.platformKey} className="border-b border-black/[0.04] hover:bg-[#F4F6F8] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium" style={{ backgroundColor: row.color }}>
                          {row.logo}
                        </div>
                        <span className="font-medium text-[#1A1A1A]">{row.platform}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-[#1A1A1A]">{row.spend}</td>
                    <td className="p-4 text-right text-[#6B7280]">{row.impressions}</td>
                    <td className="p-4 text-right text-[#6B7280]">{row.clicks}</td>
                    <td className="p-4 text-right text-[#6B7280]">{row.ctr}</td>
                    <td className="p-4 text-right text-[#6B7280]">{row.cpc}</td>
                    <td className="p-4 text-right text-[#1A1A1A] font-medium">{row.conversions}</td>
                    <td className="p-4 text-right text-[#1A1A1A]">{row.cpa}</td>
                    <td className="p-4 text-right font-medium" style={{ color: parseFloat(row.roas) >= 3 ? '#00C853' : parseFloat(row.roas) >= 1.5 ? '#FF9800' : '#FF5252' }}>
                      {row.roas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
