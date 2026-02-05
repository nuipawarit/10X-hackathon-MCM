export type UserRole = 'admin' | 'manager' | 'viewer';

export type CampaignObjective = 'awareness' | 'consideration' | 'conversion';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export type CreativeType = 'image' | 'video' | 'copy';
export type CreativeStatus = 'generating' | 'completed' | 'failed';

export type DeploymentStatus = 'pending' | 'deploying' | 'active' | 'paused' | 'completed';

export type ConnectionStatus = 'active' | 'expired' | 'not_connected';

export type Platform = 'meta' | 'google' | 'tiktok' | 'shopee' | 'lazada' | 'line' | 'lemon8';

export interface CampaignMetrics {
  roas: number;
  cpa: number;
  ctr: number;
  conversions: number;
  spend: number;
  revenue: number;
}

export interface CampaignWithMetrics {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  budget: number;
  startDate: string | null;
  endDate: string | null;
  metrics: CampaignMetrics;
}

export interface TrendPoint {
  date: string;
  roas: number;
}

export interface CreativePerformance {
  id: string;
  name: string;
  platform: string;
  platformColor: string;
  status: string;
  statusColor: string;
  cpa: number;
  ctr: number;
  conversions: number;
  thumbnailUrl?: string;
}

export interface PersonaDemographics {
  ageRange: string;
  education: string;
  lifestyle: string;
}

export interface PersonaPsychographics {
  values: string[];
  painPoints: string[];
  motivations: string[];
}

export interface PersonaBehaviors {
  platforms: string[];
  interests: string[];
  purchaseTriggers: string[];
}

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  intentScore: number;
  demographics: PersonaDemographics;
  psychographics: PersonaPsychographics;
  behaviors: PersonaBehaviors;
  recommendedMessaging: string;
  tags: string[];
  aiGenerated: boolean;
}

export interface CreativeVariant {
  id: number;
  title: string;
  headline: string;
  body: string;
  cta: string;
  platform: string;
  imageUrl?: string;
}

export interface Creative {
  id: string;
  personaId: string;
  type: CreativeType;
  status: CreativeStatus;
  theme: string;
  variants: CreativeVariant[];
  aiGenerated: boolean;
}

export interface PlatformConnection {
  id: string;
  platform: Platform;
  accountId: string | null;
  status: ConnectionStatus;
  lastSyncAt: string | null;
}

export interface DeploymentSummary {
  totalAdSets: number;
  totalPlatforms: number;
  estimatedReach: string;
  totalBudget: number;
}

export interface OptimizationRecommendation {
  id: string;
  action: string;
  platform: string;
  currentBudget: number;
  recommendedBudget: number;
  reasoning: string;
  expectedImpact: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: { field: string; message: string }[];
}
