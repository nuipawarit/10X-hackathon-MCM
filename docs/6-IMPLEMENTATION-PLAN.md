# MCM Implementation Plan

**Document ID:** IMPL-001
**Version:** 1.0
**Last Updated:** 2026-02-05
**Source:** [`docs/1-PRD.md`](./1-PRD.md), [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md), [`docs/3-API-REFERENCE.md`](./3-API-REFERENCE.md)

---

## Context

> **Reference:** PRD "Core Features (MVP)" และ Architecture "4 Core Modules"

### Purpose

Implementation Plan สำหรับ MCM MVP ที่ครอบคลุม **5 Features** จาก PRD โดยใช้ **4 Core Modules** จาก Architecture:

| Feature (PRD) | Module (Architecture) | Priority |
|---------------|----------------------|----------|
| F1: Dashboard | AI Optimization Core | P0 |
| F2: Audience Discovery | Intelligent Targeting | P0 |
| F3: Creative Studio | Generative Creative Studio | P0 |
| F4: Distribution | Integration Mesh | P1 |
| F5: Results | AI Optimization Core | P0 |

### MVP Scope

> **Reference:** PRD "Success Metrics"

| Metric | Target | Implementation Focus |
|--------|--------|---------------------|
| ROAS Improvement | +50% | F1 + F5 optimization loop |
| CPA Reduction | -30% | F2 audience targeting |
| Time Saved | -80% | F3 creative automation |
| User Activation | 70% | All features integrated |

---

## Decision

### Sprint Overview

> **Reference:** PRD "User Flow", Architecture "Data Flow"

```
Sprint 1: Foundation + Dashboard (F1)
    └── Setup project, Database, Mock data, Dashboard UI

Sprint 2: Audience Discovery (F2)
    └── Intelligent Targeting module, Persona generation

Sprint 3: Creative Studio (F3)
    └── Generative Creative module, Copy generation

Sprint 4: Distribution Flow (F4)
    └── Integration Mesh module, Platform connections

Sprint 5: Results & Optimization (F5)
    └── AI Optimization module, Budget recommendations

Sprint 6: Integration & Polish
    └── Connect all features, Testing, Launch prep
```

---

### Sprint 1: Foundation + Dashboard (F1)

> **Reference:** Architecture "Project Structure", PRD "F1: Campaign Diagnosis Dashboard"

**Goal:** Setup project foundation และ Dashboard ที่แสดง ROAS metrics

#### Tasks

| Task | Description | Files | API Reference |
|------|-------------|-------|---------------|
| 1.1 | Project setup (Next.js 15, Tailwind, shadcn/ui) | `package.json`, config files | - |
| 1.2 | Database schema (Drizzle) | `lib/db/schema/*.ts` | - |
| 1.3 | Seed demo campaigns | `lib/db/seed.ts` | - |
| 1.4 | Dashboard layout + navigation | `app/(dashboard)/layout.tsx` | - |
| 1.5 | Dashboard page with ROAS cards | `app/(dashboard)/page.tsx` | `GET /api/campaigns` |
| 1.6 | Campaign API routes | `app/api/campaigns/route.ts` | `GET/POST /api/campaigns` |
| 1.7 | ROAS trend chart component | `components/charts/roas-trend.tsx` | `GET /api/campaigns/:id` |

#### Database Tables (from Architecture)

```typescript
// lib/db/schema/campaigns.ts
campaigns: {
  id: uuid,
  name: string,
  objective: enum('awareness', 'consideration', 'conversion'),
  status: enum('draft', 'active', 'paused', 'completed'),
  budget: number,
  startDate: date,
  endDate: date,
  userId: uuid
}

// lib/db/schema/analytics.ts
analytics: {
  id: uuid,
  campaignId: uuid,
  impressions: number,
  clicks: number,
  conversions: number,
  spend: number,
  revenue: number,
  date: date
}
```

