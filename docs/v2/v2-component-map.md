# MCM v2 — Component Map

---

## New Components (17)

### Dashboard Module

| Component | Path | Purpose | v2 Reference |
|-----------|------|---------|-------------|
| KPI Cards | `components/dashboard/kpi-cards.tsx` | 4 metric summary cards (Spend, Revenue, ROAS, Conversions) | `CrossPlatformDashboard.tsx` lines with kpiData |
| Multi-Platform Chart | `components/dashboard/multi-platform-chart.tsx` | Recharts ComposedChart — stacked bar (spend per platform) + line (ROAS) | `CrossPlatformDashboard.tsx` ComposedChart section |
| Platform Toggle | `components/dashboard/platform-toggle.tsx` | Toggle buttons สำหรับ filter platforms (7 ปุ่ม) | `CrossPlatformDashboard.tsx` platform toggle section |

### Audience Module

| Component | Path | Purpose | v2 Reference |
|-----------|------|---------|-------------|
| View Toggle | `components/audience/view-toggle.tsx` | Switch between Consumer/Business views | `UnifiedAudienceInsights.tsx` |
| Lifecycle Cards | `components/audience/lifecycle-cards.tsx` | 4 lifecycle stage cards (New, Active, VIP, At-Risk) | `AudienceBusinessInsights.tsx` lifecycle section |
| Segment Growth Chart | `components/audience/segment-growth-chart.tsx` | Recharts stacked AreaChart — 6 months segment growth | `AudienceBusinessInsights.tsx` AreaChart section |
| Radar Comparison | `components/audience/radar-comparison.tsx` | Recharts RadarChart — AI vs Manual targeting scores | `AudienceBusinessInsights.tsx` RadarChart section |
| Segment Actions | `components/audience/segment-actions.tsx` | Per-segment recommendation cards with CTAs | `AudienceBusinessInsights.tsx` recommendations section |

### Creative Module

| Component | Path | Purpose | v2 Reference |
|-----------|------|---------|-------------|
| Strategy Sidebar | `components/creative/strategy-sidebar.tsx` | Left sidebar — wraps goal selector, persona selector, AI fusion, context stats | `StrategicCreativeStudio.tsx` left panel |
| Goal Selector | `components/creative/goal-selector.tsx` | Dropdown for business goal (VIP/New/Returning/At-Risk) | `StrategicCreativeStudio.tsx` goalOptions |
| Persona Selector | `components/creative/persona-selector.tsx` | Dropdown for target persona (Geeks/Minimalist/Luxury/Eco) | `StrategicCreativeStudio.tsx` personaOptions |
| AI Fusion Box | `components/creative/ai-fusion-box.tsx` | Dynamic AI strategy suggestion based on goal+persona | `StrategicCreativeStudio.tsx` getAISuggestion() |
| Asset Canvas | `components/creative/asset-canvas.tsx` | Center — 2 creative cards with regenerate button | `StrategicCreativeStudio.tsx` center panel |
| Prediction Sidebar | `components/creative/prediction-sidebar.tsx` | Right sidebar — conversion prediction, reasoning, impact metrics | `StrategicCreativeStudio.tsx` right panel |

### Distribution Module

| Component | Path | Purpose | v2 Reference |
|-----------|------|---------|-------------|
| AI Recommendation | `components/distribution/ai-recommendation.tsx` | AI suggestion card per ad set with confidence score | `DistributionFlow.tsx` AI suggestion section |
| Platform Grid | `components/distribution/platform-grid.tsx` | Platform selector grid with AI suggested vs custom states | `DistributionFlow.tsx` platform selection grid |
| Confidence Badge | `components/distribution/confidence-badge.tsx` | Badge showing confidence % with color coding | `DistributionFlow.tsx` confidence display |

---

## Updated Components (6)

| Component | Path | Changes |
|-----------|------|---------|
| Alert Banner | `components/dashboard/alert-banner.tsx` | Styling ปรับตาม v2 theme |
| Performance Table | `components/dashboard/performance-table.tsx` | เพิ่ม 7-platform support, platform filtering, new columns (CPC, CPA, ROAS) |
| Persona Card | `components/audience/persona-card.tsx` | Enhanced design — ปรับ card layout, icon styling |
| Transformation Visual | `components/audience/transformation-visual.tsx` | ปรับสำหรับ consumer view ใน dual-view layout |
| Icon Resolver | `components/shared/icon-resolver.tsx` | เพิ่ม lifecycle icons: UserPlus, Repeat, Crown, AlertTriangle |
| Constants | `lib/db/constants.ts` | เพิ่ม Shopee/Lazada, อัพเดต Google/LINE colors |

