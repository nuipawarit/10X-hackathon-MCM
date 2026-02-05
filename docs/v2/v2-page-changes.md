# MCM v2 — Page-by-Page Changes

---

## 1. Dashboard `/` — CrossPlatformDashboard

**Reference:** `figma-make-export-v2/src/app/components/CrossPlatformDashboard.tsx`

### v1 (ปัจจุบัน)
- AlertBanner สำหรับ creative fatigue warning
- RoasChart — Line chart แสดง ROAS trend (declining)
- PerformanceTable — ตารางแสดง creative performance

### v2 (ใหม่)

#### 4 KPI Summary Cards (ด้านบน)
| Card | Value Example | Icon |
|------|--------------|------|
| Total Spend | ฿847,320 | DollarSign |
| Revenue | ฿2,541,960 | TrendingUp |
| Overall ROAS | 3.0x | Target |
| Conversions | 12,847 | Users |

แต่ละ card แสดง: value, % change vs previous period, trend arrow

#### Stacked Bar + Line Chart (Recharts ComposedChart)
- **Bar**: Daily spend breakdown ของแต่ละ platform (stacked)
- **Line**: ROAS overlay line
- แสดง 7 days of data
- สี bar ตาม platform color

#### Platform Toggle Filters
- ปุ่ม toggle สำหรับแต่ละ platform (7 ปุ่ม)
- Active/inactive state — filter ทั้ง chart และ table
- Default: ทุก platform active

#### Performance Table (Enhanced)
| Column | Description |
|--------|------------|
| Platform | Icon + name |
| Spend | Currency format |
| Impressions | Number format |
| Clicks | Number format |
| CTR | Percentage |
| CPC | Currency |
| Conversions | Number |
| CPA | Currency |
| ROAS | Multiplier (e.g., 3.8x) |

#### Alert Banner
- คงเดิม — creative fatigue detection
- ปรับ styling ให้ตรง v2 theme

---

## 2. Audience `/audience` — UnifiedAudienceInsights

**Reference:**
- `figma-make-export-v2/src/app/components/UnifiedAudienceInsights.tsx`
- `figma-make-export-v2/src/app/components/AudienceDiscovery.tsx`
- `figma-make-export-v2/src/app/components/AudienceBusinessInsights.tsx`

### View Toggle
ปุ่มสลับระหว่าง 2 views:
- **Consumer Insights** (Behavioral) — default view
- **Business Insights** (Lifecycle)

### Consumer Insights View (AudienceDiscovery)

คล้าย v1 แต่ปรับ UI:
- Transformation visual: "1 Broad Audience" → "2 AI-Discovered Personas"
- Persona cards with:
  - Icon + colored background
  - Tags (e.g., "Ingredient-Obsessed", "Anti-Pollution")
  - Purchase Intent score bar (0-100)
  - Demographics, interests, description
- ปุ่ม "Continue to Creative Studio" ที่ navigate ไป `/creative`

### Business Insights View (AudienceBusinessInsights) — **NEW**

#### 4 Lifecycle Stage Cards
| Stage | Label | Color | Icon |
|-------|-------|-------|------|
| New Customers | Low CAC | Green `#00C853` | UserPlus |
| Active/Returning | High Engagement | Blue `#0052CC` | Repeat |
| Top Spenders/VIP | High LTV | Purple `#9C27B0` | Crown |
| At-Risk/Drop-off | Needs Attention | Orange `#FF9800` | AlertTriangle |

แต่ละ card แสดง: customer count, avg order value, % of revenue

#### Stacked Area Chart — Segment Growth
- แกน X: 6 months (Jan-Jun)
- แกน Y: customer count
- 4 areas stacked: New, Active, VIP, At-Risk
- สี match lifecycle stage colors

#### Radar Chart — AI vs Manual Comparison
6 metrics:
- Precision, Reach, Cost Efficiency, Speed, Scalability, Relevance
- 2 lines: AI Discovery (blue) vs Manual Targeting (gray)
- แสดง % improvement ที่ AI ชนะ

#### Actionable Recommendations
Per-segment cards with:
- Segment name + icon
- Recommended action (e.g., "Launch welcome series")
- Campaign strategy suggestion
- CTA button

#### Upgrade to Pro CTA
- Banner ด้านล่าง — "Unlock Advanced Segmentation"

---

## 3. Creative `/creative` — StrategicCreativeStudio

**Reference:** `figma-make-export-v2/src/app/components/StrategicCreativeStudio.tsx`

### v1
- Single column layout
- Creatives grouped by persona
- Prompt input at bottom
- Basic variant display

### v2 — 3-Column Layout

#### Left Sidebar: Campaign Context

