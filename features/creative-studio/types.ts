export interface CreativeVariant {
  id: string;
  url: string;
  title: string;
  format: 'square' | 'story' | 'landscape';
}

export interface CreativeGroup {
  persona: string;
  personaId: number;
  theme: string;
  iconBg: string;
  iconColor: string;
  images: CreativeVariant[];
}

export interface GenerateCreativeRequest {
  campaignId: string;
  personaId: string;
  personaName: string;
  personaDescription: string;
  demographics: string;
  interests: string[];
  campaignObjective: string;
}

export interface GenerateCreativeResult {
  creativeId: string;
  theme: string;
  variants: CreativeVariant[];
  status: 'generating' | 'completed' | 'failed';
}

export interface RefinePromptRequest {
  creativeId: number;
  prompt: string;
}
