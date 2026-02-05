'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  ArrowDown,
  ArrowUp,
  Sparkles,
  Loader2,
  Zap,
  Shield,
  ShieldAlert,
  History,
  ChevronRight,
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

interface Recommendation {
  action: string;
  platform: string;
  change: string;
  reasoning: string;
}

interface OptimizationLog {
  id: string;
  campaignId: string;
  actionType: string;
  previousState: Record<string, number>;
  newState: Record<string, number>;
  aiReasoning: string;
  appliedBy: string;
  appliedAt: string;
  campaignName?: string;
}

const fallbackChartData = [
  { day: 'Week 1', roas: 2.2 },
  { day: 'Week 2', roas: 2.8 },
  { day: 'Week 3', roas: 3.5 },
  { day: 'Week 4', roas: 4.8 },
  { day: 'Week 5', roas: 5.2 },
  { day: 'Week 6', roas: 5.8 },
];

const fallbackMetrics = [
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

const fallbackInsights = [
  {
    id: 1,
    title: 'TikTok Outperformance',
    description: 'Skincare Geeks ads on TikTok achieved 95% above expected CPA targets',
    impact: 'High',
  },
  {
    id: 2,
    title: 'Instagram Engagement',
    description: 'City Commuter creatives saw 3.2x higher engagement on Instagram Stories',
    impact: 'High',
  },
  {
    id: 3,
    title: 'Budget Optimization',
    description: 'AI reallocated 35% more budget to high-performing segments automatically',
    impact: 'Medium',
  },
];

export default function ResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [chartData, setChartData] = useState(fallbackChartData);
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const [insights, setInsights] = useState(fallbackInsights);
  const [error, setError] = useState<string | null>(null);
  const [safetyBrake, setSafetyBrake] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingRecommendations, setPendingRecommendations] = useState<Recommendation[]>([]);
  const [optimizationLogs, setOptimizationLogs] = useState<OptimizationLog[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const campaignsRes = await fetch('/api/campaigns');
        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json();
          if (campaignsData.data?.[0]) {
            const campaign = campaignsData.data[0];
            setCampaignId(campaign.id);

            if (campaign.metrics) {
              const m = campaign.metrics;
              setMetrics([
                {
                  id: 1,
                  label: 'CPA (Cost per Acquisition)',
                  value: `$${m.cpa?.toFixed(2) || '0.00'}`,
                  icon: m.cpa < 10 ? ArrowDown : ArrowUp,
                  color: m.cpa < 10 ? '#00C853' : '#FF5252',
                  bgColor: m.cpa < 10 ? '#E8F5E9' : '#FFEBEE',
                  description: 'Cost per conversion',
                },
                {
                  id: 2,
                  label: 'Conversions',
                  value: m.conversions?.toLocaleString() || '0',
                  icon: ArrowUp,
                  color: '#00C853',
                  bgColor: '#E8F5E9',
                  description: 'Total conversions',
                },
                {
                  id: 3,
                  label: 'ROAS',
                  value: `${m.roas?.toFixed(1) || '0.0'}x`,
                  icon: ArrowUp,
                  color: '#00C853',
                  bgColor: '#E8F5E9',
                  description: 'Return on ad spend',
                },
                {
                  id: 4,
                  label: 'CTR',
                  value: `${((m.ctr || 0) * 100).toFixed(2)}%`,
                  icon: ArrowUp,
                  color: '#00C853',
                  bgColor: '#E8F5E9',
                  description: 'Click-through rate',
                },
              ]);
            }

            const detailRes = await fetch(`/api/campaigns/${campaign.id}`);
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              if (detailData.data?.trend?.length > 0) {
                setChartData(
                  detailData.data.trend.map((t: { date: string; roas: number }, i: number) => ({
                    day: `Day ${i + 1}`,
                    roas: Number(t.roas.toFixed(2)),
                  }))
                );
              }
            }

            const logsRes = await fetch(`/api/optimization-logs?campaignId=${campaign.id}`);
            if (logsRes.ok) {
              const logsData = await logsRes.json();
              setOptimizationLogs(logsData.data || []);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load campaign data. Using demo results.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleOptimize() {
    if (!campaignId) return;
    setOptimizing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/budget/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });

      if (!response.ok) throw new Error('Failed to optimize budget');

      const data = await response.json();
      if (data.data?.recommendations) {
        const newRecommendations = data.data.recommendations;

        if (safetyBrake) {
          setPendingRecommendations(newRecommendations);
          setShowConfirmDialog(true);
        } else {
          await applyRecommendations(newRecommendations, data.data.expectedImpact);
        }

        setRecommendations(newRecommendations);
        setInsights([
          {
            id: 1,
            title: 'AI Budget Optimization',
            description: `Expected ROAS change: ${data.data.expectedImpact?.roasChange || '+10%'}`,
            impact: 'High',
          },
          ...newRecommendations.slice(0, 2).map((r: Recommendation, i: number) => ({
            id: i + 2,
            title: `${r.platform} ${r.action === 'increase_budget' ? 'Increase' : 'Decrease'}`,
            description: r.reasoning,
            impact: r.action === 'increase_budget' ? 'High' : 'Medium',
          })),
        ]);
      }
    } catch (err) {
      console.error('Error optimizing budget:', err);
      setError('Failed to get optimization recommendations. Please try again.');
    } finally {
      setOptimizing(false);
    }
  }

  async function applyRecommendations(recs: Recommendation[], expectedImpact?: { roasChange: string }) {
    try {
      const response = await fetch('/api/ai/budget/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, recommendations: recs }),
      });

      if (response.ok) {
        const logsRes = await fetch(`/api/optimization-logs?campaignId=${campaignId}`);
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setOptimizationLogs(logsData.data || []);
        }
      }
    } catch (err) {
      console.error('Error applying recommendations:', err);
    }
  }

  function handleConfirmApply() {
    applyRecommendations(pendingRecommendations);
    setShowConfirmDialog(false);
    setPendingRecommendations([]);
  }

  function handleCancelApply() {
    setShowConfirmDialog(false);
    setPendingRecommendations([]);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
          <p className="text-[#6B7280]">Loading results...</p>
        </div>
      </div>
    );
  }

  const roasImprovement = chartData.length >= 2
    ? Math.round(((chartData[chartData.length - 1].roas - chartData[0].roas) / chartData[0].roas) * 100)
    : 164;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#FFF3E0] rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6 text-[#FF9800]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Confirm AI Recommendations</h3>
                <p className="text-sm text-[#6B7280]">
                  Safety Brake is enabled. Please review before applying.
                </p>
              </div>
            </div>
            <div className="bg-[#F4F6F8] rounded-lg p-4 mb-4 space-y-2">
              {pendingRecommendations.map((rec, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#1A1A1A]">{rec.platform}</span>
                  <span className={rec.action === 'increase_budget' ? 'text-[#00C853]' : 'text-[#FF5252]'}>
                    {rec.change}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelApply}
                className="px-4 py-2 text-[#6B7280] hover:bg-[#F4F6F8] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApply}
                className="px-4 py-2 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Brake Toggle */}
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {safetyBrake ? (
              <Shield className="w-5 h-5 text-[#00C853]" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-[#FF9800]" />
            )}
            <div>
              <h3 className="font-semibold text-[#1A1A1A]">Safety Brake (Human Override)</h3>
              <p className="text-sm text-[#6B7280]">
                {safetyBrake
                  ? 'Review AI recommendations before applying'
                  : 'AI recommendations will be applied automatically'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSafetyBrake(!safetyBrake)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              safetyBrake ? 'bg-[#00C853]' : 'bg-[#E0E4E8]'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                safetyBrake ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

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
              Budget successfully reallocated to high-performing segments. Your campaigns are now
              generating significantly better results.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00C853] rounded-full"></div>
                <span className="text-[#1A1A1A]">Optimization period active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0052CC] rounded-full"></div>
                <span className="text-[#1A1A1A]">Multiple platforms active</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleOptimize}
            disabled={optimizing || !campaignId}
            className="px-4 py-2 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {optimizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run AI Optimization
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
              </div>
            </div>
            <p className="text-3xl font-semibold mb-2" style={{ color: metric.color }}>
              {metric.value}
            </p>
            <p className="text-xs text-[#6B7280]">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">Total ROAS Trend</h2>
            <p className="text-sm text-[#6B7280]">Return on Ad Spend - Performance Period</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#E8F5E9] rounded-lg">
            <TrendingUp className="w-4 h-4 text-[#00C853]" />
            <span className="text-sm font-semibold text-[#00C853]">
              {roasImprovement > 0 ? '+' : ''}{roasImprovement}%
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
                stroke="#00C853"
                strokeWidth={3}
                dot={{ fill: '#00C853', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[rgba(0,0,0,0.08)] bg-gradient-to-r from-[#F4F6F8] to-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0052CC]" />
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Key Insights</h2>
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
                  <h3 className="font-semibold text-[#1A1A1A] flex-1">{insight.title}</h3>
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

      {/* Optimization Audit Logs */}
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[rgba(0,0,0,0.08)] bg-gradient-to-r from-[#F4F6F8] to-white">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#0052CC]" />
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Optimization Audit Trail</h2>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">Transparent AI decision history with reasoning</p>
        </div>

        <div className="divide-y divide-[rgba(0,0,0,0.08)]">
          {optimizationLogs.length > 0 ? (
            optimizationLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-4 hover:bg-[#F4F6F8] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        log.appliedBy === 'ai'
                          ? 'bg-[#E8F1FF] text-[#0052CC]'
                          : 'bg-[#E8F5E9] text-[#00C853]'
                      }`}
                    >
                      {log.appliedBy === 'ai' ? 'AI Applied' : 'Human Applied'}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      {log.actionType?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>
                  <span className="text-xs text-[#6B7280]">
                    {log.appliedAt ? new Date(log.appliedAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-[#1A1A1A] mb-2">{log.aiReasoning}</p>
                {log.previousState && log.newState && (
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#6B7280]">Before:</span>
                      <span className="font-mono text-[#1A1A1A]">
                        {Object.entries(log.previousState)
                          .map(([k, v]) => `${k}: ฿${v.toLocaleString()}`)
                          .join(', ')}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                    <div className="flex items-center gap-2">
                      <span className="text-[#6B7280]">After:</span>
                      <span className="font-mono text-[#00C853]">
                        {Object.entries(log.newState)
                          .map(([k, v]) => `${k}: ฿${v.toLocaleString()}`)
                          .join(', ')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#6B7280]">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No optimization history yet</p>
              <p className="text-sm">Run AI Optimization to see the audit trail</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-white text-[#0052CC] rounded-lg font-medium hover:bg-[#F4F6F8] transition-all border-2 border-[#0052CC]"
        >
          View Full Report
        </button>
        <button
          onClick={() => router.push('/audience')}
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md"
        >
          Create New Campaign
        </button>
      </div>
    </div>
  );
}
