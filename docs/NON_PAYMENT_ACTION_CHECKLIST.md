# Hypelist Non-Payment Action Checklist

Use this as the exact execution checklist before handover.

## A. Auth, Email, and Access

- [ ] Confirm email/password signup works
- [ ] Confirm Google login works
- [ ] Confirm email confirmation mail is branded correctly
- [ ] Confirm forgot-password code email arrives
- [ ] Confirm password reset works with the new password policy
- [ ] Confirm logout works
- [ ] Confirm admin/promoter access routes are protected correctly

## B. Database and Real Data

- [ ] Confirm [init.sql](/d:/Stage-Final/Stage-Pass/prisma/init.sql:1) has been run in Supabase
- [ ] Create at least 5 real events from `/admin/events/new`
- [ ] Ensure those events are set to `LIVE`
- [ ] Verify public marketplace loads real database events
- [ ] Verify creator builder selects real live events, not just preview/demo events

## C. Creator Flow

- [ ] Create a creator account from `/login`
- [ ] Confirm creator handle is saved correctly
- [ ] Confirm creator dashboard opens after login
- [ ] Open `/app/builder`
- [ ] Select a real live event
- [ ] Save draft
- [ ] Publish campaign successfully
- [ ] Open campaign detail after publish
- [ ] Check preview redirect
- [ ] Check preview landing page

## D. Admin Flow

- [ ] Open `/admin/dashboard`
- [ ] Open `/admin/events`
- [ ] Open `/admin/events/new`
- [ ] Open `/admin/creators`
- [ ] Open `/admin/payouts`
- [ ] Confirm event creation works
- [ ] Confirm promoter requests load
- [ ] Confirm creator approval UI works
- [ ] Confirm admin copy is clean and client-facing

## E. Tracking and Attribution Foundations

- [ ] Click a generated campaign link
- [ ] Confirm redirect route loads
- [ ] Confirm click tracking endpoint does not error
- [ ] Confirm Tixr/manual import test data can be ingested without breaking admin/creator views

## F. White-Label and Routing

- [ ] Confirm `/go/[creator]/[campaign]` preview route works
- [ ] Confirm `/c/[creator]/[campaign]` preview route works
- [ ] Confirm published campaign URLs are formatted correctly
- [ ] Note wildcard subdomain setup as a post-handover or deployment task if not completed

## G. UI and Professional Polish

- [ ] Remove or hide development-only bypass before final delivery
- [ ] Hard refresh and verify no internal/provider wording appears in client-facing auth flows
- [ ] Check password strength UI on signup and reset
- [ ] Check mobile layout for login, dashboard, builder, and marketplace
- [ ] Check footer, nav, and CTA spacing on desktop and mobile

## H. Security and Environment Hygiene

- [ ] Rotate exposed SMTP password
- [ ] Rotate exposed Google OAuth secret if it was shown publicly
- [ ] Rotate exposed Supabase service role key if it was shown publicly
- [ ] Rotate any webhook/job tokens that were exposed
- [ ] Make sure `.env` is not included in handover assets or repo commits

## I. Handover Package

- [ ] Provide client with app URLs
- [ ] Provide client with admin entry path
- [ ] Provide client with creator entry path
- [ ] Provide client with a list of environment variables
- [ ] Provide client with a known-limitations note
- [ ] Provide client with the non-payment status doc
- [ ] Provide client with a list of credentials they still need to own/replace

## J. Recommended Final Order

1. Finish auth and email verification.
2. Create real live events in admin.
3. Publish a real creator campaign end to end.
4. Verify admin pages and promoter request flow.
5. Check redirect/landing previews.
6. Do mobile/desktop UI sweep.
7. Rotate secrets.
8. Prepare handover package.
