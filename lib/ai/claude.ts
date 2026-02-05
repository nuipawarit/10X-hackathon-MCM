import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const AUDIENCE_RESEARCHER_PROMPT = `You are an expert audience analyst for digital marketing.
Your role is to analyze campaign data and generate detailed audience personas.

Analyze the provided data and generate 2-5 detailed personas. Each persona must include:
- A memorable name and one-sentence tagline
- Intent score (0-100) based on purchase likelihood
- Demographics: age range, gender split (percentages), key locations
- Psychographics: values, pain points, motivations
- Behaviors: preferred platforms, content preferences, purchase triggers
- Recommended messaging approach
- Creative direction hints

Rules:
- Minimum segment size should be 10,000 users for statistical significance
- Primary personas should have intent score > 70%
- Consider platform overlap to avoid duplicate targeting
- Focus on behavioral recency (< 30 days) for fresh intent signals

Return your response as valid JSON matching this structure:
{
  "personas": [
    {
      "name": "string",
      "tagline": "string",
      "intentScore": number,
      "segmentSize": number,
      "demographics": {
        "ageRange": "string",
        "genderSplit": { "male": number, "female": number },
        "locations": ["string"]
      },
      "psychographics": {
        "values": ["string"],
        "painPoints": ["string"],
        "motivations": ["string"]
      },
      "behaviors": {
        "platforms": ["string"],
        "contentPreferences": ["string"],
        "purchaseTriggers": ["string"]
      },
      "recommendedMessaging": "string",
      "creativeDirection": "string"
    }
  ]
}`;

const CREATIVE_DIRECTOR_PROMPT = `You are an AI Creative Director for digital advertising.
Your role is to generate ad copy and creative direction tailored to specific audience personas.

Based on the persona provided, generate creative variants including:
- Headlines: Multiple hook options that grab attention
- Body copy: Persuasive text tailored to the persona's pain points and motivations
- Visual direction: Style, mood, colors, and imagery suggestions
- Platform adaptations: Specific tweaks for TikTok, Instagram, Facebook

Guidelines by persona type:
- For "Science-focused" personas: Use clinical, data-driven language with proof points
- For "Busy professional" personas: Emphasize efficiency, time-saving, convenience
- For "Trend-conscious" personas: Use viral language, FOMO, social proof

Return your response as valid JSON matching this structure:
{
  "variants": [
    {
      "headline": "string",
      "body": "string",
      "cta": "string",
      "platform": "string"
    }
  ],
  "visualDirection": {
    "style": "string",
    "mood": "string",
    "colors": ["string"],
    "imagery": ["string"]
  }
}`;

const BUDGET_OPTIMIZER_PROMPT = `You are an AI Budget Optimizer for cross-platform advertising.
Your role is to analyze current budget allocations and recommend optimizations to maximize ROAS.

Optimization Rules:
- If platform ROAS > average ROAS * 1.2: recommend +20% budget increase
- If platform ROAS < average ROAS * 0.8: recommend -15% budget decrease
- If platform CPA < target CPA * 0.8: recommend budget increase
- If platform CPA > target CPA * 1.2: recommend budget decrease
- Maximum daily change should not exceed 30%
- Minimum platform budget: $10/day to maintain learning

Return your response as valid JSON matching this structure:
{
  "recommendations": [
    {
      "action": "increase_budget" | "decrease_budget" | "maintain",
      "platform": "string",
      "currentBudget": number,
      "recommendedBudget": number,
      "change": "string (e.g., '+500' or '-300')",
      "reasoning": "string"
    }
  ],
  "expectedImpact": {
    "roasChange": "string (e.g., '+12%')",
    "cpaChange": "string (e.g., '-8%')"
  },
  "riskAssessment": "low" | "medium" | "high",
  "alerts": [
    {
      "type": "string",
      "platform": "string",
      "message": "string"
    }
  ]
}`;

