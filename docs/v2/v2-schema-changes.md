# MCM v2 — Schema, Queries & API Changes

---

## 1. Database Schema Changes

### 1.1 Constants Update

**File:** `lib/db/constants.ts`

เพิ่ม 2 platforms ใน `PLATFORM_COLORS`:

```typescript
shopee: { color: '#EE4D2D', logo: 'SH', displayName: 'Shopee' },
lazada: { color: '#0F146D', logo: 'LZ', displayName: 'Lazada' },
```

อัพเดต platform colors ที่เปลี่ยน:
```typescript
google: { color: '#EA4335', logo: 'G', displayName: 'Google Ads' },  // was #4285F4
line: { color: '#00C300', logo: 'LN', displayName: 'LINE LAP' },     // was #00B900
```

---

### 1.2 `audiences` Table — Lifecycle Fields

**File:** `lib/db/schema/audiences.ts`

เพิ่ม columns:

```typescript
lifecycleStage: varchar('lifecycle_stage', { length: 50 }),
// Values: 'new' | 'active' | 'vip' | 'at_risk'

segmentType: varchar('segment_type', { length: 50 }).default('consumer'),
// Values: 'consumer' | 'business'

customerCount: integer('customer_count'),
// จำนวนลูกค้าใน segment นี้

avgOrderValue: decimal('avg_order_value', { precision: 10, scale: 2 }),
// มูลค่าเฉลี่ยต่อ order

purchaseFrequency: decimal('purchase_frequency', { precision: 4, scale: 2 }),
// ความถี่ในการซื้อ (ครั้ง/เดือน)
```

**Note:** fields ทั้งหมดเป็น nullable เพื่อ backward compatibility กับ v1 data

---

### 1.3 `creatives` Table — AI Context Fields

**File:** `lib/db/schema/creatives.ts`

เพิ่ม columns:

```typescript
businessGoal: varchar('business_goal', { length: 50 }),
// Values: 'vip' | 'new' | 'returning' | 'atrisk'

targetPersonaId: uuid('target_persona_id').references(() => audiences.id),
// FK ไป audiences table — persona ที่เลือกตอนสร้าง creative

predictionScore: decimal('prediction_score', { precision: 5, scale: 2 }),
// AI predicted conversion score (0-100)

aiReasoning: text('ai_reasoning'),
// AI explanation ว่าทำไม creative นี้จะ perform ดี

impactMetrics: jsonb('impact_metrics'),
// { convRate: number, ctr: number, cpaImprovement: number, roasBoost: number }
```

**Note:** `creatives` table ไม่มี `updatedAt` column (ตาม v1 design)

---

### 1.4 `deployments` Table — AI Recommendation Fields

**File:** `lib/db/schema/deployments.ts`

เพิ่ม columns:

```typescript
aiRecommendedPlatforms: jsonb('ai_recommended_platforms'),
// Array of platform strings: ['tiktok', 'lemon8', 'instagram']

confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }),
// AI confidence score (0-100) สำหรับ recommendation

recommendationReason: text('recommendation_reason'),
// เหตุผลที่ AI แนะนำ platform นี้

userOverride: boolean('user_override').default(false),
// true ถ้า user เลือก platform ต่างจาก AI recommendation
```

---

### 1.5 `analytics` Table — No Schema Changes

ไม่ต้องเปลี่ยน schema แต่ต้อง:
- เพิ่ม seed data สำหรับ platform `'shopee'` และ `'lazada'`
- ตรวจสอบว่า queries support 7 platforms

---

## 2. New Query Functions

**File:** `lib/db/queries.ts`

### Dashboard Queries

```typescript
// KPI cards — aggregate metrics across all platforms
getCrossPlatformKPIs(campaignId: string): Promise<{
  totalSpend: number;
  totalRevenue: number;
  overallRoas: number;
  totalConversions: number;
  spendChange: number;    // % vs previous period
  revenueChange: number;
  roasChange: number;
  conversionsChange: number;
}>

// Stacked bar chart data — daily breakdown per platform
getDailyPlatformBreakdown(campaignId: string): Promise<Array<{
  day: string;
  meta: number;
  google: number;
  tiktok: number;
  line: number;
  lemon8: number;
  shopee: number;
  lazada: number;
  roas: number;
}>>
```

### Audience Queries

```typescript
// Lifecycle stage cards — business insights view
getLifecycleSegments(campaignId: string): Promise<Array<{
  id: string;
  stage: 'new' | 'active' | 'vip' | 'at_risk';
  customerCount: number;
  avgOrderValue: number;
  revenueShare: number;  // % of total revenue
}>>

// Stacked area chart — 6 months of segment growth
getSegmentGrowthTrend(campaignId: string): Promise<Array<{
  month: string;
  new: number;
  active: number;
  vip: number;
  atRisk: number;
}>>

// Radar chart — AI vs Manual comparison scores
getAIvsManualComparison(campaignId: string): Promise<{
  metrics: Array<{
    metric: string;
    ai: number;      // 0-100
    manual: number;   // 0-100
  }>;
  overallImprovement: number;  // % ที่ AI ดีกว่า
}>
```

### Creative Queries

