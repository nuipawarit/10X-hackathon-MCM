# PRD: MCM (Marketing Conversion Max)

**Document ID:** PRD-001
**Version:** 1.0
**Last Updated:** 2026-02-05
**Status:** Approved
**Source:** [`docs/0-BUSINESS-PLAN.md`](./0-BUSINESS-PLAN.md)

---

## Context

> **Reference:** Business Plan Section 2 - "Problem (The Friction of Manual Management)"

### Background

ธุรกิจ SME และ Enterprise กำลังเผชิญปัญหาในการบริหารจัดการแคมเปญโฆษณาดิจิทัล ซึ่งเกิดจาก **4 คอขวดหลัก (Bottlenecks)** ที่ระบุใน Business Plan:

| Bottleneck | Description | Business Impact |
|------------|-------------|-----------------|
| **Operational Overload** | การปรับ Budget และ Campaign ต้องใช้คน มี Time-Lag | ไม่ทันต่อตลาด 24/7 |
| **Data Silos & Blindness** | ข้อมูลแยกกันระหว่าง Facebook, TikTok, หน้าร้าน | มองไม่เห็นภาพรวม Attribution |
| **Human Bias** | การเลือก Audience จำกัดอยู่แค่ Human Assumptions | พลาดโอกาสเข้าถึงกลุ่มใหม่ |
| **Creative Fatigue** | ผลิต Creative ไม่ทัน, One-size-fits-all | ลูกค้าเบื่อหน่าย, ROAS ตก |

### Problem Statement

> **Reference:** Business Plan Section 10 - "เป็น 'Vitamin' หรือ 'Painkiller'?"

**"ธุรกิจกำลัง 'เลือดไหล' จากการเผาเงินโฆษณา (Inefficient Spend) และ 'โตไม่ได้' เพราะติดข้อจำกัดด้านแรงงานคน (Operational Bottlenecks)"**

- สูญเสียงบประมาณโฆษณาเฉลี่ย **30%** จากการบริหารจัดการที่ไม่มีประสิทธิภาพ
- ไม่สามารถขยายสเกลได้เนื่องจากข้อจำกัดด้านแรงงานคน

### Target Users

> **Reference:** Business Plan Section 7 - "Adoption Strategy (GTM)"

| User Type | Description | Pain Points | Primary Value |
|-----------|-------------|-------------|---------------|
| **Agency Owner** | บริหาร portfolio ลูกค้าหลายราย | Scale ไม่ได้, ต้นทุนสูง | Scale Portfolio |
| **Marketing Manager** | บริหารแคมเปญหลายแพลตฟอร์ม | เวลาไม่พอ, ข้อมูลกระจาย | Unified Dashboard |
| **Media Buyer** | ซื้อสื่อและปรับ budget | ปรับไม่ทัน, ตัดสินใจช้า | Real-time Optimization |
| **Creative Director** | ดูแลการผลิต creative | ผลิตไม่ทัน, Ad fatigue | Gen AI Creative |

---

## Decision

### Product Vision

> **Reference:** Business Plan Section 1 - "Concept: From Friction to Flow"

**"From Friction to Flow"** — เปลี่ยนการตลาดจาก Manual Friction เป็น AI-Powered Flow

MCM คือระบบบริหารจัดการการตลาดแบบ **"Agentic AI"** (AI ที่คิดและลงมือทำเองได้) ทำงานตลอด 24 ชั่วโมง เพื่อให้ธุรกิจไหลลื่นไปตามพลวัตของตลาดและพฤติกรรมผู้บริโภค

### Core Features (MVP)

> **Reference:** Business Plan Section 3 - "Solution" และ Section 5 - "Core Product"

#### F1: Campaign Diagnosis Dashboard
> จาก "Unified Command Dashboard" ใน Section 5

