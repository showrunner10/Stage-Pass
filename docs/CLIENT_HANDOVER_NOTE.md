# Stagepass Client Handover Note

Stagepass is delivered as a functional MVP SaaS foundation for a creator marketplace around live events.

## Delivered

- Public marketing pages and marketplace browse
- Event detail pages with launch catalogue fallback when the live database is empty
- Email/password authentication
- Google OAuth through Supabase Auth
- Creator application and contact form flows
- Creator dashboard shell, marketplace, campaign list, builder, earnings, profile, and settings surfaces
- Promoter/admin dashboard shell and event create/edit flows
- Campaign draft and publish APIs
- Click tracking endpoint and attribution foundations
- Tixr webhook, refund webhook, manual order import, and payout clear/run endpoints
- Production handover checklist and backend setup documentation

## Required Production Owner Actions

- Rotate all secrets before final public launch if they were ever exposed in chat, screenshots, recordings, or shared files.
- Set `NEXT_PUBLIC_APP_URL` in Vercel to the exact deployed Vercel URL you will share with the client, for example `https://your-project.vercel.app`.
- Configure Supabase Authentication URL settings:
  - Site URL: the same Vercel URL from `NEXT_PUBLIC_APP_URL`
  - Redirect URL: `<NEXT_PUBLIC_APP_URL>/api/auth/oauth/callback`
- Configure Google OAuth:
  - JavaScript origins: the same Vercel URL origin
  - Redirect URI: `https://<supabase-project-ref>.supabase.co/auth/v1/callback`
- Do not use `localhost` in Vercel, Supabase, or Google OAuth settings for the client demo.
- Run schema setup and seed data against the production Supabase database.
- Complete final smoke testing on the live deployment before inviting external users.

## Known Limitations Before Full Public Launch

- Stripe Connect live payout execution requires final production hardening.
- Some admin and creator reporting surfaces still contain prototype or fallback data paths.
- Wildcard creator subdomains are not fully production-finished.
- Production cron scheduling, monitoring, and alerting still need to be configured.
- A formal security review, accessibility audit, and full automated test suite have not been completed.

## Recommended Handover Wording

Stagepass is ready for MVP handover as a functional SaaS foundation. It should be treated as pre-launch software until production secrets are rotated, live OAuth is verified, payout operations are hardened, cron jobs are configured, and the remaining mock-backed reporting surfaces are replaced or accepted as MVP scope.