#### Acceptance Criteria (from PRD F1)

- [ ] แสดง ROAS trend (7/30 days)
- [ ] Alert for declining performance
- [ ] Cross-platform comparison view
- [ ] Dashboard loads < 2s

---

### Sprint 2: Audience Discovery (F2)

> **Reference:** Architecture "Module 4: Intelligent Targeting", PRD "F2: AI Audience Discovery"

**Goal:** AI สร้าง personas พร้อม intent scores

#### Tasks

| Task | Description | Files | API Reference |
|------|-------------|-------|---------------|
| 2.1 | Audience page UI | `app/(dashboard)/audience/page.tsx` | - |
| 2.2 | Persona card component | `components/audience/persona-card.tsx` | - |
| 2.3 | Claude API integration | `lib/ai/claude.ts` | - |
| 2.4 | Audience analysis API | `app/api/ai/audience/analyze/route.ts` | `POST /api/ai/audience/analyze` |
| 2.5 | Get personas API | `app/api/ai/audience/[campaignId]/route.ts` | `GET /api/ai/audience/:campaignId` |
| 2.6 | AI prompt for persona generation | `agents/claude/persona-generator.ts` | - |
| 2.7 | Intent score visualization | `components/audience/intent-score.tsx` | - |

#### Database Tables

```typescript
// lib/db/schema/audiences.ts
audiences: {
  id: uuid,
  campaignId: uuid,
  name: string,
  tagline: string,
  intentScore: number,
  demographics: jsonb,  // ageRange, genderSplit, locations
  psychographics: jsonb, // values, painPoints, motivations
  behaviors: jsonb,      // platforms, purchaseTriggers
  recommendedMessaging: text,
  aiGenerated: boolean,
  createdAt: timestamp
}
```

#### Claude Prompt Structure

```typescript
// agents/claude/persona-generator.ts
const systemPrompt = `
You are an expert audience analyst for digital marketing.
Analyze the campaign data and generate 2-5 detailed personas.

Each persona must include:
- Name and tagline
- Intent score (0-100)
- Demographics: age range, gender split, locations
- Psychographics: values, pain points, motivations
- Behaviors: preferred platforms, purchase triggers
- Recommended messaging approach
`;
```

#### Acceptance Criteria (from PRD F2)

- [ ] Generate 2-5 personas with intent scores > 70%
- [ ] Demographics + Psychographics + Behaviors
- [ ] AI-generated indicator
- [ ] Campaign selection

---

### Sprint 3: Creative Studio (F3)

> **Reference:** Architecture "Module 3: Generative Creative Studio", PRD "F3: Generative Creative Studio"

**Goal:** AI สร้าง ad copy variants สำหรับแต่ละ persona

#### Tasks

| Task | Description | Files | API Reference |
|------|-------------|-------|---------------|
| 3.1 | Creative page UI | `app/(dashboard)/creative/page.tsx` | - |
| 3.2 | Creative generation form | `components/creative/generate-form.tsx` | - |
| 3.3 | Generated variants display | `components/creative/variant-card.tsx` | - |
| 3.4 | Generate creative API | `app/api/ai/creative/generate/route.ts` | `POST /api/ai/creative/generate` |
| 3.5 | Get creative status API | `app/api/ai/creative/[creativeId]/route.ts` | `GET /api/ai/creative/:creativeId` |
| 3.6 | Claude prompt for copy | `agents/claude/creative-generator.ts` | - |
| 3.7 | Blob storage integration | `lib/storage/blob.ts` | - |

#### Database Tables

```typescript
// lib/db/schema/creatives.ts
creatives: {
  id: uuid,
  personaId: uuid,
  type: enum('image', 'video', 'copy'),
  status: enum('generating', 'completed', 'failed'),
  prompt: text,
  variants: jsonb,     // [{headline, body, cta, platform}]
  contentUrl: string,  // Vercel Blob URL
  thumbnailUrl: string,
  createdAt: timestamp
}
```

