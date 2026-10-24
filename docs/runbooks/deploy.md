# Deploy — DevThread

DevThread deploys to **Vercel** from the `main` branch. The site is a single
Next.js app; there is no separate backend process.

## Environments
| Env | Branch | Database | AdSense | Email |
|---|---|---|---|---|
| Local | any | `DATABASE_URL` from `.env` | from `.env` | from `.env` |
| Staging | `main` (preview) | Supabase **staging** project | test ID or none | test key |
| Production | `main` (manual deploy) | Supabase **production** project | real ID | real key |

Staging and production **never share a database**.

## Pre-deploy checklist
- [ ] `npm run build` passes (CI runs this on every PR).
- [ ] `npm run lint` is clean.
- [ ] `npm test` is green.
- [ ] Migrations are committed (schema is bootstrapped idempotently by
      `src/db/index.ts`, so there is no separate migration tool — but any schema
      change must be reviewed before deploy).
- [ ] Env vars for the target environment are set in the Vercel dashboard
      (`DATABASE_URL`, `NEXT_PUBLIC_ADSENSE_CLIENT`, `RESEND_*`, etc.).
- [ ] `NEXT_PUBLIC_SITE_URL` matches the production domain.

## Deploy steps
1. Merge the feature branch into `main` (PR review required).
2. Vercel auto-deploys the merge to **staging** (preview). Open it and smoke
   test: homepage renders, an article opens, `/api/health` returns `ok`.
3. In the Vercel project, click **Deploy** on the `main` production
   deployment. Confirm the env vars are the production ones.
4. Once live: run `npm run generate-sitemap` against production so
   `sitemap.xml` reflects the real domain, then commit and redeploy.
5. Verify on the real site: article renders, login works, `/api/health` is `ok`.

## Migrations
Schema changes are applied by `src/db/index.ts` on first DB connect
(`CREATE TABLE IF NOT EXISTS`). Because it is idempotent, deploys never need a
separate migration step — but a schema change must be reviewed before deploy.

## Rollback
See `docs/runbooks/rollback.md`.

## First-deploy notes
- Vercel auto-detects Next.js. No build command override needed.
- Set `NODE_ENV=production` (Vercel does this automatically).
- Uploads are written to `public/uploads/` on the running instance. On Vercel
  the build is immutable, so uploads from a previous deploy are preserved on
  disk but a new deploy's code won't see them until the next request writes.
  This is fine for a single-region deploy; revisit if you scale horizontally.