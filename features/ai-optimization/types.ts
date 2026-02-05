export interface PlatformMetrics {
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  cpa: number;
  ctr: number;
  roas: number;
}

export interface OptimizationRecommendation {
  id: string;
  action: 'increase' | 'decrease' | 'pause' | 'reallocate';
  platform: string;
  previousBudget: number;
  newBudget: number;
  reasoning: string;
  expectedImpact: string;
}

export interface OptimizationResult {
  recommendations: OptimizationRecommendation[];
  projectedMetrics: {
    roas: number;
    cpa: number;
    totalBudget: number;
  };
}

export interface OptimizeBudgetRequest {
  campaignId: string;
}

export interface ApplyOptimizationRequest {
  campaignId: string;
  recommendationId: string;
}
