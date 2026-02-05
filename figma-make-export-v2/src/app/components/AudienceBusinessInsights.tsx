import { UserPlus, RefreshCw, Star, AlertTriangle, TrendingUp, TrendingDown, Sparkles, ArrowRight } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Lifecycle overview data
const lifecycleCards = [
  {
    id: 1,
    title: "New Customers",
    metric: "1,200",
    change: "+15%",
    trend: "up",
    icon: UserPlus,
    color: "#0052CC",
    bgColor: "#E8F1FF",
    label: "Low CAC",
    labelColor: "#00C853",
  },
  {
    id: 2,
    title: "Active/Returning",
    metric: "850",
    change: "Steady",
    trend: "neutral",
    icon: RefreshCw,
    color: "#00C853",
    bgColor: "#E8F5E9",
    label: "High Engagement",
    labelColor: "#00C853",
  },
  {
    id: 3,
    title: "Top Spenders (VIP)",
    metric: "120",
    change: "+5%",
    trend: "up",
    icon: Star,
    color: "#9C27B0",
    bgColor: "#F3E5F5",
    label: "High LTV",
    labelColor: "#9C27B0",
  },
  {
    id: 4,
    title: "At-Risk / Drop-off",
    metric: "45",
    change: "-10%",
    trend: "down",
    icon: AlertTriangle,
    color: "#FF9800",
    bgColor: "#FFF3E0",
    label: "Needs Attention",
    labelColor: "#FF5722",
  },
];

// Growth chart data (stacked area - last 6 months)
const growthData = [
  { month: "Sep", new: 980, active: 720, vip: 95, atrisk: 62 },
  { month: "Oct", new: 1050, active: 760, vip: 102, atrisk: 58 },
  { month: "Nov", new: 1100, active: 800, vip: 108, atrisk: 55 },
  { month: "Dec", new: 1150, active: 820, vip: 112, atrisk: 51 },
  { month: "Jan", new: 1180, active: 840, vip: 115, atrisk: 48 },
  { month: "Feb", new: 1200, active: 850, vip: 120, atrisk: 45 },
];

// Radar chart data (AI Discovery vs Manual Targeting)
const radarData = [
  { category: "Tech Enthusiasts", manual: 65, ai: 92 },
  { category: "Budget Shoppers", manual: 78, ai: 85 },
  { category: "Premium Buyers", manual: 45, ai: 88 },
  { category: "Impulse Buyers", manual: 52, ai: 82 },
  { category: "Loyal Repeaters", manual: 70, ai: 95 },
  { category: "Gift Purchasers", manual: 38, ai: 75 },
];

// Actionable segments
const segments = [
  {
    id: 1,
    name: "Top Spenders (VIP)",
    insight: "Prefer Premium Bundles & Early Access",
    color: "#9C27B0",
    action: "Launch Upsell Campaign",
    impact: "High Revenue Impact",
  },
  {
    id: 2,
    name: "At-Risk / Drop-off",
    insight: "Cart Abandonment High (68% rate)",
    color: "#FF9800",
    action: "Trigger Cross-Channel Retargeting",
    impact: "Prevent Churn",
  },
  {
    id: 3,
    name: "Active/Returning",
    insight: "High Engagement, Moderate Spending",
    color: "#00C853",
    action: "Introduce Loyalty Rewards",
    impact: "Increase LTV",
  },
  {
    id: 4,
    name: "New Customers",
    insight: "Low CAC from TikTok & Lemon8",
    color: "#0052CC",
    action: "Scale Acquisition on Best Channels",
    impact: "Cost Efficiency",
  },
];

