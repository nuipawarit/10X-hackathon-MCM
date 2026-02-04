# MCM Setup Guide

**Document ID:** SETUP-001
**Version:** 1.0
**Last Updated:** 2026-02-05
**Source:** [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md)

---

## Context

> **Reference:** Architecture "Tech Stack" และ "Project Structure"

### Purpose

Step-by-step guide สำหรับ developers ที่ต้องการ setup MCM locally โดยอ้างอิง Tech Stack จาก Architecture:

| Layer | Technology | From Architecture |
|-------|------------|-------------------|
| **Frontend** | Next.js 15 (App Router) | Server components, SEO |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development |
| **Backend** | Next.js API Routes | Unified codebase |
| **Database** | PostgreSQL (Vercel Postgres) | Strong consistency |
| **ORM** | Drizzle ORM | Type-safe |
| **AI** | Claude API (@anthropic-ai/sdk) | Reasoning, Analysis |

### Prerequisites

> **Reference:** Architecture "Tech Stack"

| Requirement | Version | Purpose | Source |
|-------------|---------|---------|--------|
| Node.js | 20+ | Runtime | Next.js 15 requirement |
| PostgreSQL | 15+ | Database | Architecture "Database" |
| pnpm | 8+ | Package manager | Project standard |

---

## Decision

### Step 1: Clone & Install

> **Reference:** Architecture "Project Structure"

```bash
git clone <repo-url>
cd mcm-app
pnpm install
```

**Project Structure Preview:**
```
mcm-app/
├── app/                    # Next.js App Router (Architecture)
│   ├── (dashboard)/        # F1-F5 Features (PRD)
│   └── api/                # API Routes
├── components/             # UI Components
├── features/               # 4 Core Modules (Business Plan)
├── lib/                    # Utilities
└── docs/                   # Documentation chain
```

### Step 2: Environment Setup

> **Reference:** Architecture "Tech Stack" - Services

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

**Required Variables (Core):**

| Variable | Example | Module Reference |
|----------|---------|------------------|
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/mcm` | Architecture "Database" |
| `ANTHROPIC_API_KEY` | `sk-ant-xxx` | Architecture "AI" - Claude API |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | API Reference "Base URLs" |

**Vercel Variables (Auto-provisioned):**

> **Reference:** Infrastructure document

| Variable | Purpose | Module |
|----------|---------|--------|
| `POSTGRES_URL` | Vercel Postgres connection | Database |
| `BLOB_READ_WRITE_TOKEN` | Creative assets storage | Creative Studio |
| `KV_REST_API_URL` | Cache endpoint | AI Optimization |
| `KV_REST_API_TOKEN` | Cache authentication | AI Optimization |

### Step 3: Database Setup

> **Reference:** Architecture "Database Schema"

```bash
# Generate migrations from Drizzle schema
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed demo data (campaigns, personas)
pnpm db:seed
```

**Tables Created (from Architecture):**

| Table | Purpose | Module |
|-------|---------|--------|
| `users` | Demo users, Auth | Core |
| `platform_connections` | API credentials | Integration Mesh |
| `campaigns` | Campaign metadata | Core |
| `audiences` | AI-generated personas | Intelligent Targeting |
| `creatives` | Generated assets | Creative Studio |
| `deployments` | Ad deployment status | Integration Mesh |
| `analytics` | Performance metrics | AI Optimization |
| `optimization_logs` | AI decision audit | AI Optimization |

### Step 4: Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000

### Step 5: Demo Users

> **Reference:** PRD "Target Users"

| Email | Password | Role | User Type (PRD) |
|-------|----------|------|-----------------|
| demo@mcm.app | demo123 | Admin | Marketing Manager |
| agency@mcm.app | agency123 | Agency | Agency Owner |
| viewer@mcm.app | view123 | Viewer | Media Buyer |

### Step 6: Verify 5 Features

> **Reference:** PRD "Core Features (MVP)"

| Route | Feature | Module | Verification |
|-------|---------|--------|--------------|
| `/` | F1: Dashboard | AI Optimization Core | ROAS metrics displayed |
| `/audience` | F2: Audience Discovery | Intelligent Targeting | Personas generated |
| `/creative` | F3: Creative Studio | Generative Creative | Create ad copy |
| `/distribution` | F4: Distribution | Integration Mesh | Platform flow visible |
| `/results` | F5: Results | AI Optimization Core | Recommendations shown |

---

## Consequences

### npm Scripts

> **Reference:** Architecture "Tech Stack"

| Script | Description | Related |
|--------|-------------|---------|
| `pnpm dev` | Start development server | Next.js 15 |
| `pnpm build` | Build for production | Vercel deployment |
| `pnpm start` | Start production server | - |
| `pnpm lint` | Run ESLint | Code quality |
| `pnpm db:generate` | Generate Drizzle migrations | Architecture "ORM" |
| `pnpm db:push` | Push schema to database | Architecture "Database" |
| `pnpm db:seed` | Seed demo data | Testing |
| `pnpm db:studio` | Open Drizzle Studio | Database inspection |

### Troubleshooting Guide

| Problem | Cause | Solution | Related Module |
|---------|-------|----------|----------------|
| Database connection error | PostgreSQL not running | Start PostgreSQL service | Core |
| Invalid DATABASE_URL | Wrong format | Use `postgresql://user:pass@host:5432/db` | Core |
| AI API errors | Invalid key | Verify ANTHROPIC_API_KEY | AI modules |
| Port 3000 in use | Other process | Kill process or use `PORT=3001 pnpm dev` | - |
| Build errors | Missing deps | Run `pnpm install` again | - |
| Platform API errors | Missing tokens | Check Integration Mesh env vars | Integration Mesh |

### Verification Checklist

- [ ] `pnpm dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can login with demo user
- [ ] F1: Dashboard loads with mock ROAS data
- [ ] F2: Audience page shows personas
- [ ] F3: Creative Studio can generate copy
- [ ] F4: Distribution flow is visible
- [ ] F5: Results shows optimization recommendations

---

## References

- **Source Documents:**
  - [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md) - Tech Stack, Project Structure, Database Schema
  - [`docs/1-PRD.md`](./1-PRD.md) - Features, Target Users
- **Next Document:** [`docs/5-INFRASTRUCTURE.md`](./5-INFRASTRUCTURE.md)
