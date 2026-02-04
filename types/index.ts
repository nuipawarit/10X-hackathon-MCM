// ============================================
// Campaign Types
// ============================================

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type CampaignObjective = 'awareness' | 'consideration' | 'conversion';

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  budget: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Platform Types
// ============================================

export type Platform = 'meta' | 'google' | 'tiktok' | 'line' | 'lemon8';
export type ConnectionStatus = 'active' | 'inactive' | 'error';

export interface PlatformConnection {
  id: string;
  userId: string;
  platform: Platform;
  accountId: string;
  status: ConnectionStatus;
  lastSyncAt: Date;
}

// ============================================
// Audience Types
// ============================================

export interface Demographics {
  ageRange: string;
  genderSplit: {
    male: number;
    female: number;
  };
  locations: string[];
  incomeLevel?: string;
}

export interface Psychographics {
  values: string[];
  painPoints: string[];
  motivations: string[];
  lifestyle?: string;
}

export interface Behaviors {
  platforms: Platform[];
  contentPreferences: string[];
  purchaseTriggers: string[];
  buyingFrequency?: string;
}

export interface Persona {
  id: string;
  campaignId: string;
  name: string;
  tagline?: string;
  description: string;
  demographics: Demographics;
  psychographics?: Psychographics;
  behaviors?: Behaviors;
  interests: string[];
  intentScore: number;
  segmentSize?: number;
  aiGenerated: boolean;
  recommendedMessaging?: string;
  creativeDirection?: string;
}

// ============================================
// Creative Types
// ============================================

export type CreativeType = 'image' | 'video' | 'copy';
export type CreativeStatus = 'draft' | 'approved' | 'deployed';

export interface Creative {
  id: string;
  campaignId: string;
  audienceId: string;
  type: CreativeType;
  title: string;
  headline?: string;
  bodyCopy?: string;
  contentUrl: string;
  thumbnailUrl: string;
  aiPrompt?: string;
  aiGenerated: boolean;
  status: CreativeStatus;
}

export interface CreativeVariant {
  headline: string;
  bodyCopy: string;
  visualDirection: string;
  platform: Platform;
}

// ============================================
// Deployment Types
// ============================================

export type DeploymentStatus = 'pending' | 'active' | 'paused' | 'completed';

export interface Deployment {
  id: string;
  campaignId: string;
  creativeId: string;
  audienceId: string;
  platform: Platform;
  platformCampaignId?: string;
  allocatedBudget: number;
  status: DeploymentStatus;
  deployedAt?: Date;
}

// ============================================
// Analytics Types
// ============================================

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpa: number;
  roas: number;
}

export interface AnalyticsData extends CampaignMetrics {
  id: string;
  deploymentId: string;
  date: Date;
}

export interface PerformanceTrend {
  date: Date;
  roas: number;
  spend: number;
  conversions: number;
}

// ============================================
// AI Types
// ============================================

export type OptimizationActionType =
  | 'budget_reallocation'
  | 'bid_adjustment'
  | 'creative_refresh'
  | 'pause_campaign';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface OptimizationRecommendation {
  actionType: OptimizationActionType;
  previousState: Record<string, unknown>;
  newState: Record<string, unknown>;
  reasoning: string;
  expectedImpact: {
    roasChange: number;
    cpaChange: number;
  };
}

export interface DiagnosisResult {
  diagnosis: string;
  severity: Severity;
  findings: {
    issue: string;
    evidence: string;
    impact: string;
  }[];
  recommendations: {
    action: string;
    priority: number;
    expectedImpact: string;
  }[];
  predictedImprovement: number;
}

export interface BudgetAllocation {
  platform: Platform;
  previousBudget: number;
  newBudget: number;
  changePercent: number;
}

export interface BudgetOptimizationResult {
  newAllocations: BudgetAllocation[];
  reasoning: string;
  riskAssessment: 'low' | 'medium' | 'high';
  expectedImpact: {
    roasChange: number;
    cpaChange: number;
    projectedConversions: number;
  };
  alerts: {
    type: string;
    platform: Platform;
    message: string;
  }[];
}

// ============================================
// API Request/Response Types
// ============================================

export interface PersonaGenerationRequest {
  campaignId: string;
  productCategory?: string;
  dataSources: Platform[];
  constraints?: {
    minSegmentSize?: number;
    maxPersonas?: number;
  };
}

export interface CreativeGenerationRequest {
  personaId: string;
  type: CreativeType;
  prompt: string;
  platforms?: Platform[];
}

export interface BudgetOptimizationRequest {
  campaignId: string;
  optimizationGoal: 'roas' | 'cpa' | 'reach';
  constraints?: {
    minPlatformBudget?: number;
    maxDailyChange?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