#### Acceptance Criteria (from PRD F3)

- [ ] Generate creative based on persona
- [ ] Support multiple platforms (TikTok, IG, FB)
- [ ] Hyper-personalization per persona
- [ ] A/B Testing variants (2-3 per platform)

---

### Sprint 4: Distribution Flow (F4)

> **Reference:** Architecture "Module 1: Integration Mesh", PRD "F4: Cross-Platform Distribution"

**Goal:** Visual flow diagram แสดงการ deploy ads ไปยัง platforms

#### Tasks

| Task | Description | Files | API Reference |
|------|-------------|-------|---------------|
| 4.1 | Distribution page UI | `app/(dashboard)/distribution/page.tsx` | - |
| 4.2 | Flow diagram component | `components/distribution/flow-diagram.tsx` | - |
| 4.3 | Platform connection cards | `components/distribution/platform-card.tsx` | - |
| 4.4 | Get integrations API | `app/api/integrations/route.ts` | `GET /api/integrations` |
| 4.5 | Connect platform API | `app/api/integrations/[platform]/connect/route.ts` | `POST /api/integrations/:platform/connect` |
| 4.6 | Create deployment API | `app/api/deployments/route.ts` | `POST /api/deployments` |
| 4.7 | Platform status indicators | `components/distribution/status-badge.tsx` | - |

#### Database Tables

```typescript
// lib/db/schema/platform-connections.ts
platformConnections: {
  id: uuid,
  userId: uuid,
  platform: enum('meta', 'google', 'tiktok', 'line', 'lemon8'),
  accountId: string,
  accessToken: string, // encrypted
  status: enum('active', 'expired', 'not_connected'),
  lastSyncAt: timestamp
}

// lib/db/schema/deployments.ts
deployments: {
  id: uuid,
  campaignId: uuid,
  creativeId: uuid,
  platform: string,
  budget: number,
  status: enum('pending', 'deploying', 'active', 'paused', 'completed'),
  estimatedReach: string,
  externalId: string, // Platform's campaign ID
  createdAt: timestamp
}
```

#### Acceptance Criteria (from PRD F4)

- [ ] Visual flow diagram
- [ ] Budget allocation per platform
- [ ] Platform routing based on audience
- [ ] Connection status indicators

---

### Sprint 5: Results & Optimization (F5)

> **Reference:** Architecture "Module 2: AI Optimization Core", PRD "F5: Performance Results & Optimization"

**Goal:** AI recommendations สำหรับ budget reallocation

#### Tasks

| Task | Description | Files | API Reference |
|------|-------------|-------|---------------|
| 5.1 | Results page UI | `app/(dashboard)/results/page.tsx` | - |
| 5.2 | Optimization recommendation cards | `components/results/recommendation-card.tsx` | - |
| 5.3 | Before/After comparison | `components/results/comparison-view.tsx` | - |
| 5.4 | Optimize budget API | `app/api/ai/budget/optimize/route.ts` | `POST /api/ai/budget/optimize` |
| 5.5 | Apply optimization API | `app/api/ai/budget/apply/route.ts` | `POST /api/ai/budget/apply` |
| 5.6 | Claude prompt for optimization | `agents/claude/budget-optimizer.ts` | - |
| 5.7 | Optimization logs table | `components/results/logs-table.tsx` | - |

#### Database Tables

```typescript
// lib/db/schema/optimization-logs.ts
optimizationLogs: {
  id: uuid,
  campaignId: uuid,
  recommendationId: uuid,
  action: string,
  platform: string,
  previousBudget: number,
  newBudget: number,
  reasoning: text,
  applied: boolean,
  appliedAt: timestamp,
  createdAt: timestamp
}
```

#### Acceptance Criteria (from PRD F5)

- [ ] Show improvement metrics (ROAS, CPA, CTR)
- [ ] Transparent AI reasoning
- [ ] Human Override (Safety Brake)
- [ ] Audit trail in logs