```typescript
// AI strategy suggestion based on goal + persona combo
getAIStrategySuggestion(businessGoal: string, personaId: string): Promise<{
  strategy: string;     // AI suggestion text
  contextStats: {
    segmentSize: number;
    avgOrderValue: number;
    purchaseFrequency: number;
  };
}>

// Performance prediction for a creative
getCreativePrediction(creativeId: string): Promise<{
  predictionScore: number;
  aiReasoning: string;
  impactMetrics: {
    convRate: number;
    ctr: number;
    cpaImprovement: number;
    roasBoost: number;
  };
}>
```

### Distribution Queries

```typescript
// AI platform recommendations per deployment/ad set
getAIPlatformRecommendation(deploymentId: string): Promise<{
  recommendedPlatforms: string[];
  confidenceScore: number;
  reason: string;
  userOverride: boolean;
}>
```

---

## 3. Existing Queries to Update

### `getCampaignTrend` (Dashboard)
- เพิ่ม support สำหรับ Shopee/Lazada data
- Return multi-platform breakdown (ไม่ใช่แค่ aggregate)

### `getDeploymentPerformance` (Dashboard Table)
- เพิ่ม Shopee/Lazada ใน platform list
- เพิ่ม confidence score column

### `getCampaignPersonas` (Audience)
- เพิ่ม filter by `segmentType` ('consumer' | 'business')
- เพิ่ม lifecycle fields ใน return type

### `getCampaignCreatives` (Creative)
- เพิ่ม businessGoal, targetPersonaId, predictionScore
- เพิ่ม aiReasoning และ impactMetrics

### `getCampaignDistribution` (Distribution)
- เพิ่ม AI recommendation fields
- เพิ่ม confidence score และ userOverride

---

## 4. New API Routes

### 4.1 Cross-Platform Analytics

```
GET /api/analytics/cross-platform?campaignId=xxx
```

Returns: Multi-platform aggregated analytics สำหรับ Dashboard
- KPI summaries
- Daily platform breakdown

### 4.2 Lifecycle Segmentation

```
POST /api/ai/audience/lifecycle
Body: { campaignId: string }
```

AI generates lifecycle segments จาก campaign analytics data
- Classifies customers into: new, active, vip, at_risk
- Saves to audiences table with `segmentType: 'business'`

### 4.3 AI Strategy Fusion

```
POST /api/ai/creative/strategy-fusion
Body: { businessGoal: string, personaId: string }
```

Returns: AI-generated creative strategy suggestion
- Strategy text based on goal + persona combination
- Context stats (segment size, AOV, frequency)

### 4.4 Creative Performance Prediction

```
POST /api/ai/creative/predict
Body: { creativeId: string, platforms: string[] }
```

Returns: AI predicted performance metrics
- Predicted conversion rate
- AI reasoning
- Expected impact (CTR, CPA improvement, ROAS boost)

### 4.5 Platform Recommendation

```
POST /api/ai/distribution/recommend
Body: { deploymentId: string, audienceId: string }
```

Returns: AI-recommended platforms with confidence
- Recommended platform list
- Confidence score (0-100)
- Reasoning text

---

## 5. Seed Data Updates

**File:** `lib/db/seed.ts`

### เพิ่มข้อมูลใหม่:

#### 1. Shopee & Lazada Analytics (7 days)
```typescript
// เพิ่มใน analytics seed data
{ platform: 'shopee', impressions: 45000, clicks: 1800, conversions: 120, spend: '8500', revenue: '28000' }
{ platform: 'lazada', impressions: 38000, clicks: 1500, conversions: 95, spend: '7200', revenue: '22000' }
```

#### 2. Business Lifecycle Audiences (4 segments)
```typescript
// segmentType: 'business' — 4 lifecycle stages
{ name: 'New Customers', lifecycleStage: 'new', segmentType: 'business', customerCount: 850, avgOrderValue: '1200', purchaseFrequency: '1.2' }
{ name: 'Active/Returning', lifecycleStage: 'active', segmentType: 'business', customerCount: 2100, avgOrderValue: '2800', purchaseFrequency: '2.8' }
{ name: 'Top Spenders/VIP', lifecycleStage: 'vip', segmentType: 'business', customerCount: 320, avgOrderValue: '4250', purchaseFrequency: '3.2' }
{ name: 'At-Risk/Drop-off', lifecycleStage: 'at_risk', segmentType: 'business', customerCount: 480, avgOrderValue: '1800', purchaseFrequency: '0.5' }
```

#### 3. Creative AI Context
```typescript
// เพิ่ม fields ให้ creative records ที่มีอยู่
{ businessGoal: 'vip', predictionScore: '85.5', aiReasoning: 'High engagement expected...', impactMetrics: { convRate: 4.8, ctr: 3.2, cpaImprovement: -35, roasBoost: 4.5 } }
```

#### 4. Deployment AI Recommendations
```typescript
// เพิ่ม fields ให้ deployment records ที่มีอยู่
{ aiRecommendedPlatforms: ['tiktok', 'lemon8'], confidenceScore: '92', recommendationReason: 'High engagement from tech-savvy users...', userOverride: false }
```

#### 5. Historical Segment Growth (6 months)
สำหรับ stacked area chart — สร้าง analytics records ย้อนหลัง 6 เดือน ของแต่ละ lifecycle segment
