# MCM v2 — Migration Plan

---

## Implementation Order

### Phase 1: Foundation

**ทำก่อนเพราะทุก page ต้องใช้**

| Step | Task | Files |
|------|------|-------|
| 1.1 | เพิ่ม Shopee/Lazada + อัพเดต colors ใน constants | `lib/db/constants.ts` |
| 1.2 | Schema migration — audiences (lifecycle fields) | `lib/db/schema/audiences.ts` |
| 1.3 | Schema migration — creatives (AI context fields) | `lib/db/schema/creatives.ts` |
| 1.4 | Schema migration — deployments (AI recommendation fields) | `lib/db/schema/deployments.ts` |
| 1.5 | Run `npx drizzle-kit generate` + `npx drizzle-kit push` | — |
| 1.6 | Update seed data with all new fields | `lib/db/seed.ts` |
| 1.7 | Update theme CSS variables | `app/globals.css` or equivalent |
| 1.8 | Test: `/api/db/reset` seeds successfully | — |

### Phase 2: Dashboard `/`

| Step | Task | Files |
|------|------|-------|
| 2.1 | สร้าง query: `getCrossPlatformKPIs`, `getDailyPlatformBreakdown` | `lib/db/queries.ts` |
| 2.2 | สร้าง `kpi-cards.tsx` | `components/dashboard/kpi-cards.tsx` |
| 2.3 | สร้าง `multi-platform-chart.tsx` (ComposedChart) | `components/dashboard/multi-platform-chart.tsx` |
| 2.4 | สร้าง `platform-toggle.tsx` | `components/dashboard/platform-toggle.tsx` |
| 2.5 | อัพเดต `performance-table.tsx` (7 platforms) | `components/dashboard/performance-table.tsx` |
| 2.6 | Rewrite `page.tsx` | `app/(dashboard)/page.tsx` |
| 2.7 | ลบ `roas-chart.tsx` | `components/dashboard/roas-chart.tsx` |
| 2.8 | Test: Dashboard แสดง KPI, chart, table, toggle ถูกต้อง | — |

### Phase 3: Audience `/audience`

| Step | Task | Files |
|------|------|-------|
| 3.1 | สร้าง query: `getLifecycleSegments`, `getSegmentGrowthTrend`, `getAIvsManualComparison` | `lib/db/queries.ts` |
| 3.2 | สร้าง `view-toggle.tsx` | `components/audience/view-toggle.tsx` |
| 3.3 | สร้าง `lifecycle-cards.tsx` | `components/audience/lifecycle-cards.tsx` |
| 3.4 | สร้าง `segment-growth-chart.tsx` (AreaChart) | `components/audience/segment-growth-chart.tsx` |
| 3.5 | สร้าง `radar-comparison.tsx` (RadarChart) | `components/audience/radar-comparison.tsx` |
| 3.6 | สร้าง `segment-actions.tsx` | `components/audience/segment-actions.tsx` |
| 3.7 | อัพเดต `persona-card.tsx` | `components/audience/persona-card.tsx` |
| 3.8 | Rewrite `page.tsx` | `app/(dashboard)/audience/page.tsx` |
| 3.9 | Test: Toggle Consumer/Business, charts render, persona cards display | — |

### Phase 4: Creative `/creative`

| Step | Task | Files |
|------|------|-------|
| 4.1 | สร้าง query: `getAIStrategySuggestion`, `getCreativePrediction` | `lib/db/queries.ts` |
| 4.2 | สร้าง `goal-selector.tsx` | `components/creative/goal-selector.tsx` |
| 4.3 | สร้าง `persona-selector.tsx` | `components/creative/persona-selector.tsx` |
| 4.4 | สร้าง `ai-fusion-box.tsx` | `components/creative/ai-fusion-box.tsx` |
| 4.5 | สร้าง `strategy-sidebar.tsx` (wraps 4.2-4.4) | `components/creative/strategy-sidebar.tsx` |
| 4.6 | สร้าง `asset-canvas.tsx` | `components/creative/asset-canvas.tsx` |
| 4.7 | สร้าง `prediction-sidebar.tsx` | `components/creative/prediction-sidebar.tsx` |
| 4.8 | Rewrite `page.tsx` (3-column layout) | `app/(dashboard)/creative/page.tsx` |
| 4.9 | ลบ `prompt-input.tsx` | `components/creative/prompt-input.tsx` |
| 4.10 | Test: Goal/Persona selection, AI fusion updates, predictions display | — |

### Phase 5: Distribution `/distribution`

| Step | Task | Files |
|------|------|-------|
| 5.1 | สร้าง query: `getAIPlatformRecommendation` | `lib/db/queries.ts` |
| 5.2 | สร้าง `ai-recommendation.tsx` | `components/distribution/ai-recommendation.tsx` |
| 5.3 | สร้าง `platform-grid.tsx` | `components/distribution/platform-grid.tsx` |
| 5.4 | สร้าง `confidence-badge.tsx` | `components/distribution/confidence-badge.tsx` |
| 5.5 | Rewrite `page.tsx` | `app/(dashboard)/distribution/page.tsx` |
| 5.6 | Test: AI recommendations show, platform grid interactive, confidence badges display | — |

