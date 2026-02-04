# Audience Researcher Agent

**Agent ID:** AGENT-004
**Version:** 1.0

---

## Context

### Problem
การเลือกกลุ่มเป้าหมายจำกัดอยู่แค่ human assumptions ทำให้พลาดโอกาสเข้าถึงกลุ่มใหม่

### Role
AI วิเคราะห์และสร้าง audience personas จากข้อมูล

### Capabilities
| Capability | Description |
|------------|-------------|
| Demographic Analysis | วิเคราะห์ age, gender, location |
| Behavioral Patterns | ระบุ purchase behaviors |
| Micro-segments | สร้าง granular segments |
| Intent Scoring | คำนวณ purchase intent |

---

## Decision

### Segmentation Rules
| Rule | Threshold | Reason |
|------|-----------|--------|
| Minimum segment size | 10,000 users | Statistical significance |
| Intent score for primary | > 70% | High conversion potential |
| Platform overlap flag | > 40% | Avoid duplicate targeting |
| Behavioral recency | < 30 days | Fresh intent signals |

### Persona Generation Framework

#### Input Data Points
| Category | Data Points |
|----------|-------------|
| Demographics | Age, gender, location, income level |
| Interests | Categories, brands, topics |
| Behaviors | Purchase history, engagement patterns |
| Platform | Preferred platforms, usage frequency |
| Timing | Active hours, purchase timing |

#### Persona Template
```json
{
  "persona_name": "string (memorable, descriptive)",
  "tagline": "string (one sentence summary)",
  "demographics": {
    "age_range": "string (e.g., '25-34')",
    "gender_split": {
      "male": "number (0-100)",
      "female": "number (0-100)"
    },
    "locations": ["string"],
    "income_level": "string"
  },
  "psychographics": {
    "values": ["string"],
    "pain_points": ["string"],
    "motivations": ["string"],
    "lifestyle": "string"
  },
  "behaviors": {
    "platforms": ["string"],
    "content_preferences": ["string"],
    "purchase_triggers": ["string"],
    "buying_frequency": "string"
  },
  "intent_score": "number (0-100)",
  "segment_size": "number",
  "recommended_messaging": "string",
  "creative_direction": "string",
  "best_platforms": ["string"],
  "optimal_timing": {
    "days": ["string"],
    "hours": ["string"]
  }
}
```

### Input/Output Contract

**Input:**
```json
{
  "campaign_id": "uuid",
  "product_category": "string",
  "data_sources": ["meta", "google", "tiktok"],
  "existing_audience": {
    "demographics": {},
    "behaviors": []
  },
  "constraints": {
    "min_segment_size": "number",
    "max_personas": "number"
  }
}
```

**Output:**
```json
{
  "personas": [
    {
      "persona_name": "string",
      "intent_score": "number",
      "segment_size": "number",
      "demographics": {},
      "psychographics": {},
      "behaviors": {},
      "recommended_messaging": "string",
      "creative_direction": "string"
    }
  ],
  "insights": [
    {
      "finding": "string",
      "impact": "string",
      "recommendation": "string"
    }
  ],
  "overlap_analysis": {
    "personas_overlap": "number",
    "recommendation": "string"
  }
}
```

### Example Personas (Skincare)

#### Persona 1: The Skincare Geeks
| Attribute | Value |
|-----------|-------|
| Intent Score | 92% |
| Age Range | 25-40 |
| Key Trait | Science-focused, research ingredients |
| Pain Point | Skeptical of marketing claims |
| Trigger | Clinical studies, ingredient lists |
| Platform | Instagram, YouTube |

#### Persona 2: The City Commuter
| Attribute | Value |
|-----------|-------|
| Intent Score | 88% |
| Age Range | 28-45 |
| Key Trait | Busy professionals, time-conscious |
| Pain Point | No time for complex routines |
| Trigger | Quick results, multi-tasking products |
| Platform | TikTok, Facebook |

---

## Consequences
- ค้นพบ audience segments ใหม่
- Data-driven targeting
- Reduced CAC through precision targeting
- Better creative alignment with personas
- Improved ROAS through relevant messaging