**Business Goal Selector (dropdown)**
| Goal ID | Label | Stage | Color |
|---------|-------|-------|-------|
| vip | VIP Retention & Upsell | Retain & Grow | Purple `#9C27B0` |
| new | New Customer Acquisition | Attract | Green `#00C853` |
| returning | Active Returning Boost | Engage | Blue `#0052CC` |
| atrisk | At-Risk Recovery | Win-Back | Orange `#FF9800` |

**Target Persona Selector (dropdown)**
| Persona ID | Label | Subtitle |
|-----------|-------|----------|
| geeks | The Skincare Geeks | Science-focused |
| minimalist | Clean Minimalist | Simple routine |
| luxury | Luxury Seekers | Premium products |
| eco | Eco Conscious | Sustainable beauty |

**AI Strategy Fusion Box**
- แสดง dynamic insight based on goal + persona combination
- ตัวอย่าง: goal=VIP + persona=Geeks → "VIP geeks respond to exclusive early-access..."
- มี strategy combinations ทั้งหมด 16 แบบ (4 goals × 4 personas)

**Context Stats Card**
| Metric | Example |
|--------|---------|
| Segment Size | 2,400 customers |
| Avg. Order Value | ฿4,250 |
| Purchase Frequency | 3.2x/month |

#### Center: Creative Canvas

- 2 generated creative asset cards
- แต่ละ card มี:
  - Image (Unsplash with fallback)
  - Title + description
  - Platform badge (e.g., "Instagram Story", "TikTok Feed")
- **Regenerate** button with loading animation (spinning icon + text change)

#### Right Sidebar: Performance Predictions

**Predicted Conversion Rate**
- Large number display (e.g., "4.8%")
- Comparison vs average (e.g., "+2.1% vs category avg")

**AI Reasoning**
- Text explanation of why this creative should perform well
- Dynamic based on goal + persona selection

**Expected Impact**
| Metric | Prediction |
|--------|-----------|
| Click-Through Rate | 3.2% (estimated) |
| CPA Improvement | -35% vs current |
| Expected ROAS | 4.5x |

**Push to Ad Manager**
- CTA button → navigate to `/distribution`

---

## 4. Distribution `/distribution` — DistributionFlow

**Reference:** `figma-make-export-v2/src/app/components/DistributionFlow.tsx`

### v1
- Visual routing with SVG connection paths
- Static platform cards
- Basic budget display

### v2

#### Ad Set Cards (Enhanced)
แต่ละ ad set แสดง:
- Name + persona association
- Number of creatives
- Budget
- AI recommendation section

#### AI Platform Recommendation
Per ad set:
- **Confidence Score**: 88-92% badge
- **Reason**: Text explanation (e.g., "High engagement from tech-savvy users on TikTok")
- **Recommended Platforms**: highlighted in grid

#### Platform Selection Grid
- Grid ของ platforms (TikTok, Lemon8, Instagram, Facebook, etc.)
- Visual states:
  - **AI Suggested + Selected** — primary color border
  - **AI Suggested + Not Selected** — dashed border
  - **Custom Selected** — secondary style
  - **Not Selected** — gray/muted
- Toggle on/off per platform per ad set

#### Selection Tracking
- Badge: "AI Suggested" (blue) vs "Custom Selection" (orange)
- "Reset to AI Suggestion" button เมื่อ user override
- Track deviation percentage

#### Summary Footer
| Metric | Example |
|--------|---------|
| Ad Sets | 2 |
| Active Platforms | 4 |
| Est. Total Reach | 2.8M |
| Total Budget | ฿180,000 |

- **Launch Campaign** button → navigate to `/success`

---

## 5. Results `/results` — SuccessDashboard

**Reference:** `figma-make-export-v2/src/app/components/SuccessDashboard.tsx`

### Changes from v1

#### Success Banner (Enhanced)
- Campaign name: "Summer Skincare Launch"
- Metadata dots: Campaign period, platforms used, segments targeted
- Gradient background (green tones)

#### 4 KPI Improvement Cards
| Metric | Value | Improvement |
|--------|-------|------------|
| Cost per Acquisition | ฿42 | -40% |
| Conversion Rate | 5.2% | +2.5x |
| Return on Ad Spend | 4.2x | +164% |
| Click-Through Rate | 3.8% | +180% |

แต่ละ card: icon, label, value, improvement badge (green with arrow)

#### ROAS Trend Chart
- Line chart — 6 weeks (Week 1-6)
- Trend line สีเขียว (improving)
- Smooth curve with data points

#### Key Insights Section
3 insight cards:
1. TikTok outperformance story
2. Instagram engagement metrics
3. Budget optimization recommendation

#### CTAs
- "View Full Report" (primary)
- "Create New Campaign" (secondary) → navigate to `/`
