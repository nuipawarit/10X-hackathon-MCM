import { UserPlus, RefreshCw, Crown, AlertTriangle, type LucideIcon } from 'lucide-react';

export interface LifecycleSegment {
  id: string;
  name: string;
  tagline: string;
  stage: 'new' | 'active' | 'vip' | 'at_risk';
  customerCount: number;
  avgOrderValue: number;
  purchaseFrequency: number;
  intentScore: number;
  recommendedMessaging: string;
}

export interface LifecycleStageConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  label: string;
  trend: 'up' | 'down' | 'neutral';
  trendLabel: string;
  impactBadge: string;
  insight: string;
  actionLabel: string;
  estimatedImpact: number;
}

export const LIFECYCLE_STAGE_CONFIG: Record<LifecycleSegment['stage'], LifecycleStageConfig> = {
  new: {
    icon: UserPlus,
    color: '#00C853',
    bgColor: '#E8F5E9',
    label: 'Low CAC',
    trend: 'up',
    trendLabel: '+15%',
    impactBadge: 'Cost Efficiency',
    insight: 'Low CAC from TikTok & Lemon8',
    actionLabel: 'Scale Acquisition on Best Channels',
    estimatedImpact: 18,
  },
  active: {
    icon: RefreshCw,
    color: '#0052CC',
    bgColor: '#E3F2FD',
    label: 'High Engagement',
    trend: 'neutral',
    trendLabel: 'Steady',
    impactBadge: 'Increase LTV',
    insight: 'High Engagement, Moderate Spending',
    actionLabel: 'Introduce Loyalty Rewards',
    estimatedImpact: 15,
  },
  vip: {
    icon: Crown,
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    label: 'High LTV',
    trend: 'up',
    trendLabel: '+5%',
    impactBadge: 'High Revenue Impact',
    insight: 'Prefer Premium Bundles & Early Access',
    actionLabel: 'Launch Upsell Campaign',
    estimatedImpact: 25,
  },
  at_risk: {
    icon: AlertTriangle,
    color: '#FF9800',
    bgColor: '#FFF3E0',
    label: 'Needs Attention',
    trend: 'down',
    trendLabel: '-10%',
    impactBadge: 'Prevent Churn',
    insight: 'Cart Abandonment High (68% rate)',
    actionLabel: 'Trigger Cross-Channel Retargeting',
    estimatedImpact: 22,
  },
};
