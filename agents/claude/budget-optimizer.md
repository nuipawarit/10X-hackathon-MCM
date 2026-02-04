# Budget Optimizer Agent

**Agent ID:** AGENT-003
**Version:** 1.0

---

## Context

### Problem
การจัดสรรงบประมาณแบบ manual ช้าและไม่ตอบสนองต่อ market changes ทันเวลา

### Role
AI จัดสรรงบประมาณโฆษณาให้เหมาะสมที่สุด

### Goals
1. Maximize ROAS (Return on Ad Spend)
2. Minimize CPA (Cost Per Acquisition)
3. Maintain reach targets
4. Balance risk across platforms

---

## Decision

### Optimization Rules
```
# Increase budget rules
IF platform_roas > avg_roas * 1.2 THEN increase_budget(20%)
IF platform_cpa < target_cpa * 0.8 THEN increase_budget(15%)

# Decrease budget rules
IF platform_roas < avg_roas * 0.8 THEN decrease_budget(15%)
IF platform_cpa > target_cpa * 1.2 THEN decrease_budget(20%)

# Alert rules
IF creative_ctr < 1% for 3 days THEN flag_creative_fatigue()
IF cpa > target_cpa * 1.5 THEN pause_and_review()
IF no_conversions for 2 days THEN alert_critical()
```

### Budget Allocation Matrix
| Platform Performance | Action | Max Change |
|---------------------|--------|------------|
| Excellent (ROAS > 3.0) | Increase | +30% |
| Good (ROAS 2.0-3.0) | Increase | +20% |
| Average (ROAS 1.5-2.0) | Maintain | ±10% |
| Below Average (ROAS 1.0-1.5) | Decrease | -15% |
| Poor (ROAS < 1.0) | Pause/Review | -50% |

### Input/Output Contract

**Input:**
```json
{
  "total_budget": "number",
  "platforms": [
    {
      "name": "meta|google|tiktok|line|lemon8",
      "current_allocation": "number",
      "roas": "number",
      "cpa": "number",
      "spend": "number",
      "conversions": "number"
    }
  ],
  "constraints": {
    "min_platform_budget": "number",
    "max_daily_change": "number",
    "target_roas": "number",
    "target_cpa": "number"
  }
}
```

**Output:**
```json
{
  "new_allocations": [
    {
      "platform": "string",
      "previous_budget": "number",
      "new_budget": "number",
      "change_percent": "number"
    }
  ],
  "reasoning": "string",
  "risk_assessment": "low|medium|high",
  "expected_impact": {
    "roas_change": "number",
    "cpa_change": "number",
    "projected_conversions": "number"
  },
  "alerts": [
    {
      "type": "string",
      "platform": "string",
      "message": "string"
    }
  ]
}
```

### Safety Constraints
| Constraint | Value | Reason |
|------------|-------|--------|
| Max daily change | 30% | Prevent drastic swings |
| Min platform budget | $10/day | Maintain learning |
| Review threshold | ROAS < 0.5 | Human oversight |
| Pause threshold | No conversions 3 days | Stop waste |

---

## Consequences
- Real-time budget optimization 24/7
- Transparent reasoning for every change
- Human override always available
- Reduced wasted ad spend
- Faster response to market changes
