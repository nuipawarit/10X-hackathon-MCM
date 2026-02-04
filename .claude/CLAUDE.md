# MCM Project Guidelines

## Context
MCM เป็น Agentic AI Marketing Platform ที่ช่วยบริหารจัดการแคมเปญโฆษณาแบบอัตโนมัติ

## Decision

### Tech Stack
- Next.js 15 (App Router)
- PostgreSQL + Drizzle ORM (Vercel Postgres)
- Tailwind CSS + shadcn/ui
- Claude API / LangChain
- Vercel (hosting, serverless, edge)

### Architecture
| Path | Purpose | Modify? |
|------|---------|---------|
| `/app/(dashboard)/` | Main app pages | Yes |
| `/components/ui/` | shadcn/ui primitives | NO |
| `/components/[feature]/` | Business components | Yes |
| `/features/` | Business logic modules | Yes |
| `/agents/` | AI agent prompts | Yes |
| `/lib/db/` | Database schema | Yes |

### 4 Core Modules
1. **Integration Mesh** - Platform API connections (Meta, Google, TikTok, LINE, Lemon8)
2. **AI Optimization** - Budget allocation & smart bidding
3. **Creative Studio** - AI-generated creatives
4. **Intelligent Targeting** - Audience segmentation & personas

### Coding Conventions
- TypeScript strict mode
- Component naming: PascalCase
- File naming: kebab-case
- Validation: Zod
- Mutations: Server Actions
- use postgres

### shadcn/ui Rules
- `components/ui/*` - DO NOT MODIFY directly
- Add via CLI only: `npx shadcn@latest add [component]`
- Create wrapper components to customize

## Consequences
- Consistent codebase structure
- Clear separation of concerns
- Maintainable AI agent system
