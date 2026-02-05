export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { CheckCircle2, ArrowDown, ArrowUp, Sparkles } from 'lucide-react';
import { ResultsRoasChart } from '@/components/results/results-roas-chart';
import { OptimizeButton } from '@/components/results/optimize-button';
import { getActiveCampaign, getCampaignResults } from '@/lib/db/queries';

export default async function ResultsPage() {
  const campaign = await getActiveCampaign();

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16 text-[#6B7280]">
        <p className="text-lg font-medium">No data available</p>
        <p className="text-sm mt-1">Create a campaign to get started</p>
      </div>
    );
  }

  const results = await getCampaignResults(campaign.id);
  const { chartData, metrics, insights, roasChange, campaignInfo } = results;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-[#E8F5E9] to-[#E8F1FF] border border-[#00C853] rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#00C853] rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Campaign Optimization Complete!</h2>
            <p className="text-[#6B7280] mb-3">
              Budget successfully reallocated to high-performing segments. Your campaigns are now generating significantly better results.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00C853] rounded-full"></div>
                <span className="text-[#1A1A1A]">{campaignInfo.period}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0052CC] rounded-full"></div>
                <span className="text-[#1A1A1A]">{campaignInfo.platforms} platforms active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF9800] rounded-full"></div>
                <span className="text-[#1A1A1A]">{insights.length} audience segments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {metrics.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.direction === 'up' ? ArrowUp : ArrowDown;
            return (
              <div key={metric.id} className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm text-[#6B7280]">{metric.label}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: metric.bgColor }}>
                    <Icon className="w-4 h-4" style={{ color: metric.color }} />
                  </div>
                </div>
                <p className="text-3xl font-semibold mb-2" style={{ color: metric.color }}>{metric.value}</p>
                <p className="text-xs text-[#6B7280]">{metric.description}</p>
              </div>
            );
          })}
        </div>
      )}

      {chartData.length > 0 && (
        <ResultsRoasChart data={chartData} changePercent={roasChange} />
      )}

      {insights.length > 0 && (
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[rgba(0,0,0,0.08)] bg-gradient-to-r from-[#F4F6F8] to-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0052CC]" />
              <h2 className="text-xl font-semibold text-[#1A1A1A]">Key Insights</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="flex items-start gap-4 p-4 bg-[#F4F6F8] rounded-lg hover:bg-[#E8F1FF] transition-colors">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="font-semibold text-[#1A1A1A] flex-1">{insight.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${insight.impact === 'High' ? 'bg-[#E8F5E9] text-[#00C853]' : 'bg-[#FFF3E0] text-[#FF9800]'}`}>
                      {insight.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280]">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 pt-4">
        <OptimizeButton campaignId={campaign.id} />
        <Link
          href="/"
          className="px-8 py-3 bg-white text-[#0052CC] rounded-lg font-medium hover:bg-[#F4F6F8] transition-all border-2 border-[#0052CC] inline-block"
        >
          View Full Report
        </Link>
        <Link
          href="/creative"
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md inline-block"
        >
          Create New Campaign
        </Link>
      </div>
    </div>
  );
}
