export type PlatformName = 'meta' | 'google' | 'tiktok' | 'shopee' | 'lazada' | 'line' | 'lemon8';

export interface PlatformConfig {
  name: PlatformName;
  displayName: string;
  logo: string;
  color: string;
  capabilities: string[];
}

export interface PlatformConnectionStatus {
  platform: PlatformName;
  displayName: string;
  status: 'active' | 'expired' | 'not_connected';
  accountId?: string;
  lastSynced?: Date;
}

export interface DeploymentRequest {
  campaignId: string;
  adSets: Array<{
    personaId: string;
    creativeIds: string[];
    platforms: Array<{
      platform: string;
      budget: number;
    }>;
  }>;
}

export interface DeploymentResult {
  deploymentIds: number[];
  totalBudget: number;
  totalEstimatedReach: number;
  platforms: string[];
}

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  { name: 'meta', displayName: 'Meta', logo: 'M', color: '#1877F2', capabilities: ['video', 'image', 'story', 'carousel'] },
  { name: 'google', displayName: 'Google Ads', logo: 'G', color: '#EA4335', capabilities: ['video', 'image', 'carousel'] },
  { name: 'tiktok', displayName: 'TikTok', logo: 'TT', color: '#000000', capabilities: ['video', 'image', 'carousel'] },
  { name: 'shopee', displayName: 'Shopee', logo: 'SH', color: '#EE4D2D', capabilities: ['image', 'carousel'] },
  { name: 'lazada', displayName: 'Lazada', logo: 'LZ', color: '#0F146D', capabilities: ['image', 'carousel'] },
  { name: 'line', displayName: 'LINE', logo: 'LN', color: '#00B900', capabilities: ['image', 'message'] },
  { name: 'lemon8', displayName: 'Lemon8', logo: 'L8', color: '#FFB800', capabilities: ['image', 'carousel'] },
];
