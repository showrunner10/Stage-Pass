# Stagepass MVP Integrations Playbook

This playbook is the "do this next" list for your current PostgreSQL setup.

## 1) Database (you already have Postgres)
1. Ensure `DATABASE_URL` is set in `.env.local`.
2. Run:
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`
3. Optional seed later for events/campaign links.

## 2) Env secrets you must add now
Add these to `.env.local`:
- `TRACKING_HASH_SALT`
- `TIXR_WEBHOOK_SECRET`
- `ORDER_IMPORT_TOKEN`
- `PAYOUT_JOB_TOKEN`

Use `.env.example` as template.

## 3) APIs added in this repo
- `POST /api/track/click`
  - Purpose: write click events, dedupe 5-second repeated clicks, set attribution cookie.
  - Body: `{ "code": "channelLinkCode", "landingUrl": "https://..." }`

- `POST /api/integrations/tixr/webhook`
  - Purpose: ingest order events from Tixr, upsert order, create pending ledger.
  - Header: `x-stagepass-webhook-secret: <TIXR_WEBHOOK_SECRET>`

- `POST /api/orders/import`
  - Purpose: manual/no-API CSV JSON import path for MVP.
  - Header: `x-stagepass-import-token: <ORDER_IMPORT_TOKEN>`
  - Body: `{ "rows": [...] }`

- `POST /api/payouts/clear`
  - Purpose: clear pending ledger entries after 14-day window.
  - Header: `x-stagepass-job-token: <PAYOUT_JOB_TOKEN>`

- `POST /api/payouts/run`
  - Purpose: batch pay cleared entries (MVP mock payout executor).
  - Header: `x-stagepass-job-token: <PAYOUT_JOB_TOKEN>`

- `POST /api/integrations/tixr/refund`
  - Purpose: void pending commission on refunded order inside pending window.
  - Header: `x-stagepass-webhook-secret: <TIXR_WEBHOOK_SECRET>`

## 4) Tixr integration order (MVP)
1. Generate partner credentials.
2. Set webhook endpoint to `/api/integrations/tixr/webhook`.
3. Ensure checkout URL includes attribution params:
   - `campaign_id`
   - `creator_id`
   - `channel_link_code`
4. Send test order webhook and confirm:
   - `Order` is created.
   - `CommissionLedger` entry is `PENDING`.

## 5) Manual/CSV import flow (no API promoters)
1. Convert CSV rows to JSON payload.
2. Call `/api/orders/import`.
3. Validate order count and dashboard totals.

## 6) Weekly payout schedule (MVP)
Use a cron job (Trigger.dev/Inngest/Railway cron) to call:
- `/api/payouts/clear` daily
- `/api/payouts/run` weekly (Sunday) for cleared balances > $50.

## 7) What remains after this pass
- Stripe Connect live transfer job (actual `PAID` state updates)
- Refund/clawback automation
- Partner-specific webhooks for Moshtix/Humanitix
- Staff console for dispute operations
