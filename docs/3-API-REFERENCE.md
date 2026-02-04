# MCM API Reference

**Document ID:** API-001
**Version:** 1.0
**Last Updated:** 2026-02-05
**Source:** [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md)

---

## Context

> **Reference:** Architecture "4 Core Modules" และ "Data Flow"

### Purpose

API Reference สำหรับ MCM Platform ที่รองรับ **4 Core Modules**:

| Module | API Prefix | Purpose |
|--------|-----------|---------|
| **Integration Mesh** | `/api/integrations` | Platform connections, Deployments |
| **AI Optimization** | `/api/ai/budget` | Budget optimization, ROAS analysis |
| **Creative Studio** | `/api/ai/creative` | Creative generation |
| **Intelligent Targeting** | `/api/ai/audience` | Persona generation |

### Base URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3000/api` |
| Preview | `https://preview-xxx.vercel.app/api` |
| Production | `https://mcm.app/api` |

### Authentication

```
Authorization: Bearer <token>
```

> **Note:** MVP uses Mock Auth with demo users (PRD)

---

## Decision

### API Design Principles

| Principle | Implementation | Rationale |
|-----------|----------------|-----------|
| **RESTful** | Resource-based URLs | Industry standard |
| **JSON** | Request/Response format | Universal compatibility |
| **Versioning** | URL prefix `/api/v1/` (future) | Backward compatibility |
| **Error Format** | `{ error: { code, message } }` | Consistent error handling |
| **Pagination** | `?page=1&limit=20` | Large dataset support |

---

## Campaign APIs

> **Reference:** Architecture "Data Flow Step 1"

### GET /api/campaigns

**Context:** List all campaigns for current user
**Module:** Core

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Summer Sale 2026",
      "objective": "conversion",
      "status": "active",
      "budget": 5000,
      "roas": 5.8,
      "startDate": "2026-01-01",
      "endDate": "2026-02-28"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### POST /api/campaigns

**Context:** Create new campaign
**Module:** Core

**Request:**
```json
{
  "name": "Summer Sale 2026",
  "objective": "awareness|consideration|conversion",
  "budget": 5000,
  "startDate": "2026-01-01",
  "endDate": "2026-02-28"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "status": "draft"
  }
}
```

### GET /api/campaigns/:id

**Context:** Get campaign details with analytics
**Module:** Core + AI Optimization

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Summer Sale 2026",
    "metrics": {
      "impressions": 1500000,
      "clicks": 45000,
      "conversions": 1200,
      "spend": 4500,
      "revenue": 26100,
      "ctr": 0.03,
      "cpa": 3.75,
      "roas": 5.8
    },
    "trend": {
      "roasChange": "+164%",
      "cpaChange": "-40%"
    }
  }
}
```

---

## AI Audience APIs

> **Reference:** Architecture "Module 4: Intelligent Targeting"

### POST /api/ai/audience/analyze

**Context:** Analyze audience and generate personas
**Module:** Intelligent Targeting
**PRD Feature:** F2 - AI Audience Discovery

**Request:**
```json
{
  "campaignId": "uuid",
  "dataSources": ["meta", "google", "tiktok"]
}
```

**Response:**
```json
{
  "data": {
    "personaCount": 2,
    "personas": [
      {
        "id": "uuid",
        "name": "Skincare Geeks",
        "tagline": "Science-driven beauty enthusiasts",
        "intentScore": 87,
        "demographics": {
          "ageRange": "25-35",
          "genderSplit": { "female": 75, "male": 25 },
          "locations": ["Bangkok", "Chiang Mai"]
        },
        "psychographics": {
          "values": ["Quality", "Innovation"],
          "painPoints": ["Finding effective products"],
          "motivations": ["Self-improvement", "Knowledge"]
        },
        "behaviors": {
          "platforms": ["TikTok", "Lemon8"],
          "purchaseTriggers": ["Scientific evidence", "Reviews"]
        },
        "recommendedMessaging": "Lead with ingredients and clinical results"
      }
    ]
  }
}
```

**Consequence:** Creates 2-5 persona records in `audiences` table

### GET /api/ai/audience/:campaignId

**Context:** Get personas for a campaign
**Module:** Intelligent Targeting

**Response:**
```json
{
  "data": {
    "personas": [
      {
        "id": "uuid",
        "name": "Skincare Geeks",
        "intentScore": 87,
        "aiGenerated": true,
        "createdAt": "2026-02-05T10:00:00Z"
      }
    ]
  }
}
```

---

## AI Creative APIs

> **Reference:** Architecture "Module 3: Generative Creative Studio"

### POST /api/ai/creative/generate

**Context:** Generate creative assets with AI
**Module:** Generative Creative Studio
**PRD Feature:** F3 - Generative Creative Studio

**Request:**
```json
{
  "personaId": "uuid",
  "type": "image|video|copy",
  "prompt": "Create ad for Skincare Geeks persona, emphasizing scientific ingredients",
  "platforms": ["tiktok", "instagram", "facebook"]
}
```

**Response:**
```json
{
  "data": {
    "creativeId": "uuid",
    "status": "generating",
    "estimatedTime": 30
  }
}
```

**Consequence:**
- Creates creative record in `creatives` table
- Triggers async generation
- Uploads result to Vercel Blob

### GET /api/ai/creative/:creativeId

**Context:** Get creative status and result
**Module:** Generative Creative Studio

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "status": "completed",
    "type": "copy",
    "variants": [
      {
        "headline": "Discover the Science of Beautiful Skin",
        "body": "Clinical-grade ingredients. Proven results.",
        "cta": "Shop Now",
        "platform": "facebook"
      },
      {
        "headline": "Your Skin Deserves Better",
        "body": "Lab-tested formulas for real results",
        "cta": "Learn More",
        "platform": "instagram"
      }
    ],
    "contentUrl": "https://blob.vercel-storage.com/creatives/...",
    "thumbnailUrl": "https://blob.vercel-storage.com/thumbnails/..."
  }
}
```

