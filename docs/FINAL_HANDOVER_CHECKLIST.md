# Stagepass Final Handover Checklist

Last updated: 2026-05-21

This checklist is the final production handover guide for the current Stagepass build. Follow this in order before client delivery.

## 1. Current Status

Working now:
- Public site pages
- Creator auth with email/password
- Google OAuth via Supabase
- Creator dashboard shell
- Public marketplace APIs
- Admin event create/edit API
- Campaign draft + publish flow
- Click tracking endpoint
- Tixr webhook + refund webhook
- Manual order import endpoint
- Payout clear/run mock endpoints

Important limitations still present:
- Some creator/admin dashboard surfaces still use fallback/mock data
- Stripe Connect live payouts are not fully integrated
- White-label landing page and shortlink routes are still mock-data based
- No production cron scheduling is configured yet
- No full automated test suite

## 2. Secrets To Rotate Before Final Handover

Rotate these immediately before production handover if they were ever shared in chat, screenshots, or screen recordings:

- Google OAuth client secret
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- `TRACKING_HASH_SALT`
- `TIXR_WEBHOOK_SECRET`
- `ORDER_IMPORT_TOKEN`
- `PAYOUT_JOB_TOKEN`
- SMTP password / app password

After rotation, update all environments in:
- Local `.env.local`
- Vercel project environment variables
- Supabase provider settings
- Any cron/service platform using these values

## 3. Environment Variables

These must exist in production:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
TRACKING_HASH_SALT=
TIXR_WEBHOOK_SECRET=
ORDER_IMPORT_TOKEN=
PAYOUT_JOB_TOKEN=
NEXT_PUBLIC_APP_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
SUPPORT_INBOX=
```

Production values:
- `NEXT_PUBLIC_APP_URL` should be the live app URL
- Example: `https://www.stagepass.com`

## 4. Supabase Setup

### 4.1 Auth
- Confirm Google provider is enabled
- Confirm correct Google Client ID is set
- Confirm correct Google Client Secret is set
- Confirm email/password auth is enabled
- Confirm redirect flow works from live domain

### 4.2 Database
Run before launch:

```bash
npm.cmd run db:push
npm.cmd run prisma:generate
npm.cmd run db:seed
```

Health check:
- `GET /api/health/db`

## 5. Google OAuth Setup

In Google Cloud OAuth Client:

### Authorized JavaScript origins
- `http://localhost:3000`
- `https://stagepass.com`
- `https://www.stagepass.com`

### Authorized redirect URIs
- `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`

Notes:
- The redirect URI must match Supabase callback exactly
- If OAuth consent screen is in Testing mode, add the required test users

## 6. Vercel Setup

### 6.1 Project settings
- Add all environment variables
- Redeploy after env updates

### 6.2 Build checks
Run locally before final deploy:

```bash
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

## 7. Domain + DNS

For production launch:
- Connect main domain in Vercel
- Point `stagepass.com` and `www.stagepass.com`
- Update `NEXT_PUBLIC_APP_URL` to production domain

If subdomain creator pages are required for launch:
- Configure wildcard DNS
- Add middleware/proxy routing strategy for `*.stage.page`

Current note:
- Wildcard creator subdomains are not fully production-finished yet

## 8. Tixr Integration

### Required production checks
- Confirm partner credentials
- Confirm checkout URLs include attribution params
- Confirm webhook endpoint is reachable
- Confirm refund webhook endpoint is reachable

### Endpoints
- `POST /api/integrations/tixr/webhook`
- `POST /api/integrations/tixr/refund`

### Required headers
- `x-stagepass-webhook-secret: <TIXR_WEBHOOK_SECRET>`

### Minimum validation
- Test order creates `Order`
- Test attributed order creates `CommissionLedger`
- Test refund reverses pending commission

## 9. Manual Import Flow

For non-API promoters:
- Convert CSV rows into JSON
- Send to `POST /api/orders/import`
- Use header:

```txt
x-stagepass-import-token: <ORDER_IMPORT_TOKEN>
```

## 10. Payout Jobs

Current state:
- Clear and payout endpoints exist
- Payout execution is still mock/live-hybrid and needs production handling review

Endpoints:
- `POST /api/payouts/clear`
- `POST /api/payouts/run`

Header:

```txt
x-stagepass-job-token: <PAYOUT_JOB_TOKEN>
```

Production setup needed:
- Daily job for clear
- Weekly job for payout run
- Final Stripe Connect implementation review before launch

Recommended platforms:
- Vercel Cron
- Trigger.dev
- Inngest

## 11. SMTP / Email

Confirm working:
- Creator application emails
- Contact form emails
- Password reset flow

Do a live test using:
- `POST /api/admin/email/test`

## 12. Final QA Before Handover

### Auth
- Email signup works
- Email login works
- Google login works
- Logout works
- Reset password works

### Creator app
- `/app/dashboard`
- `/app/marketplace`
- `/app/builder`
- `/app/profile`
- `/app/settings`

### Admin
- `/admin/dashboard`
- `/admin/events`
- `/admin/events/new`
- `/admin/events/[id]`

### API smoke tests
- `/api/health/db`
- `/api/public/events`
- `/api/public/events/[slug]`
- `/api/track/click`
- `/api/integrations/tixr/webhook`
- `/api/orders/import`
- `/api/payouts/clear`
- `/api/payouts/run`

## 13. Known Non-Launch-Safe Areas

These should be clearly disclosed if handing over immediately:
- Creator dashboard still has some fallback/mock content paths
- Admin dashboard/creators/payouts are not fully production-data complete
- Stripe live payout operations need final production implementation validation
- Creator white-label live subdomain flow is not fully finished
- No full monitoring/alerting setup shown yet
- No formal penetration test / full accessibility audit completed yet

## 14. Recommended Client Handover Wording

Use this wording if needed:

> Stagepass is delivered as a functional MVP foundation with working auth, marketplace, campaign publishing, click tracking, Tixr ingestion, and core admin/event setup. Before full public launch, production secrets rotation, payout hardening, cron setup, and final QA on remaining mock-backed surfaces should be completed.

## 15. Final Owner Actions

Before handing over:
- Rotate all exposed secrets
- Save final production env values in client-controlled vault
- Confirm client has access to:
  - Vercel
  - Supabase
  - Google Cloud
  - Domain/DNS
  - Tixr partner account
  - SMTP/email provider
- Deliver this checklist with the repo

