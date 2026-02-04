# MCM System Architecture

**Document ID:** ARCH-001
**Version:** 1.0
**Last Updated:** 2026-02-05
**Source:** [`docs/1-PRD.md`](./1-PRD.md), [`docs/0-BUSINESS-PLAN.md`](./0-BUSINESS-PLAN.md)

---

## Context

> **Reference:** PRD Section "Core Features" และ Business Plan Section 3 "Solution"

### Background

MCM ต้องการ architecture ที่รองรับ **5 Core Features** จาก PRD:

| Feature | Requirements | Source Module |
|---------|-------------|---------------|
| F1: Dashboard | Real-time ROAS tracking, Cross-platform view | AI Optimization Core |
| F2: Audience Discovery | AI persona generation, Intent scoring | Intelligent Targeting |
| F3: Creative Studio | Gen AI content generation, A/B variants | Generative Creative Studio |
| F4: Distribution | Multi-platform API connections | Integration Mesh |
| F5: Results | Auto-optimization, Budget reallocation | AI Optimization Core |

### Constraints

> **Reference:** PRD Section "Success Metrics"

| Constraint | Target | Rationale |
|------------|--------|-----------|
| **Latency** | Dashboard < 2s load time | User Activation target 70% |
| **Scale** | Support 1000+ concurrent campaigns | Agency Owner use case: Scale Portfolio |
| **Availability** | 99.9% uptime for critical paths | 24/7 Relentless Optimization |
| **Security** | SOC2 compliance ready | Enterprise B2B target users |

---

## Decision

### High-Level Architecture

> **Reference:** Business Plan Section 3 - "4 Modules" → PRD "4 Core Modules Mapping"

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MCM Platform                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Frontend (Next.js App Router)                    │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────────────┐ │   │
│  │  │ Dashboard │  │ Audience  │  │ Creative  │  │ Distribution +    │ │   │
│  │  │   (F1)    │  │   (F2)    │  │   (F3)    │  │ Results (F4+F5)   │ │   │
│  │  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────────┬─────────┘ │   │
│  └────────┼──────────────┼──────────────┼──────────────────┼───────────┘   │
│           │              │              │                  │                │
│  ┌────────┴──────────────┴──────────────┴──────────────────┴───────────┐   │
│  │                     Next.js API Routes                               │   │
│  │  /api/campaigns  /api/ai/audience  /api/ai/creative  /api/ai/budget │   │
│  └────────┬──────────────┬──────────────┬──────────────────┬───────────┘   │
│           │              │              │                  │                │
│  ┌────────┴──────────────┴──────────────┴──────────────────┴───────────┐   │
│  │                        4 Core Modules                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │   │
│  │  │ Integration  │  │     AI       │  │  Generative  │  │Intelligent│ │   │
│  │  │    Mesh      │  │ Optimization │  │  Creative    │  │ Targeting │ │   │
│  │  │   (F4)       │  │  Core (F1,F5)│  │  Studio (F3) │  │   (F2)    │ │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬────┘ │   │
│  └─────────┼─────────────────┼─────────────────┼────────────────┼──────┘   │
│            │                 │                 │                │          │
│  ┌─────────┴─────────────────┴─────────────────┴────────────────┴──────┐   │
│  │                      PostgreSQL Database                             │   │
│  │   campaigns | audiences | creatives | deployments | analytics        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                │                │
              ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
              │   Meta    │   │  Google   │   │  TikTok   │   + LINE, Lemon8
              │    API    │   │    API    │   │    API    │
              └───────────┘   └───────────┘   └───────────┘
```

### 4 Core Modules Detail

> **Reference:** Business Plan Section 3.1-3.4

#### Module 1: Integration Mesh
> Supports: F4 (Distribution)

| Aspect | Detail |
|--------|--------|
| **Responsibility** | เชื่อมต่อ API กับ Ad Platforms, ดึงข้อมูล Real-time, Webhooks |
| **Platforms** | Meta, Google, TikTok, LINE, Lemon8 |
| **Capabilities** | Push ads, Pull analytics, Sync audiences |
| **Location** | `features/integration-mesh/` |

#### Module 2: AI Optimization Core
> Supports: F1 (Dashboard), F5 (Results)

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Dynamic Budget Allocation, Smart Bidding, ROAS Analysis |
| **AI Model** | Claude API for reasoning, Rules-based for execution |
| **Capabilities** | 24/7 optimization, Transparent logging, Human override |
| **Location** | `features/ai-optimization/` |

#### Module 3: Generative Creative Studio
> Supports: F3 (Creative Studio)

| Aspect | Detail |
|--------|--------|
| **Responsibility** | Gen AI สร้าง VDO/Image/Copy, A/B Testing variants |
| **AI Model** | Claude API for copy, External APIs for images |
| **Capabilities** | Persona-based generation, Platform adaptation |
| **Location** | `features/creative-studio/` |

#### Module 4: Intelligent Targeting
> Supports: F2 (Audience Discovery)

| Aspect | Detail |
|--------|--------|
| **Responsibility** | AI Persona Generation, Purchase Intent Scoring |
| **AI Model** | Claude API for analysis |
| **Capabilities** | Demographics, Psychographics, Behaviors, Micro-segments |
| **Location** | `features/intelligent-targeting/` |

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
| **Cache** | Vercel KV | Rate limiting, Session, Analytics cache |
| **State** | Zustand | Lightweight, React-friendly |
| **Validation** | Zod | Runtime type checking |

### Data Flow

> **Reference:** PRD "User Flow"

```
Step 1: Campaign Creation
User → Dashboard → POST /api/campaigns → Database