export function AudienceBusinessInsights() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F1FF] rounded-full mb-2">
          <Sparkles className="w-4 h-4 text-[#0052CC]" />
          <span className="text-sm font-medium text-[#0052CC]">AI-Powered Insights</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Customer Lifecycle Intelligence</h1>
        <p className="text-[#6B7280]">
          AI-driven segmentation based on purchase behavior and intent
        </p>
      </div>

      {/* Lifecycle Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        {lifecycleCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.bgColor }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              {card.trend === "up" && (
                <div className="flex items-center gap-1 px-2 py-1 bg-[#E8F5E9] rounded-full">
                  <TrendingUp className="w-3 h-3 text-[#00C853]" />
                  <span className="text-xs font-medium text-[#00C853]">{card.change}</span>
                </div>
              )}
              {card.trend === "down" && (
                <div className="flex items-center gap-1 px-2 py-1 bg-[#FFEBEE] rounded-full">
                  <TrendingDown className="w-3 h-3 text-[#FF5252]" />
                  <span className="text-xs font-medium text-[#FF5252]">{card.change}</span>
                </div>
              )}
              {card.trend === "neutral" && (
                <div className="px-2 py-1 bg-[#F4F6F8] rounded-full">
                  <span className="text-xs font-medium text-[#6B7280]">{card.change}</span>
                </div>
              )}
            </div>
            <h3 className="text-sm text-[#6B7280] mb-1">{card.title}</h3>
            <p className="text-3xl font-semibold text-[#1A1A1A] mb-3">{card.metric}</p>
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${card.labelColor}15`, color: card.labelColor }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Visualization - Split View */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Growth Chart */}
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Segment Growth Over Time</h2>
          <p className="text-sm text-[#6B7280] mb-6">Customer segment evolution - Last 6 months</p>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E4E8" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Customers', angle: -90, position: 'insideLeft', style: { fill: '#6B7280' } }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area 
                  type="monotone" 
                  dataKey="new" 
                  stackId="1" 
                  stroke="#0052CC" 
                  fill="#0052CC" 
                  fillOpacity={0.8}
                  name="New Customers"
                />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stackId="1" 
                  stroke="#00C853" 
                  fill="#00C853" 
                  fillOpacity={0.8}
                  name="Active/Returning"
                />
                <Area 
                  type="monotone" 
                  dataKey="vip" 
                  stackId="1" 
                  stroke="#9C27B0" 
                  fill="#9C27B0" 
                  fillOpacity={0.8}
                  name="VIP"
                />
                <Area 
                  type="monotone" 
                  dataKey="atrisk" 
                  stackId="1" 
                  stroke="#FF9800" 
                  fill="#FF9800" 
                  fillOpacity={0.8}
                  name="At-Risk"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: AI Discovery Radar */}
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">AI Discovery Performance</h2>
          <p className="text-sm text-[#6B7280] mb-6">Hidden audience segments found by AI vs manual targeting</p>
          
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E0E4E8" />
                <PolarAngleAxis 
                  dataKey="category" 
                  style={{ fontSize: '11px', fill: '#6B7280' }}
                  tick={{ fill: '#6B7280' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  style={{ fontSize: '10px' }}
                />
                <Radar 
                  name="Manual Targeting" 
                  dataKey="manual" 
                  stroke="#6B7280" 
                  fill="#6B7280" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar 
                  name="AI Discovery" 
                  dataKey="ai" 
                  stroke="#0052CC" 
                  fill="#0052CC" 
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="circle"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-3 bg-[#E8F5E9] rounded-lg border border-[#00C853]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00C853]" />
              <span className="text-sm font-medium text-[#00C853]">
                AI discovered 23% more high-value segments
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Segment List */}
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">Recommended Actions by Segment</h2>
          <p className="text-sm text-[#6B7280]">AI-generated campaign strategies for each customer lifecycle stage</p>
        </div>

        <div className="divide-y divide-[rgba(0,0,0,0.08)]">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="p-6 hover:bg-[#F4F6F8] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Color Indicator */}
                  <div
                    className="w-1 h-16 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  
                  {/* Segment Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#1A1A1A]">{segment.name}</h3>
                      <div className="px-2 py-1 bg-[#F4F6F8] rounded text-xs font-medium text-[#6B7280]">
                        {segment.impact}
                      </div>
                    </div>
                    <p className="text-sm text-[#6B7280] mb-3">{segment.insight}</p>
                    
                    {/* Action Button */}
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all group-hover:shadow-md"
                      style={{ 
                        backgroundColor: `${segment.color}15`, 
                        color: segment.color,
                      }}
                    >
                      {segment.action}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-[#6B7280] mb-1">Estimated Impact</p>
                  <p className="text-lg font-semibold" style={{ color: segment.color }}>
                    +{Math.floor(Math.random() * 20 + 10)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-[#E8F1FF] to-[#F3E5F5] rounded-lg border border-[rgba(0,82,204,0.2)] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#0052CC]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A1A1A] mb-1">
                Want deeper AI-powered audience insights?
              </h3>
              <p className="text-sm text-[#6B7280]">
                Unlock predictive analytics, churn forecasting, and real-time segment updates
              </p>
            </div>
          </div>
          <button className="px-6 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md whitespace-nowrap">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}
