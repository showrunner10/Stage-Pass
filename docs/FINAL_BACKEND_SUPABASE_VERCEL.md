# Hypelist Final Backend Setup (Supabase + Vercel)

This project is ready to run on Supabase Postgres with Vercel.

## 1) Create Supabase project
- Create a new project in Supabase.
- Copy two connection strings:
  - Pooling (transaction) URL (port `6543`) for runtime.
  - Direct DB URL (port `5432`) for Prisma CLI.

## 2) Set environment variables
In local `.env.local` and Vercel Project Settings -> Environment Variables:

- `DATABASE_URL` = pooled Supabase URL (with `?pgbouncer=true`)
- `DIRECT_URL` = direct Supabase URL
- `TRACKING_HASH_SALT`
- `TIXR_WEBHOOK_SECRET`
- `ORDER_IMPORT_TOKEN`
- `PAYOUT_JOB_TOKEN`

## 3) Push schema and generate client
Run locally:

```bash
npm run db:push
npx prisma generate
```

## 4) Seed launch data
Run:

```bash
npm run db:seed
```

This seeds:
- Promoter org (`Secret Sounds`)
- Creator profiles
- Launch events (festival/fashion/beauty/clothing/wellness)
- Ticket tiers
- One live campaign + channel link

## 5) Deploy on Vercel
- Connect Git repo to Vercel.
- Add the same environment variables in Vercel.
- Redeploy.

## 6) Verify production endpoints
Check these endpoints after deploy:
- `GET /api/public/events`
- `GET /api/public/events/[slug]`
- `POST /api/track/click`
- `POST /api/integrations/tixr/webhook`
- `POST /api/payouts/clear`
- `POST /api/payouts/run`

## 7) Current backend-ready surfaces
Now DB-backed:
- Public marketplace (`/events`)
- Event details (`/events/[slug]`)
- Creator marketplace (`/app/marketplace`)
- Campaign builder event selection (`/app/builder`)

## 8) Recommended next (Phase 2)
- Move creator dashboard/campaign stats from mock to DB queries.
- Add auth-bound creator identity (replace session-cookie draft scope with user scope).
- Add scheduled payout jobs (Vercel cron or Trigger.dev).