---

## AI Budget APIs

> **Reference:** Architecture "Module 2: AI Optimization Core"

### POST /api/ai/budget/optimize

**Context:** Get budget optimization recommendations
**Module:** AI Optimization Core
**PRD Feature:** F5 - Performance Results & Optimization

**Request:**
```json
{
  "campaignId": "uuid",
  "optimizationGoal": "roas|cpa|reach",
  "autoApply": false
}
```

**Response:**
```json
{
  "data": {
    "recommendationId": "uuid",
    "currentState": {
      "totalBudget": 5000,
      "allocations": [
        { "platform": "meta", "budget": 2000, "roas": 4.2 },
        { "platform": "tiktok", "budget": 2000, "roas": 6.5 },
        { "platform": "google", "budget": 1000, "roas": 3.1 }
      ]
    },
    "recommendations": [
      {
        "action": "increase_budget",
        "platform": "tiktok",
        "change": "+500",
        "reasoning": "TikTok ROAS (6.5x) is 55% above average (4.2x)"
      },
      {
        "action": "decrease_budget",
        "platform": "google",
        "change": "-500",
        "reasoning": "Google ROAS (3.1x) is 26% below average"
      }
    ],
    "expectedImpact": {
      "roasChange": "+12%",
      "cpaChange": "-8%"
    }
  }
}
```

**Consequence:** If `autoApply: true`, updates budget allocations and logs to `optimization_logs`

### POST /api/ai/budget/apply

**Context:** Apply optimization recommendation
**Module:** AI Optimization Core

**Request:**
```json
{
  "recommendationId": "uuid"
}
```

**Response:**
```json
{
  "data": {
    "applied": true,
    "logId": "uuid",
    "message": "Budget reallocation applied successfully"
  }
}
```

**Consequence:**
- Updates `deployments` table with new budgets
- Logs to `optimization_logs` for audit trail (Safety Brake feature from PRD)

---

## Integration APIs

> **Reference:** Architecture "Module 1: Integration Mesh"

### GET /api/integrations

**Context:** List connected platforms
**Module:** Integration Mesh
**PRD Feature:** F4 - Cross-Platform Distribution

**Response:**
```json
{
  "data": {
    "platforms": [
      {
        "id": "uuid",
        "platform": "meta",
        "accountId": "123456789",
        "status": "active",
        "lastSyncAt": "2026-02-05T10:00:00Z"
      },
      {
        "platform": "tiktok",
        "status": "not_connected"
      }
    ]
  }
}
```

### POST /api/integrations/:platform/connect

**Context:** Connect platform account
**Module:** Integration Mesh

**Request:**
```json
{
  "platform": "meta|google|tiktok|line|lemon8",
  "accessToken": "oauth_token",
  "accountId": "123456789"
}
```

### POST /api/deployments

**Context:** Deploy creatives to platforms
**Module:** Integration Mesh

**Request:**
```json
{
  "campaignId": "uuid",
  "creativeIds": ["uuid1", "uuid2"],
  "platforms": [
    { "platform": "meta", "budget": 2000 },
    { "platform": "tiktok", "budget": 2000 }
  ]
}
```

**Response:**
```json
{
  "data": {
    "deployments": [
      {
        "id": "uuid",
        "platform": "meta",
        "status": "pending",
        "estimatedReach": "450K"
      }
    ]
  }
}
```

---

## Consequences

### Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `400` | Bad Request | Check request body validation |
| `401` | Unauthorized | Refresh token or re-authenticate |
| `403` | Forbidden | Check user permissions |
| `404` | Not Found | Resource doesn't exist |
| `429` | Rate Limited | Backoff and retry (see `Retry-After` header) |
| `500` | Server Error | Contact support |

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid campaign ID format",
    "details": {
      "field": "campaignId",
      "expected": "uuid"
    }
  }
}
```

### Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/ai/*` | 100 requests | per minute |
| `/api/campaigns` | 1000 requests | per minute |
| `/api/integrations` | 500 requests | per minute |

---

## References

- **Source Documents:**
  - [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md) - Modules, Data Flow
  - [`docs/1-PRD.md`](./1-PRD.md) - Features (F1-F5)
- **Next Document:** [`docs/4-SETUP-GUIDE.md`](./4-SETUP-GUIDE.md)
