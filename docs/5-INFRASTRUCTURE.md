# MCM Infrastructure Guide

**Document ID:** INFRA-001
**Version:** 1.0
**Last Updated:** 2026-02-05
**Source:** [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md)

---

## Context

> **Reference:** Architecture "Tech Stack" และ "Consequences"

### Purpose

MCM ใช้ Vercel เป็น infrastructure หลัก ตาม Architecture decision:

| Decision | Alternative | Why This Choice (Architecture) |
|----------|-------------|-------------------------------|
| **Vercel** | AWS/GCP | Zero DevOps, Next.js-optimized, Integrated services |
| **PostgreSQL** | MongoDB | Strong consistency needed for financial data (budget) |
| **Serverless** | Containers | Simpler deployment, faster iteration for MVP |

### Requirements Mapping

> **Reference:** Architecture "Constraints" และ PRD "Success Metrics"

| Requirement | Target | Vercel Solution | Source |
|-------------|--------|-----------------|--------|
| Latency | Dashboard < 2s | Edge Network + KV Cache | PRD "User Activation 70%" |
| Scale | 1000+ campaigns | Auto-scaling Serverless | PRD "Agency Owner" |
| Availability | 99.9% uptime | Vercel SLA | Architecture "Availability" |
| Security | SOC2 ready | Vercel Enterprise | Architecture "Security" |

---

## Decision

### Vercel Services Architecture

> **Reference:** Architecture "Tech Stack" mapping

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Vercel Platform                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Next.js 15 App Router                            │   │
│  │        (Architecture: Frontend + Backend unified codebase)           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐  │
│  │                         API Routes                                     │  │
│  │   /api/campaigns  /api/ai/audience  /api/ai/creative  /api/ai/budget  │  │
│  │        (API Reference document)                                        │  │
│  └─────────────────────────────────┼─────────────────────────────────────┘  │
│                                    │                                         │
│  ┌─────────────┬───────────────────┼───────────────────┬─────────────────┐  │
│  │             │                   │                   │                 │  │
│  │  ┌──────────┴──────┐  ┌────────┴────────┐  ┌──────┴──────┐          │  │
│  │  │ Vercel Postgres │  │  Vercel Blob    │  │  Vercel KV  │          │  │
│  │  │   (Database)    │  │   (Storage)     │  │   (Cache)   │          │  │
│  │  │                 │  │                 │  │             │          │  │
│  │  │ - campaigns     │  │ - creatives/    │  │ - analytics │          │  │
│  │  │ - audiences     │  │ - thumbnails/   │  │ - sessions  │          │  │
│  │  │ - deployments   │  │ - exports/      │  │ - rate-limit│          │  │
│  │  │ - analytics     │  │                 │  │             │          │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────┘          │  │
│  │       (Drizzle ORM)    (Creative Studio)   (AI Optimization)         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                │                │
              ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
              │   Meta    │   │  Google   │   │  TikTok   │   + LINE, Lemon8
              │    API    │   │    API    │   │    API    │
              └───────────┘   └───────────┘   └───────────┘
                        (Integration Mesh - Architecture Module 1)
```

### Service Mapping to Modules

> **Reference:** Architecture "4 Core Modules Detail"

| Service | Module | Purpose | Location (Architecture) |
|---------|--------|---------|------------------------|
| **Postgres** | All | Persistent data | `lib/db/schema/` |
| **Blob** | Creative Studio | Generated assets | `lib/storage/` |
| **KV** | AI Optimization | Analytics cache | `lib/cache/` |
| **Edge Functions** | Dashboard | Fast ROAS queries | `app/api/` |
| **Cron Jobs** | AI Optimization | 24/7 optimization | `/api/cron/optimize` |

### Environment Configuration

> **Reference:** API Reference "Base URLs"

#### Production (`main` branch)
| Variable | Value | API Reference |
|----------|-------|---------------|
| `NODE_ENV` | production | - |
| `NEXT_PUBLIC_APP_URL` | https://mcm.app | Production URL |

#### Preview (feature branches)
| Variable | Value | API Reference |
|----------|-------|---------------|
| `NODE_ENV` | preview | - |
| `NEXT_PUBLIC_APP_URL` | https://preview-xxx.vercel.app | Preview URL |

#### Development (local)
| Variable | Value | Setup Guide |
|----------|-------|-------------|
| `NODE_ENV` | development | - |
| `NEXT_PUBLIC_APP_URL` | http://localhost:3000 | Development URL |

### Vercel Project Settings

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "regions": ["sin1", "hkg1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/optimize",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Configuration Rationale:**

| Setting | Value | Reason (Architecture) |
|---------|-------|----------------------|
| `regions` | sin1, hkg1 | Target: Thailand, SEA market |
| `maxDuration` | 30s | AI API calls need time |
| `cron schedule` | every 6 hours | 24/7 Optimization (PRD F5) |

### Database Setup (Vercel Postgres)

> **Reference:** Architecture "Database Schema"

```bash
# Install Vercel CLI
pnpm i -g vercel

