import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'anthropic/claude-sonnet-4.5';

const anthropic = new Anthropic({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAIResponse(text: string): any {
  function clean(s: string): string {
    s = s.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '');
    s = s.replace(/,\s*([}\]])/g, '$1');
    s = s.replace(/"([^"]*?)"/g, (match) =>
      match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
    );
    return s.trim();
  }

  try { return JSON.parse(clean(text)); } catch {}

  const m = text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(clean(m[0])); } catch {}
  }

  throw new Error('Failed to parse AI response as JSON');
}

export async function analyzeAudience(campaignData: {
  name: string;
  objective: string;
  budget: number;
}) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: `You are an expert audience analyst for digital marketing.
Analyze the campaign data and generate 2-5 detailed personas.

Each persona must include:
- name: Creative persona name (e.g., "The Skincare Geeks")
- tagline: One-line description
- intentScore: Purchase intent score (0-100, must be > 70)
- demographics: { ageRange, education, lifestyle }
- psychographics: { values: string[], painPoints: string[], motivations: string[] }
- behaviors: { platforms: string[], interests: string[], purchaseTriggers: string[] }
- recommendedMessaging: Strategy recommendation
- tags: 3-5 keyword tags

Return ONLY valid JSON array of personas. No markdown or explanation.`,
    messages: [
      {
        role: 'user',
        content: `Campaign: ${campaignData.name}
Objective: ${campaignData.objective}
Budget: $${campaignData.budget}

Generate audience personas for this campaign.`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return parseAIResponse(text);
}

export async function generateCreative(personaData: {
  name: string;
  tagline: string;
  interests: string[];
  prompt: string;
  platforms: string[];
}) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: `You are a creative director for digital advertising.
Generate ad copy variants tailored to the target persona.

For each variant, provide:
- title: Creative title
- headline: Ad headline (max 30 chars)
- body: Ad body copy (max 125 chars)
- cta: Call to action text
- platform: Target platform

Return ONLY valid JSON object with:
{
  "theme": "Creative theme name",
  "variants": [{ title, headline, body, cta, platform }]
}

Generate 3 variants. No markdown or explanation.`,
    messages: [
      {
        role: 'user',
        content: `Persona: ${personaData.name}
Description: ${personaData.tagline}
Interests: ${personaData.interests.join(', ')}
Platforms: ${personaData.platforms.join(', ')}
Direction: ${personaData.prompt}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return parseAIResponse(text);
}

export async function optimizeBudget(campaignData: {
  name: string;
  totalBudget: number;
  platforms: { platform: string; spend: number; revenue: number; conversions: number }[];
  goal: string;
}) {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: `You are a budget optimization expert for digital advertising.
Analyze platform performance and recommend budget reallocation.

For each recommendation, provide:
- action: "increase_budget" or "decrease_budget"
- platform: Platform name
- currentBudget: Current budget amount
- recommendedBudget: Recommended budget amount
- reasoning: Clear explanation of why
- expectedImpact: "High" or "Medium" or "Low"

Return ONLY valid JSON object with:
{
  "recommendations": [{ action, platform, currentBudget, recommendedBudget, reasoning, expectedImpact }],
  "projectedMetrics": { roas: number, cpa: number, roasImprovement: string, cpaReduction: string }
}

No markdown or explanation.`,
    messages: [
      {
        role: 'user',
        content: `Campaign: ${campaignData.name}
Total Budget: $${campaignData.totalBudget}
Optimization Goal: ${campaignData.goal}

Platform Performance:
${campaignData.platforms.map((p) => `- ${p.platform}: Spend $${p.spend}, Revenue $${p.revenue}, Conversions ${p.conversions}`).join('\n')}

Recommend budget reallocation.`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return parseAIResponse(text);
}