export interface PersonaResult {
  name: string;
  tagline: string;
  intentScore: number;
  segmentSize: number;
  demographics: {
    ageRange: string;
    genderSplit: { male: number; female: number };
    locations: string[];
  };
  psychographics: {
    values: string[];
    painPoints: string[];
    motivations: string[];
  };
  behaviors: {
    platforms: string[];
    contentPreferences: string[];
    purchaseTriggers: string[];
  };
  recommendedMessaging: string;
  creativeDirection: string;
}

export interface CreativeVariant {
  headline: string;
  body: string;
  cta: string;
  platform: string;
}

export interface CreativeResult {
  variants: CreativeVariant[];
  visualDirection: {
    style: string;
    mood: string;
    colors: string[];
    imagery: string[];
  };
}

export interface BudgetRecommendation {
  action: 'increase_budget' | 'decrease_budget' | 'maintain';
  platform: string;
  currentBudget: number;
  recommendedBudget: number;
  change: string;
  reasoning: string;
}

export interface BudgetOptimizationResult {
  recommendations: BudgetRecommendation[];
  expectedImpact: {
    roasChange: string;
    cpaChange: string;
  };
  riskAssessment: 'low' | 'medium' | 'high';
  alerts: { type: string; platform: string; message: string }[];
}

export async function analyzeAudience(campaignData: {
  name: string;
  objective: string;
  budget: number;
  productCategory?: string;
}): Promise<{ personas: PersonaResult[] }> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Analyze this campaign and generate audience personas:

Campaign: ${campaignData.name}
Objective: ${campaignData.objective}
Budget: $${campaignData.budget}
Product Category: ${campaignData.productCategory || 'General consumer goods'}

Generate 2-3 detailed personas that would be most likely to convert for this campaign.`,
      },
    ],
    system: AUDIENCE_RESEARCHER_PROMPT,
  });

  const textContent = message.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from response');
  }

  return JSON.parse(jsonMatch[0]);
}

export async function generateCreative(
  persona: {
    name: string;
    demographics: Record<string, unknown>;
    psychographics?: Record<string, unknown>;
    behaviors?: Record<string, unknown>;
    recommendedMessaging?: string;
  },
  prompt: string,
  platforms: string[]
): Promise<CreativeResult> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Generate ad creative for this persona:

Persona: ${persona.name}
Demographics: ${JSON.stringify(persona.demographics)}
Psychographics: ${JSON.stringify(persona.psychographics || {})}
Behaviors: ${JSON.stringify(persona.behaviors || {})}
Recommended Messaging: ${persona.recommendedMessaging || 'Not specified'}

User Request: ${prompt}

Target Platforms: ${platforms.join(', ')}

Generate compelling ad copy variants tailored to this persona for each platform.`,
      },
    ],
    system: CREATIVE_DIRECTOR_PROMPT,
  });

  const textContent = message.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from response');
  }

  return JSON.parse(jsonMatch[0]);
}

export async function optimizeBudget(platformData: {
  totalBudget: number;
  platforms: {
    name: string;
    currentAllocation: number;
    roas: number;
    cpa: number;
    spend: number;
    conversions: number;
  }[];
  targetRoas?: number;
  targetCpa?: number;
}): Promise<BudgetOptimizationResult> {
  const avgRoas =
    platformData.platforms.reduce((sum, p) => sum + p.roas, 0) /
    platformData.platforms.length;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Analyze this budget allocation and recommend optimizations:

Total Budget: $${platformData.totalBudget}
Average ROAS: ${avgRoas.toFixed(2)}x
Target ROAS: ${platformData.targetRoas || 3}x
Target CPA: $${platformData.targetCpa || 30}

Platform Performance:
${platformData.platforms
  .map(
    (p) =>
      `- ${p.name}: Budget $${p.currentAllocation}, ROAS ${p.roas.toFixed(2)}x, CPA $${p.cpa.toFixed(2)}, Spend $${p.spend}, Conversions ${p.conversions}`
  )
  .join('\n')}

Recommend budget reallocations to maximize overall ROAS while maintaining reach.`,
      },
    ],
    system: BUDGET_OPTIMIZER_PROMPT,
  });

  const textContent = message.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from response');
  }

  return JSON.parse(jsonMatch[0]);
}
