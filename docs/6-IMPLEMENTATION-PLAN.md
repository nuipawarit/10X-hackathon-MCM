# MCM Implementation Plan

**Document ID:** IMPL-002
**Version:** 2.0
**Last Updated:** 2026-02-05
**Source:** [`docs/1-PRD.md`](./1-PRD.md), [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md), [`docs/3-API-REFERENCE.md`](./3-API-REFERENCE.md)

---

## Overview

6 Sprints ตาม PRD features โดยใช้ UI จาก `figma-make-export/` เป็น reference

| Sprint | Feature | Figma Source | Priority |
|--------|---------|-------------|----------|
| 1 | Foundation + Dashboard (F1) | `Dashboard.tsx`, `Layout.tsx` | P0 |
| 2 | Audience Discovery (F2) | `AudienceDiscovery.tsx` | P0 |
| 3 | Creative Studio (F3) | `CreativeStudio.tsx` | P0 |
| 4 | Distribution (F4) | `DistributionFlow.tsx` | P1 |
| 5 | Results & Optimization (F5) | `SuccessDashboard.tsx` | P0 |
| 6 | Integration & Polish | All pages | - |

---

## Sprint 1: Foundation + Dashboard (F1)

**Goal:** Project foundation + Dashboard แสดง ROAS metrics

| Task | Files | API |
|------|-------|-----|
| Database schema (8 tables) | `lib/db/schema/*.ts` | - |
| DB connection | `lib/db/index.ts` | - |
| Types + Zod validations | `types/index.ts`, `lib/validations/schemas.ts` | - |
| Layout + Navigation | `components/layout/header.tsx`, `app/(dashboard)/layout.tsx` | - |
| Dashboard page | `app/(dashboard)/page.tsx` | `GET /api/campaigns` |
| Alert banner | `components/dashboard/alert-banner.tsx` | - |
| ROAS chart | `components/dashboard/roas-chart.tsx` | `GET /api/campaigns/:id` |
| Performance table | `components/dashboard/performance-table.tsx` | - |
| Campaign API | `app/api/campaigns/route.ts`, `app/api/campaigns/[id]/route.ts` | GET, POST |
| Seed data | `lib/db/seed.ts` | - |

**Acceptance Criteria (PRD F1):**
- [ ] ROAS trend (7 days) with LineChart
- [ ] Alert for declining performance (-47% ROAS)
- [ ] Cross-platform creative comparison table
- [ ] Dashboard loads < 2s

---

## Sprint 2: Audience Discovery (F2)

**Goal:** AI persona generation with intent scoring

| Task | Files | API |
|------|-------|-----|
| Claude `analyzeAudience()` | `lib/ai/claude.ts` | - |
| Agent prompt | `agents/claude/audience-researcher.md` | - |
| Feature module | `features/intelligent-targeting/*.ts` | - |
| Audience API | `app/api/ai/audience/analyze/route.ts` | POST |
| Get personas API | `app/api/ai/audience/[campaignId]/route.ts` | GET |
| Persona cards | `components/audience/persona-card.tsx` | - |
| Transformation visual | `components/audience/transformation-visual.tsx` | - |
| Audience page | `app/(dashboard)/audience/page.tsx` | - |

**Acceptance Criteria (PRD F2):**
- [ ] Generate 2-5 personas with intent > 70%
- [ ] Demographics + Psychographics + Behaviors
- [ ] AI-generated indicator
- [ ] Intent score progress bar

---

## Sprint 3: Creative Studio (F3)

**Goal:** AI-generated ad variants per persona

| Task | Files | API |
|------|-------|-----|
| Claude `generateCreative()` | `lib/ai/claude.ts` | - |
| Agent prompt | `agents/claude/creative-director.md` | - |
| Feature module | `features/creative-studio/*.ts` | - |
| Blob storage | `lib/storage/blob.ts` | - |
| Generate API | `app/api/ai/creative/generate/route.ts` | POST |
| Get creative API | `app/api/ai/creative/[creativeId]/route.ts` | GET |
| Creative group cards | `components/creative/creative-group.tsx` | - |
| Image gallery | `components/creative/image-gallery.tsx` | - |
| Refine prompt | `components/creative/refine-prompt.tsx` | - |
| Creative page | `app/(dashboard)/creative/page.tsx` | - |

