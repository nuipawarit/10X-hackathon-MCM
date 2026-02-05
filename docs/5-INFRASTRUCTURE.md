# MCM Infrastructure

**Document ID:** INFRA-002
**Version:** 2.0
**Last Updated:** 2026-02-05
**Source:** [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md)

---

## Hosting: Vercel

| Service | Purpose | Config |
|---------|---------|--------|
| **Vercel** | Hosting, Serverless Functions | `vercel.json` |
| **Vercel Postgres** | Database | `DATABASE_URL` |
| **Vercel Blob** | Creative asset storage | `BLOB_READ_WRITE_TOKEN` |
| **Vercel KV** | Analytics cache, Rate limiting | `KV_URL` |

## Deployment

```
main branch → Vercel Production
PR branches → Vercel Preview
```

### Regions

| Region | Code | Purpose |
|--------|------|---------|
| Singapore | sin1 | Primary (SEA market) |
| Hong Kong | hkg1 | Failover |

## Performance Targets

| Metric | Target | Page |
|--------|--------|------|
| Dashboard load | < 2s | F1 |
| AI persona generation | < 30s | F2 |
| Creative generation | < 30s | F3 |
| API response (non-AI) | < 500ms | All |
| Error rate | < 0.1% | All |

## Caching Strategy

| Data | TTL | Storage |
|------|-----|---------|
| Analytics aggregates | 5 min | Vercel KV |
| Persona results | 1 hour | Vercel KV |
| Platform connections | 10 min | Vercel KV |
| Rate limiting | 1 min window | Vercel KV |

## Monitoring

- Vercel Analytics for performance metrics
- Vercel Logs for error tracking
- `optimization_logs` table for AI audit trail

---

## References

- [`docs/2-ARCHITECTURE.md`](./2-ARCHITECTURE.md) - Tech stack
- [`docs/4-SETUP-GUIDE.md`](./4-SETUP-GUIDE.md) - Environment variables