# Link project
vercel link

# Create Postgres database
vercel postgres create mcm-db

# Pull environment variables
vercel env pull .env.local
```

### Blob Storage Setup

> **Reference:** Architecture "Module 3: Generative Creative Studio"

```typescript
// lib/storage/blob.ts
import { put, del, list } from '@vercel/blob';

export async function uploadCreative(file: File, personaId: string) {
  // Store in persona-specific folder (Intelligent Targeting link)
  const blob = await put(`creatives/${personaId}/${file.name}`, file, {
    access: 'public',
  });
  return blob.url;
}
```

### KV Cache Setup

> **Reference:** Architecture "Module 2: AI Optimization Core"

```typescript
// lib/cache/kv.ts
import { kv } from '@vercel/kv';

// Cache analytics for Dashboard (F1) performance
export async function cacheAnalytics(campaignId: string, data: any) {
  await kv.set(`analytics:${campaignId}`, data, { ex: 300 }); // 5 min TTL
}

// Rate limiting for AI APIs (API Reference)
export async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `rate:${userId}`;
  const count = await kv.incr(key);
  if (count === 1) {
    await kv.expire(key, 60); // 1 minute window
  }
  return count <= 100; // 100 requests per minute (API Reference)
}
```

### Deployment Workflow

```
main branch:
  └── Push → Build → Deploy → Production (mcm.app)
      └── Runs: pnpm build
      └── Creates: Serverless functions
      └── Syncs: Environment variables

feature/* branch:
  └── Push → Build → Deploy → Preview (preview-xxx.vercel.app)
  └── PR Comment with preview URL
  └── Runs tests on preview

release/* branch:
  └── Push → Build → Deploy → Staging (staging.mcm.app)
  └── Final QA before production
```

---

## Consequences

### Positive

> **Reference:** Architecture "Consequences - Positive"

| Benefit | Impact | Architecture Reference |
|---------|--------|----------------------|
| **Zero DevOps** | No server management | "Unified Codebase" |
| **Auto-scaling** | Handle traffic spikes | "Scale 1000+ campaigns" |
| **Edge caching** | Dashboard < 2s | "Latency Constraint" |
| **Preview deploys** | Easy collaboration | "Faster iteration for MVP" |
| **Integrated services** | Single vendor simplicity | "Vercel integration" |

### Negative

> **Reference:** Architecture "Consequences - Negative"

| Limitation | Impact | Mitigation | Architecture Reference |
|------------|--------|------------|----------------------|
| **Vendor lock-in** | Tight Vercel integration | Abstract storage/cache behind interfaces | "Trade-offs" |
| **Function timeout** | 30s max | Background jobs for long tasks | "API Timeouts" |
| **Cold starts** | Serverless latency | Edge functions for critical paths | "Cold Starts" |
| **Cost at scale** | Growing costs | Monitor usage, optimize queries | "Monolith" |

### Cost Estimation

> **Reference:** Business Plan "Business Model" tiers

| Service | Free Tier | Pro (~$50/mo) | Enterprise |
|---------|-----------|---------------|------------|
| Hosting | 100GB bandwidth | Unlimited | Custom |
| Postgres | 256MB | 10GB | Dedicated |
| Blob | 1GB | 100GB | Unlimited |
| KV | 30MB | 1GB | Custom |
| **Fits** | **PoC/Demo** | **Starter tier** | **Growth tier** |

### Monitoring & Alerts

> **Reference:** PRD "Success Metrics"

| Metric | Target | Alert Threshold | Source |
|--------|--------|-----------------|--------|
| Error rate | < 0.1% | > 1% | Architecture "Availability" |
| P95 latency | < 500ms | > 2s | PRD "Dashboard < 2s" |
| Function duration | < 10s avg | > 25s | API timeout buffer |
| Database connections | < 80% | > 90% | Scale requirement |

**Setup:**
- Vercel Analytics: Core Web Vitals
- Vercel Logs: Function invocations
- Vercel Speed Insights: Performance
- Custom alerts via Vercel webhooks

---

## References

- **Source Documents:**
  - [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md) - Tech Stack, Modules, Constraints
  - [`docs/3-API-REFERENCE.md`](./3-API-REFERENCE.md) - API Endpoints, Rate Limits
  - [`docs/0-BUSINESS-PLAN.md`](./0-BUSINESS-PLAN.md) - Business Model tiers
- **Next Document:** [`docs/6-IMPLEMENTATION-PLAN.md`](./6-IMPLEMENTATION-PLAN.md)