---

### Sprint 6: Integration & Polish

> **Reference:** PRD "User Flow"

**Goal:** เชื่อมต่อทุก features ให้ทำงานร่วมกันเป็น loop

#### Tasks

| Task | Description | Priority |
|------|-------------|----------|
| 6.1 | Dashboard → Audience flow | High |
| 6.2 | Audience → Creative flow | High |
| 6.3 | Creative → Distribution flow | High |
| 6.4 | Distribution → Results flow | High |
| 6.5 | Results → Dashboard loop | High |
| 6.6 | Error handling & edge cases | Medium |
| 6.7 | Loading states & skeletons | Medium |
| 6.8 | Mobile responsive | Medium |
| 6.9 | Performance optimization | Medium |
| 6.10 | E2E testing | Low |

#### Integration Flow (from PRD User Flow)

```
[Dashboard] ────────────────────────────────────────────────────────┐
     │                                                               │
     │ Detect ROAS decline                                          │
     ▼                                                               │
[Audience Discovery] ──── Generate personas ────┐                   │
                                                 │                   │
                                                 ▼                   │
                        [Creative Studio] ── Generate creatives     │
                                                 │                   │
                                                 ▼                   │
                        [Distribution] ────── Deploy to platforms   │
                                                 │                   │
                                                 ▼                   │
                        [Results] ────────── Track & Optimize ──────┘
```

---

## Consequences

### Sprint Dependencies

```
Sprint 1 (Foundation) ─────► Sprint 2 (Audience)
                                    │
                                    ▼
                             Sprint 3 (Creative)
                                    │
                                    ▼
Sprint 4 (Distribution) ◄───────────┘
        │
        ▼
Sprint 5 (Results)
        │
        ▼
Sprint 6 (Integration)
```

### Risk Mitigation

> **Reference:** PRD "Risks & Mitigations"

| Risk | Sprint Impact | Mitigation |
|------|---------------|------------|
| **Trust Gap** | Sprint 5 | Implement transparent logging, Safety Brake UI |
| **API Rate Limits** | Sprint 2, 3, 5 | Implement caching, queue system |
| **AI Hallucination** | Sprint 2, 3 | Human review layer, validation |
| **Platform API Changes** | Sprint 4 | Abstraction layer in Integration Mesh |

### Definition of Done

| Criteria | Applies To |
|----------|------------|
| Feature matches PRD acceptance criteria | All sprints |
| API matches API Reference spec | Sprint 1-5 |
| Database matches Architecture schema | Sprint 1-5 |
| No TypeScript errors | All |
| Mobile responsive | Sprint 6 |
| Loading states implemented | Sprint 6 |

### Success Metrics Verification

> **Reference:** PRD "Success Metrics"

| Metric | Target | Verification Method | Sprint |
|--------|--------|---------------------|--------|
| ROAS Improvement | +50% | Before/After in Results page | 5 |
| CPA Reduction | -30% | Dashboard metrics comparison | 1, 5 |
| Time Saved | -80% | Automated vs manual task tracking | 2, 3 |
| User Activation | 70% | Complete campaign within 7 days | 6 |

---

## References

- **Source Documents:**
  - [`docs/1-PRD.md`](./1-PRD.md) - Features, User Stories, Success Metrics
  - [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md) - Modules, Data Flow, Database Schema
  - [`docs/3-API-REFERENCE.md`](./3-API-REFERENCE.md) - API Endpoints, Request/Response
  - [`docs/4-SETUP-GUIDE.md`](./4-SETUP-GUIDE.md) - Development Environment
  - [`docs/5-INFRASTRUCTURE.md`](./5-INFRASTRUCTURE.md) - Deployment, Services
- **Chain Complete:** Business Plan → PRD → Architecture → API → Setup → Infrastructure → **Implementation Plan**