| Aspect | Detail |
|--------|--------|
| **User Story** | As a Marketing Manager, I want to see campaign health at a glance so that I can quickly identify problems |
| **Capabilities** | หน้าจอเดียวที่เห็น ROAS รวมทุกช่องทาง, Flow Visualization แสดงเส้นทางการไหลของเงิน |
| **Acceptance Criteria** | แสดง ROAS trend (7/30 days), Alert for declining performance, Cross-platform comparison |
| **Priority** | P0 (Must Have) |
| **Source Module** | AI Optimization Core |

#### F2: AI Audience Discovery
> จาก "Intelligent Targeting" ใน Section 3.4

| Aspect | Detail |
|--------|--------|
| **User Story** | As a Media Buyer, I want AI to find high-intent audiences so that I can target customers I wouldn't discover manually |
| **Capabilities** | Predictive AI ให้คะแนน Purchase Intent จาก Live Data, เจาะกลุ่ม Micro-segments |
| **Acceptance Criteria** | Generate 2-5 personas with intent scores > 70%, Demographics + Psychographics + Behaviors |
| **Priority** | P0 (Must Have) |
| **Source Module** | Intelligent Targeting |

#### F3: Generative Creative Studio
> จาก "Generative Creative Studio" ใน Section 3.3

| Aspect | Detail |
|--------|--------|
| **User Story** | As a Creative Director, I want AI to generate ad variants so that I can fight Creative Fatigue |
| **Capabilities** | Gen AI สร้าง VDO/Image/Copy นับร้อยรูปแบบ, A/B Testing variants |
| **Acceptance Criteria** | Generate creative based on persona, Support multiple platforms (TikTok, IG, FB), Hyper-personalization |
| **Priority** | P0 (Must Have) |
| **Source Module** | Generative Creative Studio |

#### F4: Cross-Platform Distribution
> จาก "Integration Mesh" ใน Section 3.1

| Aspect | Detail |
|--------|--------|
| **User Story** | As a Media Buyer, I want to distribute ads across platforms automatically so that I can reach audiences on their preferred channels |
| **Capabilities** | เชื่อมต่อ API กับ Meta, Google, TikTok, LINE, Lemon8, ดึงข้อมูล Real-time |
| **Acceptance Criteria** | Visual flow diagram, Budget allocation per platform, Platform routing based on audience |
| **Priority** | P1 (Should Have) |
| **Source Module** | Integration Mesh |

#### F5: Performance Results & Optimization
> จาก "AI Optimization Core" ใน Section 3.2

| Aspect | Detail |
|--------|--------|
| **User Story** | As a Marketing Manager, I want AI to automatically optimize my budget so that I maximize ROAS 24/7 |
| **Capabilities** | Dynamic Budget Allocation, Smart Bidding, โยกงบไปยังจุดที่ ROAS สูงสุดโดยอัตโนมัติ |
| **Acceptance Criteria** | Show improvement metrics (ROAS, CPA, CTR), Transparent AI reasoning, Human Override (Safety Brake) |
| **Priority** | P0 (Must Have) |
| **Source Module** | AI Optimization Core |

### User Flow

> **Reference:** Business Plan Section 3 - การทำงานของ 4 Modules ร่วมกัน

```
[Dashboard] → Detect ROAS decline (AI Optimization Core)
     ↓
[Audience Discovery] → AI generates personas (Intelligent Targeting)
     ↓
[Creative Studio] → Generate targeted creatives (Generative Creative Studio)
     ↓
[Distribution] → Deploy to platforms (Integration Mesh)
     ↓
[Results] → Track improvement, Auto-optimize (AI Optimization Core)
     ↓
   (Loop)
```

### Success Metrics

> **Reference:** Business Plan Section 4 - "Market Validation"

