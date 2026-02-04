# Creative Director Agent

**Agent ID:** AGENT-002
**Version:** 1.0

---

## Context

### Problem
การผลิต creative ไม่ทันต่อความต้องการ และ one-size-fits-all ทำให้ไม่ตรงกลุ่มเป้าหมาย

### Role
AI Creative Director สร้างและแนะนำ creative assets

### Capabilities
| Capability | Description |
|------------|-------------|
| Copy Generation | สร้าง ad copy ตาม persona |
| Visual Direction | แนะนำ visual style |
| Platform Adaptation | ปรับ format ตามแพลตฟอร์ม |
| A/B Variants | สร้าง test variants |

---

## Decision

### Persona-Based Guidelines

#### Skincare Geeks Persona
| Aspect | Direction |
|--------|-----------|
| Tone | Scientific, data-driven, educational |
| Visual | Lab imagery, ingredients closeup, clinical settings |
| Keywords | clinical, proven, research-backed, formulated |
| CTA | "Discover the science", "See the research" |
| Colors | Clean whites, clinical blues, subtle greens |

#### City Commuter Persona
| Aspect | Direction |
|--------|-----------|
| Tone | Quick, efficient, lifestyle, relatable |
| Visual | Urban settings, on-the-go moments, busy life |
| Keywords | fast, easy, fits your life, simple |
| CTA | "Simplify your routine", "Save time" |
| Colors | Urban grays, energetic oranges, modern blacks |

### Platform Specifications

| Platform | Format | Aspect Ratio | Max Length | Notes |
|----------|--------|--------------|------------|-------|
| TikTok | Video | 9:16 | 60s | Hook in first 3s |
| Instagram Feed | Image/Carousel | 1:1, 4:5 | - | High visual quality |
| Instagram Story | Image/Video | 9:16 | 15s | Vertical, fast |
| Facebook Feed | Image/Video | 1:1, 16:9 | - | Informative captions |

### Output Contract
```json
{
  "headline_variants": [
    {
      "text": "string",
      "persona": "string",
      "platform": "string"
    }
  ],
  "body_copy_variants": [
    {
      "text": "string",
      "character_count": "number",
      "persona": "string"
    }
  ],
  "visual_direction": {
    "style": "string",
    "mood": "string",
    "colors": ["string"],
    "imagery": ["string"]
  },
  "platform_adaptations": {
    "tiktok": {
      "hook": "string",
      "format": "string"
    },
    "instagram": {
      "hashtags": ["string"],
      "format": "string"
    },
    "facebook": {
      "cta_button": "string",
      "format": "string"
    }
  }
}
```

---

## Consequences
- ลดเวลาผลิต creative 70%
- Hyper-personalized messaging
- Consistent brand voice across platforms
- Easy A/B testing with variants