---

## Deleted Components (2)

| Component | Path | Replaced By |
|-----------|------|-------------|
| ROAS Chart | `components/dashboard/roas-chart.tsx` | `components/dashboard/multi-platform-chart.tsx` |
| Prompt Input | `components/creative/prompt-input.tsx` | `components/creative/strategy-sidebar.tsx` |

---

## Page Files to Rewrite (5)

| Page | Path | Scope |
|------|------|-------|
| Dashboard | `app/(dashboard)/page.tsx` | Major rewrite — KPI cards + multi-platform chart + toggles |
| Audience | `app/(dashboard)/audience/page.tsx` | Major rewrite — dual-view wrapper + new components |
| Creative | `app/(dashboard)/creative/page.tsx` | Major rewrite — 3-column layout |
| Distribution | `app/(dashboard)/distribution/page.tsx` | Medium rewrite — AI recommendations + grid |
| Results | `app/(dashboard)/results/page.tsx` | Minor update — enhanced styling + metadata |

---

## Unchanged Components

| Component | Path | Notes |
|-----------|------|-------|
| Header | `components/layout/header.tsx` | Navigation structure เหมือนเดิม (5 nav items) |
| Reset Footer | `components/layout/reset-footer.tsx` | ยังต้องมี demo reset functionality |
| Layout | `app/(dashboard)/layout.tsx` | Keep structure: Header + main + ResetFooter |
| Results ROAS Chart | `components/results/results-roas-chart.tsx` | Minor styling tweaks only |

---

## v2 Figma Component → Next.js Component Mapping

| v2 Figma Component | Next.js Target | Notes |
|-------------------|---------------|-------|
| `Layout.tsx` | `app/(dashboard)/layout.tsx` + `components/layout/header.tsx` | Already split in v1 |
| `CrossPlatformDashboard.tsx` | `app/(dashboard)/page.tsx` + dashboard components | Split into page + components |
| `UnifiedAudienceInsights.tsx` | `app/(dashboard)/audience/page.tsx` + view-toggle | Wrapper with toggle |
| `AudienceDiscovery.tsx` | Existing persona-card + transformation-visual | Reuse + enhance |
| `AudienceBusinessInsights.tsx` | New lifecycle/segment components | All new |
| `StrategicCreativeStudio.tsx` | `app/(dashboard)/creative/page.tsx` + creative components | Split into 3 sidebars |
| `DistributionFlow.tsx` | `app/(dashboard)/distribution/page.tsx` + distribution components | Enhanced with AI |
| `SuccessDashboard.tsx` | `app/(dashboard)/results/page.tsx` | Minor updates |
| `ImageWithFallback.tsx` | `components/shared/image-with-fallback.tsx` | Utility component (ถ้าต้องใช้) |

---

## Data Flow per Page

### Dashboard
```
page.tsx
  → getCrossPlatformKPIs() → KPI Cards
  → getDailyPlatformBreakdown() → Multi-Platform Chart
  → getDeploymentPerformance() → Performance Table
  → getAlertInfo() → Alert Banner
  [state: activePlatforms] → Platform Toggle (filters chart + table)
```

### Audience
```
page.tsx
  [state: viewMode] → View Toggle

  Consumer view:
    → getCampaignPersonas(segmentType='consumer') → Transformation Visual + Persona Cards

  Business view:
    → getLifecycleSegments() → Lifecycle Cards
    → getSegmentGrowthTrend() → Segment Growth Chart
    → getAIvsManualComparison() → Radar Comparison
    → (static) → Segment Actions
```

### Creative
```
page.tsx
  [state: selectedGoal, selectedPersona]

  Left Sidebar:
    → Goal Selector → selectedGoal
    → Persona Selector → selectedPersona
    → getAIStrategySuggestion(goal, persona) → AI Fusion Box + Context Stats

  Center:
    → getCampaignCreatives(goal, persona) → Asset Canvas
    → [action: regenerate] → POST /api/ai/creative/generate

  Right Sidebar:
    → getCreativePrediction(creativeId) → Prediction Sidebar
```

### Distribution
```
page.tsx
  → getCampaignDistribution() → Ad Set Cards
  → getAIPlatformRecommendation(deploymentId) → AI Recommendation per ad set
  [state: selections per ad set] → Platform Grid
  [derived: isAISuggested vs custom] → Confidence Badge + Selection Tracking
```

### Results
```
page.tsx
  → getCampaignResults() → KPI Cards + ROAS Chart + Insights
  (mostly same as v1, enhanced display)
```
