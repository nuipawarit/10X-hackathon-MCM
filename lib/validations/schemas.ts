import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  objective: z.enum(['awareness', 'consideration', 'conversion']),
  budget: z.number().positive(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const analyzeAudienceSchema = z.object({
  campaignId: z.string().uuid(),
  dataSources: z.array(z.enum(['meta', 'google', 'tiktok', 'line', 'lemon8'])).optional(),
});

export const generateCreativeSchema = z.object({
  campaignId: z.string().uuid(),
  personaId: z.string().uuid(),
  type: z.enum(['image', 'video', 'copy']),
  prompt: z.string().min(1),
  platforms: z.array(z.string()).min(1),
});

export const createDeploymentSchema = z.object({
  campaignId: z.string().uuid(),
  adSets: z.array(z.object({
    personaId: z.string().uuid(),
    creativeIds: z.array(z.string().uuid()),
    platforms: z.array(z.object({
      platform: z.string(),
      budget: z.number().positive(),
      estimatedReach: z.string().optional(),
    })),
  })),
});

export const optimizeBudgetSchema = z.object({
  campaignId: z.string().uuid(),
  optimizationGoal: z.enum(['roas', 'cpa', 'reach']),
  autoApply: z.boolean().optional().default(false),
});

export const applyOptimizationSchema = z.object({
  recommendationId: z.string().uuid(),
});

export const connectPlatformSchema = z.object({
  accountId: z.string().min(1),
  accessToken: z.string().min(1),
});
