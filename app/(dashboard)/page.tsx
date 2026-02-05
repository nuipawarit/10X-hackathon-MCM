export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { AlertBanner } from '@/components/dashboard/alert-banner';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { getActiveCampaign, getCrossPlatformKPIs, getDailyPlatformBreakdown, getDeploymentPerformanceV2, getAlertInfo } from '@/lib/db/queries';

export default async function DashboardPage() {
  const campaign = await getActiveCampaign();

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16 text-[#6B7280]">
        <p className="text-lg font-medium">No data available</p>
        <p className="text-sm mt-1">Create a campaign to get started</p>
      </div>
    );
  }

  const [kpis, chartData, performanceData, alert] = await Promise.all([
    getCrossPlatformKPIs(campaign.id),
    getDailyPlatformBreakdown(campaign.id),
    getDeploymentPerformanceV2(campaign.id),
    getAlertInfo(campaign.id),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {alert && (
        <AlertBanner title={alert.title} description={alert.description} />
      )}

      <div>
        <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Cross-Platform Command Center</h2>
        <p className="text-sm text-[#6B7280]">{campaign.name}</p>
      </div>

      <KPICards
        totalSpend={kpis.totalSpend}
        totalRevenue={kpis.totalRevenue}
        overallRoas={kpis.overallRoas}
        totalConversions={kpis.totalConversions}
      />

      <DashboardClient chartData={chartData} performanceData={performanceData} />

      <div className="flex justify-center pt-4">
        <Link
          href="/audience"
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md inline-block"
        >
          Analyze Audience Insights
        </Link>
      </div>
    </div>
  );
}