**Acceptance Criteria (PRD F3):**
- [ ] Generate creatives based on persona
- [ ] Dark-themed creative group cards
- [ ] 3-column image gallery with hover
- [ ] Refine prompt input

---

## Sprint 4: Distribution (F4)

**Goal:** Visual flow diagram + multi-platform deployment

| Task | Files | API |
|------|-------|-----|
| Feature module | `features/integration-mesh/*.ts` | - |
| Integrations API | `app/api/integrations/route.ts` | GET |
| Connect API | `app/api/integrations/[platform]/connect/route.ts` | POST |
| Deployments API | `app/api/deployments/route.ts` | POST |
| Ad set cards | `components/distribution/ad-set-card.tsx` | - |
| Platform cards | `components/distribution/platform-card.tsx` | - |
| SVG flow connectors | `components/distribution/flow-connectors.tsx` | - |
| Summary stats | `components/distribution/summary-stats.tsx` | - |
| Distribution page | `app/(dashboard)/distribution/page.tsx` | - |

**Acceptance Criteria (PRD F4):**
- [ ] 3-column flow: Ad Sets → SVG Routes → Platforms
- [ ] Budget allocation per platform
- [ ] Platform reach estimates
- [ ] Summary stats (ad sets, platforms, reach, budget)

---

## Sprint 5: Results & Optimization (F5)

**Goal:** AI budget recommendations + safety brake

| Task | Files | API |
|------|-------|-----|
| Claude `optimizeBudget()` | `lib/ai/claude.ts` | - |
| Agent prompt | `agents/claude/budget-optimizer.md` | - |
| Feature module | `features/ai-optimization/*.ts` | - |
| Optimize API | `app/api/ai/budget/optimize/route.ts` | POST |
| Apply API | `app/api/ai/budget/apply/route.ts` | POST |
| Success banner | `components/results/success-banner.tsx` | - |
| Metrics grid | `components/results/metrics-grid.tsx` | - |
| ROAS trend chart | `components/results/roas-trend-chart.tsx` | - |
| Insights list | `components/results/insights-list.tsx` | - |
| Results page | `app/(dashboard)/results/page.tsx` | - |

**Acceptance Criteria (PRD F5):**
- [ ] Metrics: CPA -40%, Conv +2.5x, ROAS +164%, CTR +180%
- [ ] ROAS trend chart (6 weeks)
- [ ] AI insights with impact badges
- [ ] Transparent reasoning

---

## Sprint 6: Integration & Polish

**Goal:** Connect all features into continuous loop

| Task | Priority |
|------|----------|
| Dashboard → Audience flow (campaignId param) | High |
| Audience → Creative flow (personaId param) | High |
| Creative → Distribution flow (creativeIds param) | High |
| Distribution → Results flow (campaignId param) | High |
| Results → Dashboard loop | High |
| KV caching (`lib/cache/kv.ts`) | Medium |
| Error boundary (`app/(dashboard)/error.tsx`) | Medium |
| Loading states (shadcn Skeleton) | Medium |
| Mobile responsive | Medium |

---

## Sprint Dependencies

```
Sprint 1 (Foundation) → Sprint 2 (Audience) → Sprint 3 (Creative)
                                                      ↓
                         Sprint 5 (Results) ← Sprint 4 (Distribution)
                                                      ↓
                                              Sprint 6 (Polish)
```

---

## References

- [`docs/1-PRD.md`](./1-PRD.md) - Features, Acceptance Criteria
- [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md) - Schema, Modules
- [`docs/3-API-REFERENCE.md`](./3-API-REFERENCE.md) - API Endpoints
- `figma-make-export/` - UI Design Reference
