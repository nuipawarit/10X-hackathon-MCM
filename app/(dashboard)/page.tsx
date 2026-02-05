export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { AlertBanner } from '@/components/dashboard/alert-banner';
import { RoasChart } from '@/components/dashboard/roas-chart';
import { PerformanceTable } from '@/components/dashboard/performance-table';
import { getActiveCampaign, getCampaignTrend, getDeploymentPerformance, getAlertInfo } from '@/lib/db/queries';

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

  const [chartData, performanceData, alert] = await Promise.all([
    getCampaignTrend(campaign.id),
    getDeploymentPerformance(campaign.id),
    getAlertInfo(campaign.id),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {alert && (
        <AlertBanner title={alert.title} description={alert.description} />
      )}
      {chartData.length > 0 && (
        <RoasChart data={chartData} changePercent={alert?.changePercent ?? '+0%'} />
      )}
      {performanceData.length > 0 && (
        <PerformanceTable data={performanceData} />
      )}
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