Step 2: Audience Analysis (F2)
Dashboard Alert → /api/ai/audience/analyze → Intelligent Targeting → personas table

Step 3: Creative Generation (F3)
Audience Ready → /api/ai/creative/generate → Creative Studio → creatives table → Vercel Blob

Step 4: Distribution (F4)
Creatives Ready → /api/deployments → Integration Mesh → External Platforms

Step 5: Analytics Collection
Webhooks ← External Platforms → Integration Mesh → analytics table

Step 6: Optimization Loop (F1, F5)
Cron Job → /api/ai/budget/optimize → AI Optimization Core → Budget Reallocation
```

### Project Structure

```
mcm-app/
├── app/
│   ├── (dashboard)/              # Main app group (PRD Features)
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
│   │   └── integrations/         # Platform APIs
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn/ui (DO NOT MODIFY)
│   └── layout/                   # Header, Sidebar
├── features/                     # 4 Core Modules
│   ├── integration-mesh/         # Platform API connections
│   ├── ai-optimization/          # Budget/Bidding AI
│   ├── creative-studio/          # Gen AI content
│   └── intelligent-targeting/    # Audience AI
├── agents/claude/                # AI Agent prompts
├── lib/
│   ├── db/schema/                # Drizzle schema
│   ├── storage/                  # Vercel Blob
│   └── cache/                    # Vercel KV
├── types/                        # TypeScript types
└── docs/                         # Documentation chain
```

### Database Schema

> **Reference:** PRD "4 Core Modules Mapping"

| Table | Purpose | Module |
|-------|---------|--------|
| `users` | Demo users, Auth | Core |
| `platform_connections` | API credentials per platform | Integration Mesh |
| `campaigns` | Campaign metadata | Core |
| `audiences` | AI-generated personas | Intelligent Targeting |
| `creatives` | Generated creative assets | Creative Studio |
| `deployments` | Ad deployment status per platform | Integration Mesh |
| `analytics` | Performance metrics | AI Optimization |
| `optimization_logs` | AI decision audit trail | AI Optimization |

---

## Consequences

### Positive

| Benefit | Detail | Trade-off |
|---------|--------|-----------|
| **Modular Architecture** | 4 modules can be developed/scaled independently | More files to navigate |
| **Clear Separation** | Frontend ↔ API ↔ Modules ↔ Database | Cross-module calls need coordination |
| **Abstraction Layer** | Platform APIs abstracted in Integration Mesh | Additional complexity |
| **Audit Trail** | optimization_logs table tracks all AI decisions | Storage overhead |
| **Unified Codebase** | Next.js handles frontend + backend | Limited to Node.js ecosystem |

### Negative

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **Monolith** | Can't scale modules independently | Start monolith, extract later if needed |
| **Cold Starts** | Serverless cold start latency | Edge functions for critical paths |
| **API Timeouts** | 30s max for Vercel functions | Background jobs for long tasks |
| **Vendor Lock-in** | Tight Vercel integration | Abstract storage/cache behind interfaces |

### Trade-offs

| Decision | Alternative | Why This Choice |
|----------|-------------|-----------------|
| **Next.js Monolith** | Microservices | Simpler deployment, faster iteration for MVP |
| **PostgreSQL** | MongoDB | Strong consistency needed for financial data (budget) |
| **Vercel** | AWS/GCP | Zero DevOps, Next.js-optimized, Integrated services |
| **Claude API** | GPT-4 | Better reasoning, Thai language support |

---

## References

- **Source Documents:**
  - [`docs/0-BUSINESS-PLAN.md`](./0-BUSINESS-PLAN.md) - 4 Modules definition
  - [`docs/1-PRD.md`](./1-PRD.md) - Features, User Flow
- **Next Document:** [`docs/3-API-REFERENCE.md`](./3-API-REFERENCE.md)
