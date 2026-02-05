# MCM Platform v2 — Overview

## What is v2?

v2 คือการอัพเกรดครั้งใหญ่ของ MCM Platform จาก "Campaign Diagnosis Tool" ไปเป็น **"Cross-Platform AI Command Center"** โดยอ้างอิงจาก Figma export ใน `figma-make-export-v2/`

### Key Upgrades
- **7-Platform Support** — เพิ่ม Shopee และ Lazada (จากเดิม 5 platforms)
- **Business Lifecycle Intelligence** — Audience page มี dual-view: Consumer + Business Insights
- **AI Strategy Fusion** — Creative Studio เปลี่ยนเป็น 3-column layout พร้อม AI predictions
- **AI Confidence Scoring** — Distribution แสดง AI recommendation + confidence %
- **Advanced Visualizations** — Stacked bar chart, stacked area chart, radar chart

---

## Route Mapping (v1 → v2)

| Route | v1 Page Name | v2 Page Name | v2 Component | Change Level |
|-------|-------------|-------------|-------------|:---:|
| `/` | Dashboard (Diagnosis) | Cross-Platform Dashboard | `CrossPlatformDashboard` | **Major** |
| `/audience` | Audience Personas | Unified Audience Insights | `UnifiedAudienceInsights` | **Major** |
| `/creative` | Creative Studio | Strategic Creative Studio | `StrategicCreativeStudio` | **Major** |
| `/distribution` | Distribution Flow | Distribution Flow | `DistributionFlow` | Medium |
| `/results` | Results | Success Dashboard | `SuccessDashboard` | Minor |

v2 เพิ่ม route `/business-insights` ที่ redirect ไป `/audience`

---

## Design System

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#0052CC` | Primary actions, links, active states |
| `--success` | `#00C853` | Positive metrics, growth indicators |
| `--warning` | `#FF9800` | At-risk segments, alerts |
| `--danger` | `#FF5252` | Destructive actions, negative trends |
| `--background` | `#FFFFFF` | Page background |
| `--surface` | `#F4F6F8` | Card backgrounds, secondary areas |
| `--foreground` | `#1A1A1A` | Primary text |
| `--muted-foreground` | `#6B7280` | Secondary text |
| `--border` | `rgba(0,0,0,0.08)` | Borders, dividers |
| `--accent` | `#E8F1FF` | Accent backgrounds |
| `--accent-foreground` | `#0052CC` | Accent text |

### Platform Colors

| Platform | Color | Logo | Status |
|----------|-------|------|--------|
| Meta | `#1877F2` | FB | Existing |
| Google Ads | `#EA4335` | G | Updated (was `#4285F4`) |
| TikTok | `#000000` | TT | Existing |
| LINE LAP | `#00C300` | LN | Updated (was `#00B900`) |
| Lemon8 | `#FFB800` | L8 | Existing |
| **Shopee** | `#EE4D2D` | SH | **NEW** |
| **Lazada** | `#0F146D` | LZ | **NEW** |

### New CSS Variables (v2 adds)

```css
--input-background: #F4F6F8;
--switch-background: #CBD5E1;
--color-success: var(--success);
--color-warning: var(--warning);
```

### Typography
- Base font size: `16px`
- Weight normal: `400`, medium: `500`
- Line height: `1.5`
- Headings use `font-weight: 500`

### Border Radius
- `--radius`: `0.5rem` (8px)
- sm: `4px`, md: `6px`, lg: `8px`, xl: `12px`

### UI Patterns
- **Cards**: White bg, subtle border, rounded corners, shadow on hover
- **Badges/Pills**: `rounded-full`, small text, colored backgrounds
- **Icon + Text**: Lucide React icons ใช้คู่กับ text ทั่วทั้ง app
- **Charts**: Recharts library (line, bar, area, radar, composed)
- **Status Indicators**: Colored dot + text label
- **Hover States**: Shadow elevation + background changes
- **AI Confidence**: Badge with percentage + color coding

---

## Tech Stack (unchanged)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Database | PostgreSQL + Drizzle ORM |
| Styling | Tailwind CSS + shadcn/ui |
| AI | Claude API (Anthropic SDK) |
| Charts | Recharts |
| Icons | Lucide React |
| Hosting | Vercel |

### Dependencies to Add
```
react-dnd + react-dnd-html5-backend  (ถ้า distribution ต้องใช้ drag & drop)
```

### Dependencies to Skip (v2 Figma ใช้แต่เราไม่ต้องการ)
- `@mui/material` → ใช้ shadcn/ui แทน
- `@emotion/react` → ใช้ Tailwind แทน
- `react-router` → ใช้ Next.js App Router

---

## Reference Files

| v2 Figma File | Purpose |
|--------------|---------|
| `figma-make-export-v2/src/app/routes.tsx` | Route structure |
| `figma-make-export-v2/src/styles/theme.css` | Theme/design tokens |
| `figma-make-export-v2/src/app/components/Layout.tsx` | App shell & navigation |
| `figma-make-export-v2/src/app/components/CrossPlatformDashboard.tsx` | Dashboard page |
| `figma-make-export-v2/src/app/components/UnifiedAudienceInsights.tsx` | Audience toggle wrapper |
| `figma-make-export-v2/src/app/components/AudienceDiscovery.tsx` | Consumer personas |
| `figma-make-export-v2/src/app/components/AudienceBusinessInsights.tsx` | Business lifecycle |
| `figma-make-export-v2/src/app/components/StrategicCreativeStudio.tsx` | Creative studio |
| `figma-make-export-v2/src/app/components/DistributionFlow.tsx` | Distribution flow |
| `figma-make-export-v2/src/app/components/SuccessDashboard.tsx` | Success/results page |
| `figma-make-export-v2/src/app/components/figma/ImageWithFallback.tsx` | Image fallback helper |
