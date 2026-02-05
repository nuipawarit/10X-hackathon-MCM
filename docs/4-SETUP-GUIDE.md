# MCM Setup Guide

**Document ID:** SETUP-002
**Version:** 2.0
**Last Updated:** 2026-02-05
**Source:** [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md)

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| PostgreSQL | 15+ | Database |
| pnpm | 8+ | Package manager |

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Required variables:

```env
# Database (Vercel Postgres)
DATABASE_URL=postgresql://user:password@host:5432/mcm
POSTGRES_URL=postgresql://user:password@host:5432/mcm

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Cache (Vercel KV)
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

### 3. Database Setup

```bash
# Push schema to database
pnpm db:push

# Seed demo data
pnpm db:seed
```

### 4. Start Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `db:push` | `drizzle-kit push` | Push schema to database |
| `db:seed` | `tsx lib/db/seed.ts` | Seed demo data |
| `db:studio` | `drizzle-kit studio` | Open Drizzle Studio |

## Demo Data

After seeding, the following demo data is available:

| Entity | Count | Details |
|--------|-------|---------|
| Users | 1 | demo@mcm.app |
| Campaigns | 2 | Summer Skincare Launch, Q1 Brand Awareness |
| Platform Connections | 5 | Meta, Google, TikTok (active), LINE, Lemon8 (not_connected) |
| Audiences | 2 | Skincare Geeks (92% intent), City Commuter (88% intent) |
| Creatives | 6 | 3 per persona |
| Analytics | 14 | 7 days x 2 campaigns |
| Deployments | 4 | TikTok, Lemon8, Instagram, Facebook |

## Project Structure

See [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md) for full project structure.

---

## References

- [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md) - Tech stack, Project structure
- [`docs/5-INFRASTRUCTURE.md`](./5-INFRASTRUCTURE.md) - Deployment
