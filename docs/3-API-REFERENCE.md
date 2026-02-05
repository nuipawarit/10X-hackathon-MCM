# MCM API Reference

**Document ID:** API-002
**Version:** 2.0
**Last Updated:** 2026-02-05
**Source:** [`docs/1-PRD.md`](./1-PRD.md), [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md)

---

## Base URL

```
Development: http://localhost:3000/api
Production:  https://mcm.vercel.app/api
```

## Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid campaign ID",
    "details": [{ "field": "campaignId", "message": "Must be a valid UUID" }]
  }
}
```

## Rate Limits

| Endpoint Group | Limit |
|---------------|-------|
| AI APIs (`/api/ai/*`) | 100 req/min |
| Campaigns (`/api/campaigns/*`) | 1000 req/min |
| Integrations (`/api/integrations/*`) | 500 req/min |

---

## 1. Campaigns

### GET /api/campaigns

List campaigns with aggregated metrics.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| status | string | - | Filter by status |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Summer Skincare Launch",
      "objective": "conversion",
      "status": "active",
      "budget": 5000,
      "startDate": "2026-01-28",
      "endDate": "2026-03-28",
      "metrics": {
        "roas": 2.2,
        "cpa": 15.00,
        "ctr": 0.8,
        "conversions": 180,
        "spend": 3200,
        "revenue": 7040
      }
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 2 }
}
```

### POST /api/campaigns

Create a new campaign.

**Request Body:**
```json
{
  "name": "Q2 Brand Campaign",
  "objective": "awareness",
  "budget": 10000,
  "startDate": "2026-04-01",
  "endDate": "2026-06-30"
}
```

**Response 201:**
```json
{
  "data": { "id": "uuid", "name": "Q2 Brand Campaign", "status": "draft", ... }
}
```

### GET /api/campaigns/:id

Get campaign detail with trend data.

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Summer Skincare Launch",
    "status": "active",
    "budget": 5000,
    "metrics": { "roas": 2.2, "cpa": 15.00, "ctr": 0.8, "conversions": 180 },
    "trend": [
      { "date": "2026-01-28", "roas": 4.2 },
      { "date": "2026-01-29", "roas": 4.0 },
      { "date": "2026-01-30", "roas": 3.8 },
      { "date": "2026-01-31", "roas": 3.2 },
      { "date": "2026-02-01", "roas": 2.8 },
      { "date": "2026-02-02", "roas": 2.5 },
      { "date": "2026-02-03", "roas": 2.2 }
    ],
    "creatives": [
      {
        "id": "uuid",
        "name": "Lifestyle Video",
        "platform": "Facebook",
        "status": "Low Performance",
        "cpa": 15.00,
        "ctr": 0.8,
        "conversions": 24
      },
      {
        "id": "uuid",
        "name": "Texture Zoom Image",
        "platform": "TikTok",
        "status": "High Performance",
        "cpa": 4.50,
        "ctr": 3.2,
        "conversions": 156
      }
    ]
  }
}
```

---

## 2. AI Audience Analysis

### POST /api/ai/audience/analyze

Trigger AI persona generation for a campaign.

**Request Body:**
```json
{
  "campaignId": "uuid",
  "dataSources": ["meta", "tiktok"]
}
```

**Response 200:**
```json
{
  "data": {
    "campaignId": "uuid",
    "personas": [
      {
        "id": "uuid",
        "name": "The Skincare Geeks",
        "tagline": "Science-focused consumers who research ingredients",
        "intentScore": 92,
        "demographics": {
          "ageRange": "25-40",
          "education": "College-educated",
          "lifestyle": "Urban"
        },
        "psychographics": {
          "values": ["Ingredient transparency", "Scientific backing"],
          "painPoints": ["Sensitive skin", "Misleading claims"],
          "motivations": ["Effective results", "Clean formulations"]
        },
        "behaviors": {
          "platforms": ["TikTok", "Lemon8"],
          "interests": ["Clean Beauty", "Dermatology", "Product Research"],
          "purchaseTriggers": ["Clinical studies", "Before/after photos"]
        },
        "recommendedMessaging": "Focus on ingredient science and clinical results",
        "tags": ["Ingredients", "Sensitive Skin", "Reviews"]
      }
    ]
  }
}
```

### GET /api/ai/audience/:campaignId

Get personas for a campaign.

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "The Skincare Geeks",
      "tagline": "Science-focused consumers...",
      "intentScore": 92,
      "demographics": { ... },
      "psychographics": { ... },
      "behaviors": { ... },
      "tags": ["Ingredients", "Sensitive Skin", "Reviews"],
      "aiGenerated": true,
      "createdAt": "2026-02-05T00:00:00Z"
    }
  ]
}
```

---

## 3. AI Creative Generation

### POST /api/ai/creative/generate

Generate ad creatives for a persona.

**Request Body:**
```json
{
  "campaignId": "uuid",
  "personaId": "uuid",
  "type": "image",
  "prompt": "Create lab-setting skincare ads emphasizing science",
  "platforms": ["tiktok", "lemon8"]
}
```

**Response 200:**
```json
{
  "data": {
    "creativeId": "uuid",
    "status": "generating",
    "estimatedTime": 30
  }
}
```

### GET /api/ai/creative/:creativeId

Get creative status and variants.

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "personaId": "uuid",
    "type": "image",
    "status": "completed",
    "theme": "Laboratory & Science",
    "variants": [
      {
        "id": 1,
        "title": "Clean Lab Setting",
        "headline": "Science-Backed Skincare",
        "body": "Formulated with dermatologist-approved ingredients",
        "cta": "Shop Now",
        "platform": "tiktok",
        "imageUrl": "https://blob.vercel-storage.com/..."
      }
    ],
    "aiGenerated": true,
    "createdAt": "2026-02-05T00:00:00Z"
  }
}
```

---

## 4. Integrations

### GET /api/integrations

List platform connections.

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "platform": "meta",
      "accountId": "act_123456",
      "status": "active",
      "lastSyncAt": "2026-02-05T00:00:00Z"
    },
    {
      "id": "uuid",
      "platform": "tiktok",
      "accountId": "tt_789",
      "status": "active",
      "lastSyncAt": "2026-02-05T00:00:00Z"
    },
    {
      "platform": "line",
      "status": "not_connected"
    }
  ]
}
```

### POST /api/integrations/:platform/connect

Connect a platform.

**Request Body:**
```json
{
  "accountId": "act_123456",
  "accessToken": "EAABsb..."
}
```

**Response 200:**
```json
{
  "data": { "id": "uuid", "platform": "meta", "status": "active" }
}
```

---

## 5. Deployments

### POST /api/deployments

Create campaign deployments across platforms.

**Request Body:**
```json
{
  "campaignId": "uuid",
  "adSets": [
    {
      "personaId": "uuid",
      "creativeIds": ["uuid", "uuid"],
      "platforms": [
        { "platform": "tiktok", "budget": 2500, "estimatedReach": "450K" },
        { "platform": "lemon8", "budget": 2500, "estimatedReach": "280K" }
      ]
    }
  ]
}
```

**Response 201:**
```json
{
  "data": {
    "deployments": [
      {
        "id": "uuid",
        "platform": "tiktok",
        "budget": 2500,
        "status": "pending",
        "estimatedReach": "450K"
      }
    ],
    "summary": {
      "totalAdSets": 2,
      "totalPlatforms": 4,
      "estimatedReach": "1.63M",
      "totalBudget": 5000
    }
  }
}
```

---

## 6. Budget Optimization

### POST /api/ai/budget/optimize

Get AI budget optimization recommendations.

**Request Body:**
```json
{
  "campaignId": "uuid",
  "optimizationGoal": "roas",
  "autoApply": false
}
```

**Response 200:**
```json
{
  "data": {
    "campaignId": "uuid",
    "currentMetrics": {
      "roas": 2.2,
      "cpa": 15.00,
      "ctr": 0.8,
      "totalSpend": 5000
    },
    "recommendations": [
      {
        "id": "uuid",
        "action": "increase_budget",
        "platform": "tiktok",
        "currentBudget": 1500,
        "recommendedBudget": 2500,
        "reasoning": "TikTok shows 95% above expected CPA targets for Skincare Geeks segment",
        "expectedImpact": "High"
      },
      {
        "id": "uuid",
        "action": "decrease_budget",
        "platform": "meta",
        "currentBudget": 2500,
        "recommendedBudget": 1500,
        "reasoning": "Facebook ROAS declining -47% over 7 days, creative fatigue detected",
        "expectedImpact": "High"
      }
    ],
    "projectedMetrics": {
      "roas": 5.8,
      "cpa": 9.00,
      "roasImprovement": "+164%",
      "cpaReduction": "-40%"
    }
  }
}
```

### POST /api/ai/budget/apply

Apply a budget optimization recommendation.

**Request Body:**
```json
{
  "recommendationId": "uuid"
}
```

**Response 200:**
```json
{
  "data": {
    "applied": true,
    "logId": "uuid",
    "message": "Budget reallocated: TikTok +$1,000, Meta -$1,000",
    "appliedAt": "2026-02-05T12:00:00Z"
  }
}
```

---

## References

- [`docs/1-PRD.md`](./1-PRD.md) - Feature acceptance criteria
- [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md) - Database schema, Modules
