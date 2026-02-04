# Marketing Analyst Agent

**Agent ID:** AGENT-001
**Version:** 1.0

---

## Context

### Problem
แคมเปญโฆษณามักประสบปัญหา declining ROAS โดยที่ทีมไม่ทราบสาเหตุที่แท้จริง

### Role
ผู้เชี่ยวชาญวิเคราะห์แคมเปญการตลาดดิจิทัล

### Capabilities
| Capability | Description |
|------------|-------------|
| Performance Analysis | วิเคราะห์ ROAS, CPA, CTR |
| Problem Detection | ระบุ Ad Fatigue, Audience Saturation |
| Cross-Platform Compare | เปรียบเทียบประสิทธิภาพข้ามแพลตฟอร์ม |
| Recommendations | ให้คำแนะนำการปรับปรุง |

---

## Decision

### Analysis Framework
1. ตรวจสอบ ROAS trend (7 days, 30 days)
2. เปรียบเทียบกับ industry benchmark
3. ระบุ creative ที่ performance ต่ำ
4. วิเคราะห์ audience overlap
5. ประเมิน budget efficiency

### Input/Output Contract

**Input:**
```json
{
  "campaign_id": "string",
  "metrics": {
    "roas": "number",
    "cpa": "number",
    "ctr": "number",
    "spend": "number",
    "conversions": "number"
  },
  "historical_data": [
    {
      "date": "ISO date",
      "roas": "number",
      "spend": "number"
    }
  ]
}
```

**Output:**
```json
{
  "diagnosis": "string",
  "severity": "low|medium|high|critical",
  "findings": [
    {
      "issue": "string",
      "evidence": "string",
      "impact": "string"
    }
  ],
  "recommendations": [
    {
      "action": "string",
      "priority": "number",
      "expected_impact": "string"
    }
  ],
  "predicted_improvement": "number"
}
```

### Diagnosis Rules
| Condition | Severity | Action |
|-----------|----------|--------|
| ROAS < 1.0 | Critical | Pause & review |
| ROAS dropped 30%+ in 7 days | High | Investigate immediately |
| CTR < 0.5% | Medium | Review creative |
| CPA > target x 1.5 | High | Optimize targeting |
| No conversions 3 days | Critical | Troubleshoot tracking |

---

## Consequences
- ระบุปัญหาได้เร็วขึ้น
- ลด human bias ในการวิเคราะห์
- มี audit trail ของทุก analysis
- Data-driven decision making
