# MCM System Architecture

**Document ID:** ARCH-002
**Version:** 2.0
**Last Updated:** 2026-02-05
**Source:** [`docs/1-PRD.md`](./1-PRD.md), [`docs/0-BUSINESS-PLAN.md`](./0-BUSINESS-PLAN.md)

---

## Context

MCM ต้องการ architecture ที่รองรับ **5 Core Features** จาก PRD:

| Feature | Requirements | Source Module |
|---------|-------------|---------------|
| F1: Dashboard | Real-time ROAS tracking, Cross-platform view | AI Optimization Core |
| F2: Audience Discovery | AI persona generation, Intent scoring | Intelligent Targeting |
| F3: Creative Studio | Gen AI content generation, A/B variants | Generative Creative Studio |
| F4: Distribution | Multi-platform API connections | Integration Mesh |
| F5: Results | Auto-optimization, Budget reallocation | AI Optimization Core |

---

## Decision

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        MCM Platform                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Frontend (Next.js 15 App Router)               │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │Dashboard │ │Audience  │ │Creative  │ │Distribution+ │  │  │
│  │  │  (F1)    │ │  (F2)    │ │  (F3)    │ │Results(F4+F5)│  │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘  │  │
│  └───────┼─────────────┼─────────────┼─────────────┼──────────┘  │
│          │             │             │             │              │
│  ┌───────┴─────────────┴─────────────┴─────────────┴──────────┐  │
│  │                  Next.js API Routes                         │  │
│  │  /api/campaigns  /api/ai/*  /api/integrations  /api/deploy │  │
│  └───────┬─────────────┬─────────────┬─────────────┬──────────┘  │
│          │             │             │             │              │
│  ┌───────┴─────────────┴─────────────┴─────────────┴──────────┐  │
│  │                    4 Core Modules                           │  │
│  │ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ ┌─────────┐ │  │
│  │ │ Integration │ │     AI      │ │Generative │ │Intellig.│ │  │
│  │ │    Mesh     │ │Optimization │ │ Creative  │ │Targeting│ │  │
│  │ │   (F4)      │ │Core (F1,F5) │ │Studio(F3) │ │  (F2)   │ │  │
│  │ └──────┬──────┘ └──────┬──────┘ └─────┬─────┘ └────┬────┘ │  │
│  └────────┼───────────────┼──────────────┼─────────────┼──────┘  │
│           │               │              │             │          │
│  ┌────────┴───────────────┴──────────────┴─────────────┴──────┐  │
│  │                   PostgreSQL Database                       │  │
│  │  campaigns | audiences | creatives | deployments | analytics│  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                   │               │               │
             ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐
             │   Meta    │  │  Google   │  │  TikTok   │  + LINE, Lemon8
             │    API    │  │    API    │  │    API    │
             └───────────┘  └───────────┘  └───────────┘
```

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 15 (App Router) | Server components, SEO, Vercel integration |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development, Consistent design |
| **Backend** | Next.js API Routes | Unified codebase, Serverless |
| **Database** | PostgreSQL (Vercel Postgres) | Strong consistency, JSON support |
| **ORM** | Drizzle ORM | Type-safe, Lightweight |
| **AI** | Claude API (@anthropic-ai/sdk) | Reasoning, Analysis, Content generation |
| **Storage** | Vercel Blob | Creative assets storage |
| **Cache** | Vercel KV | Rate limiting, Analytics cache |
| **State** | Zustand | Lightweight, React-friendly |
| **Validation** | Zod | Runtime type checking |
| **Charts** | Recharts | ROAS trend, Performance visualization |

### 4 Core Modules

#### Module 1: Integration Mesh → F4 (Distribution)

| Aspect | Detail |
|--------|--------|
| **Responsibility** | เชื่อมต่อ API กับ Ad Platforms, ดึงข้อมูล Real-time |
| **Platforms** | Meta, Google, TikTok, LINE, Lemon8 |
| **Location** | `features/integration-mesh/` |

#### Module 2: AI Optimization Core → F1 (Dashboard), F5 (Results)

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Dynamic Budget Allocation, Smart Bidding, ROAS Analysis |
| **AI Model** | Claude API for reasoning |
| **Location** | `features/ai-optimization/` |

#### Module 3: Generative Creative Studio → F3 (Creative Studio)

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Gen AI สร้าง Copy/Image variants, A/B Testing |
| **AI Model** | Claude API for copy generation |
| **Location** | `features/creative-studio/` |

#### Module 4: Intelligent Targeting → F2 (Audience Discovery)

| Aspect | Detail |
|--------|--------|
| **Responsibility** | AI Persona Generation, Purchase Intent Scoring |
| **AI Model** | Claude API for audience analysis |
| **Location** | `features/intelligent-targeting/` |

### Project Structure

```
mcm-app/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard layout + nav
│   │   ├── page.tsx              # F1: Dashboard
│   │   ├── audience/page.tsx     # F2: Audience Discovery
│   │   ├── creative/page.tsx     # F3: Creative Studio
│   │   ├── distribution/page.tsx # F4: Distribution
│   │   └── results/page.tsx      # F5: Results
│   ├── api/
│   │   ├── campaigns/            # Campaign CRUD
│   │   ├── ai/
│   │   │   ├── audience/         # Intelligent Targeting
│   │   │   ├── creative/         # Creative Studio
│   │   │   └── budget/           # AI Optimization
│   │   ├── integrations/         # Platform APIs
│   │   └── deployments/          # Deployment management
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # shadcn/ui (DO NOT MODIFY)
│   ├── layout/                   # Header, Navigation
│   ├── dashboard/                # F1 components
│   ├── audience/                 # F2 components
│   ├── creative/                 # F3 components
│   ├── distribution/             # F4 components
│   └── results/                  # F5 components
├── features/
│   ├── integration-mesh/         # Module 1
│   ├── ai-optimization/          # Module 2
│   ├── creative-studio/          # Module 3
│   └── intelligent-targeting/    # Module 4
├── agents/claude/                # AI Agent prompts
├── lib/
│   ├── db/schema/                # Drizzle schema (split per table)
│   ├── ai/                       # Claude API client
│   ├── storage/                  # Vercel Blob
│   ├── cache/                    # Vercel KV
│   └── validations/              # Zod schemas
├── types/                        # TypeScript types
└── docs/                         # Documentation chain
```

### Database Schema

#### users
```sql
id          UUID PRIMARY KEY
email       VARCHAR(255) UNIQUE NOT NULL
name        VARCHAR(255) NOT NULL
role        ENUM('admin', 'manager', 'viewer')
avatarUrl   TEXT
createdAt   TIMESTAMP DEFAULT NOW()
updatedAt   TIMESTAMP DEFAULT NOW()
```

#### campaigns
```sql
id          UUID PRIMARY KEY
name        VARCHAR(255) NOT NULL
objective   ENUM('awareness', 'consideration', 'conversion')
status      ENUM('draft', 'active', 'paused', 'completed')
budget      DECIMAL(12,2) NOT NULL
startDate   DATE
endDate     DATE
userId      UUID REFERENCES users(id)
createdAt   TIMESTAMP DEFAULT NOW()
updatedAt   TIMESTAMP DEFAULT NOW()
```

#### audiences
```sql
id                    UUID PRIMARY KEY
campaignId            UUID REFERENCES campaigns(id)
name                  VARCHAR(255) NOT NULL
tagline               TEXT
intentScore           INTEGER (0-100)
demographics          JSONB  -- { ageRange, gender, locations, education }
psychographics        JSONB  -- { values, painPoints, motivations }
behaviors             JSONB  -- { platforms, purchaseTriggers, interests }
recommendedMessaging  TEXT
aiGenerated           BOOLEAN DEFAULT true
createdAt             TIMESTAMP DEFAULT NOW()
```

#### creatives
```sql
id            UUID PRIMARY KEY
campaignId    UUID REFERENCES campaigns(id)
personaId     UUID REFERENCES audiences(id)
type          ENUM('image', 'video', 'copy')
status        ENUM('generating', 'completed', 'failed')
prompt        TEXT
variants      JSONB  -- [{ headline, body, cta, platform, imageUrl }]
contentUrl    TEXT   -- Vercel Blob URL
thumbnailUrl  TEXT
aiGenerated   BOOLEAN DEFAULT true
createdAt     TIMESTAMP DEFAULT NOW()
```

#### deployments
```sql
id             UUID PRIMARY KEY
campaignId     UUID REFERENCES campaigns(id)
creativeId     UUID REFERENCES creatives(id)
platform       ENUM('meta', 'google', 'tiktok', 'line', 'lemon8')
budget         DECIMAL(12,2)
status         ENUM('pending', 'deploying', 'active', 'paused', 'completed')
estimatedReach VARCHAR(50)
externalId     VARCHAR(255)  -- Platform's campaign ID
createdAt      TIMESTAMP DEFAULT NOW()
updatedAt      TIMESTAMP DEFAULT NOW()
```

#### analytics
```sql
id           UUID PRIMARY KEY
campaignId   UUID REFERENCES campaigns(id)
deploymentId UUID REFERENCES deployments(id)
platform     VARCHAR(50)
impressions  INTEGER DEFAULT 0
clicks       INTEGER DEFAULT 0
conversions  INTEGER DEFAULT 0
spend        DECIMAL(12,2) DEFAULT 0
revenue      DECIMAL(12,2) DEFAULT 0
date         DATE NOT NULL
createdAt    TIMESTAMP DEFAULT NOW()
```

#### platform_connections
```sql
id           UUID PRIMARY KEY
userId       UUID REFERENCES users(id)
platform     ENUM('meta', 'google', 'tiktok', 'line', 'lemon8')
accountId    VARCHAR(255)
accessToken  TEXT
status       ENUM('active', 'expired', 'not_connected')
lastSyncAt   TIMESTAMP
createdAt    TIMESTAMP DEFAULT NOW()
```

#### optimization_logs
```sql
id               UUID PRIMARY KEY
campaignId       UUID REFERENCES campaigns(id)
recommendationId UUID
action           TEXT NOT NULL
platform         VARCHAR(50)
previousBudget   DECIMAL(12,2)
newBudget        DECIMAL(12,2)
reasoning        TEXT
applied          BOOLEAN DEFAULT false
appliedAt        TIMESTAMP
createdAt        TIMESTAMP DEFAULT NOW()
```

### Data Flow

```
Step 1: Dashboard → Detect ROAS decline
  User visits / → GET /api/campaigns → analytics table → Display chart + alerts

Step 2: Audience Discovery
  Click "Analyze" → POST /api/ai/audience/analyze → Claude API → audiences table

Step 3: Creative Generation
  Click "Generate" → POST /api/ai/creative/generate → Claude API → creatives table → Blob

Step 4: Distribution
  Click "Launch" → POST /api/deployments → deployments table → (Mock) External Platforms

Step 5: Results & Optimization
  View /results → GET analytics → POST /api/ai/budget/optimize → Claude API → recommendations
  Apply → POST /api/ai/budget/apply → update deployments → optimization_logs
```

---

## Consequences

| Benefit | Trade-off |
|---------|-----------|
| Modular 4-module architecture | More files to navigate |
| Clear Frontend ↔ API ↔ Module separation | Cross-module coordination needed |
| Audit trail via optimization_logs | Storage overhead |
| Unified Next.js codebase | Limited to Node.js ecosystem |
| Serverless on Vercel | 30s function timeout, cold starts |

---

## References

- [`docs/0-BUSINESS-PLAN.md`](./0-BUSINESS-PLAN.md) - 4 Modules definition
- [`docs/1-PRD.md`](./1-PRD.md) - Features, User Flow, Success Metrics