### Phase 6: Results `/results`

| Step | Task | Files |
|------|------|-------|
| 6.1 | อัพเดต `page.tsx` — enhanced banner, metadata, improvement badges | `app/(dashboard)/results/page.tsx` |
| 6.2 | Minor styling updates to results chart | `components/results/results-roas-chart.tsx` |
| 6.3 | Test: Success banner, KPI improvements, chart, insights display | — |

### Phase 7: New API Routes

| Step | Task | Files |
|------|------|-------|
| 7.1 | Cross-platform analytics endpoint | `app/api/analytics/cross-platform/route.ts` |
| 7.2 | Lifecycle segmentation endpoint | `app/api/ai/audience/lifecycle/route.ts` |
| 7.3 | Strategy fusion endpoint | `app/api/ai/creative/strategy-fusion/route.ts` |
| 7.4 | Creative prediction endpoint | `app/api/ai/creative/predict/route.ts` |
| 7.5 | Platform recommendation endpoint | `app/api/ai/distribution/recommend/route.ts` |
| 7.6 | Update AI functions | `lib/ai/claude.ts` |
| 7.7 | Test: All endpoints return expected data | — |

---

## Dependencies

### Install (if needed)
```bash
npm install react-dnd react-dnd-html5-backend
```

### Do NOT Install (ใช้ alternative ที่มี)
- `@mui/material` → shadcn/ui
- `@emotion/*` → Tailwind CSS
- `react-router` → Next.js App Router

---

## Verification Checklist

### Build
- [ ] `npm run build` สำเร็จ
- [ ] ไม่มี TypeScript errors
- [ ] ไม่มี ESLint warnings

### Database
- [ ] `npx drizzle-kit push` สำเร็จ
- [ ] `/api/db/reset` seed data ใหม่สำเร็จ
- [ ] Schema มี fields ใหม่ทั้งหมด

### Dashboard `/`
- [ ] 4 KPI cards แสดงถูกต้อง
- [ ] Stacked bar chart แสดง 7 platforms
- [ ] ROAS line overlay แสดงบน chart
- [ ] Platform toggle filter ทำงาน (เลือก/ปิด platform)
- [ ] Performance table แสดง 7 platforms
- [ ] Alert banner แสดง

### Audience `/audience`
- [ ] Consumer/Business toggle ทำงาน
- [ ] Consumer view: transformation visual + persona cards
- [ ] Business view: 4 lifecycle cards
- [ ] Business view: stacked area chart (6 months)
- [ ] Business view: radar chart (AI vs Manual)
- [ ] Business view: segment recommendations
- [ ] Navigate ไป Creative ได้

### Creative `/creative`
- [ ] 3-column layout แสดงถูกต้อง
- [ ] Goal dropdown มี 4 options
- [ ] Persona dropdown มี 4 options
- [ ] AI Strategy Fusion อัพเดตตาม goal+persona
- [ ] Context stats แสดง
- [ ] 2 creative cards แสดงใน canvas
- [ ] Regenerate button ทำงาน
- [ ] Prediction sidebar แสดง conversion rate + reasoning
- [ ] Navigate ไป Distribution ได้

### Distribution `/distribution`
- [ ] Ad set cards แสดง
- [ ] AI recommendation + confidence score แสดง per ad set
- [ ] Platform grid interactive (select/deselect)
- [ ] AI Suggested vs Custom badge ถูกต้อง
- [ ] Reset to AI button ทำงาน
- [ ] Summary stats แสดง
- [ ] Launch Campaign → navigate ไป Results

### Results `/results`
- [ ] Success banner with metadata
- [ ] 4 KPI cards with improvement percentages
- [ ] ROAS trend chart (6 weeks)
- [ ] Key insights section
- [ ] CTAs ทำงาน (View Report, Create New)

### Responsive
- [ ] ทุกหน้า responsive บน tablet
- [ ] Creative 3-column ย่อเป็น stack บน mobile
- [ ] Charts อ่านได้บน mobile

---

## Risk Areas

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Schema migration breaks v1 data | High | ทุก field ใหม่เป็น nullable |
| ComposedChart complex | Medium | Reference v2 Figma code ตรงๆ |
| RadarChart unfamiliar | Medium | Recharts RadarChart มี docs ดี |
| 3-column layout responsive | Medium | ใช้ CSS grid + collapse บน mobile |
| AI Strategy Fusion logic | Low | 16 combinations — hardcode ก่อน, AI ทีหลัง |
| Seed data volume | Low | เพิ่มทีละ phase, test `/api/db/reset` ทุก phase |