| Metric | Target | Source | Measurement |
|--------|--------|--------|-------------|
| **ROAS Improvement** | +50% minimum | "AI Adopters มี Conversion Rate สูงขึ้น 30%" | Compare before/after optimization |
| **CPA Reduction** | -30% | "ลดต้นทุนค่าโฆษณาได้ 20%" | Average CPA change |
| **Time Saved** | -80% | "ลดภาระงาน Manual ได้ถึง 80%" | Manual hours reduced |
| **User Activation** | 70% | GTM Strategy - PoC | Complete first campaign within 7 days |

---

## Consequences

### Positive

> **Reference:** Business Plan Section 4 - "Market Validation" และ Section 9 - "Competitive Advantage"

| Benefit | Detail | Source |
|---------|--------|--------|
| **Scalability without Headcount** | ดูแลพอร์ตใหญ่ขึ้นได้ด้วยทีมเท่าเดิม | Section 4.1 |
| **Performance Uplift** | Conversion Rate สูงขึ้น 30%, ลดต้นทุน 20% | Section 4.2 |
| **24/7 Relentless Optimization** | ดักจับทุก Efficiency Gap ที่มนุษย์พลาดไป | Section 9.3 |
| **Generative-Media Fusion** | แก้ปัญหา Ad Fatigue ได้เร็วกว่าคู่แข่ง | Section 9.2 |
| **Agentic Execution** | ไม่ใช่แค่รายงาน แต่ลงมือทำให้ทันที | Section 9.1 |

### Negative

| Challenge | Detail | Mitigation |
|-----------|--------|------------|
| **Learning Curve** | ต้องมี learning curve สำหรับ AI features | Onboarding wizard, Demo mode |
| **API Dependency** | Dependency on platform APIs | Abstraction layer, Graceful degradation |
| **Minimum Data Volume** | ต้องมี minimum data volume | Start with historical data import |
| **Trust Issues** | ความเชื่อใจในการให้ AI คุมงบประมาณ | Transparent Logging, Human Override |

### Risks & Mitigations

> **Reference:** Business Plan Section 11 - "Gap Analysis & Feasibility Check"

| Risk | Impact | Likelihood | Mitigation | Source |
|------|--------|------------|------------|--------|
| **Trust Gap** | High | High | Transparent Logging, Human Override Switch (Safety Brake) | Section 11 |
| **API Rate Limits** | High | Medium | Implement caching, queue system | Technical |
| **AI Hallucination** | Medium | Medium | Human review layer for creatives | Technical |
| **Platform API Changes** | Medium | Medium | Abstraction layer | Section 8 (Competition) |

---

## Appendix

### 4 Core Modules Mapping

> **Reference:** Business Plan Section 3 - "Solution (Tech & Data Driven)"

| Module | Business Plan Description | Product Feature |
|--------|--------------------------|-----------------|
| **Integration Mesh** | เชื่อมต่อ API กับ Meta, Google, TikTok, LINE, Lemon8 | F4: Distribution |
| **AI Optimization Core** | Dynamic Budget Allocation, Smart Bidding 24/7 | F1: Dashboard, F5: Results |
| **Generative Creative Studio** | Gen AI สร้าง VDO/Image/Copy นับร้อยรูปแบบ | F3: Creative Studio |
| **Intelligent Targeting** | Predictive AI, Purchase Intent, Micro-segments | F2: Audience Discovery |

### Glossary

| Term | Definition | Source |
|------|------------|--------|
| **ROAS** | Return on Ad Spend | Industry standard |
| **CPA** | Cost Per Acquisition | Industry standard |
| **Agentic AI** | AI ที่คิดและลงมือทำเองได้ | Business Plan Section 1 |
| **Ad Fatigue** | Declining performance จากการใช้โฆษณาซ้ำ | Business Plan Section 2 |
| **Safety Brake** | Human Override ให้คนเข้ามาแทรกแซงได้ | Business Plan Section 5 |

### References

- **Source Document:** [`docs/0-BUSINESS-PLAN.md`](./0-BUSINESS-PLAN.md)
- **Next Document:** [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md)
