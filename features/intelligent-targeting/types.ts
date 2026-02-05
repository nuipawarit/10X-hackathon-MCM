import { type LucideIcon } from 'lucide-react';

export interface PersonaTag {
  label: string;
  category: 'interest' | 'behavior' | 'demographic';
}

export interface PersonaData {
  id: number;
  title: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  tags: string[];
  intent: number;
  description: string;
  demographics: string;
  interests: string[];
}

export interface AudienceAnalysisRequest {
  campaignId: string;
  campaignName: string;
  objective: string;
  budget: string;
  industry?: string;
}

export interface AudienceAnalysisResult {
  personas: PersonaData[];
  totalReach: string;
  avgIntent: number;
}

export interface TransformationData {
  before: {
    reach: string;
    avgIntent: number;
  };
  after: {
    personas: Array<{
      id: number;
      title: string;
      intent: number;
    }>;
  };
}
