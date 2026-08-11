# Fix confirmation emails, broken hero image, and add promo code

## What I found

1. **Confirmation emails are not going out at all.** The confirmation template in the database is saved as a **draft** (`is_published = false`). The registration function only sends when a *published* template exists — it silently skips otherwise. That's why all 35 registrations show "no confirmation email."

2. **Broken image at the top of emails.** The email header points to `https://alcan-annual-meeting-2025.lovable.app/email-hero.png`, which **302-redirects** to `alcansummit.com` and is a **2.2 MB PNG**. Email clients (especially Gmail's image proxy) frequently drop redirected and oversized images — hence the broken-image icon.

3. Test sends have succeeded (6 test emails sent, no errors), so Resend itself is healthy.

## What I'll do

### 1. Fix the header image
- Create a properly sized, compressed header image (600px wide, ~100 KB) and host it in the public email assets storage bucket so the URL is direct, permanent, and has no redirect.
- Point the confirmation template and the email generator at that new URL, so every future email uses it too.
- Verify the URL loads as an image before/after the change.

### 2. Make automatic confirmation emails actually send
- Publish the current confirmation template (with the fixed image) so registrations start sending immediately.
- Add a safety net so this can't silently fail again: if no published template exists, the registration function records a failed row in the email log with a clear reason, and the Auto Email tab shows a visible warning banner when the confirmation template is unpublished.
- Send a test to you, then confirm with a real end-to-end test registration and delete the test row.

### 3. One-off catch-up email
- Build a new campaign in the Email > Compose & Send area titled something like "Countdown to The Summit," with copy along the lines of "Only ___ days until The Summit" plus the key details (Dec 10–11, 2026, Austin, TX) and a nod that this doubles as their confirmation.
- The day count will be rendered at send time, so it's always accurate.
- Since all current registrants are missing their confirmation, the existing "All registrants" audience covers exactly the right people — no new filtering needed.
- I'll leave it saved as a draft so you can review and hit send yourself.

### 4. Promo code on the registration form
- Add an optional **Promo Code** field to the registration form with the copy: "Have a sponsor promo code? Enter it here."
- Accepted code: `AlcanVIP2026` (case-insensitive, trimmed).
- Store the code on the registration record so it shows in the admin Registrations detail view and can be exported.
- In the admin dashboard, anyone with a valid promo code displays as **Sponsor** instead of "Team" or "Guest" — in the registrations list, the detail view, filters/counts, and check-in.
- Success screen copy: normal registrants see the standard confirmation; anyone who entered a valid sponsor code sees a warmer, gratitude-forward message thanking them for their sponsorship and support of The Summit.
- An invalid code does **not** block registration — it just doesn't unlock the sponsor message (no scary error).

## Technical notes

- Database: add a nullable `promo_code` column to `event_registrations` (migration; no backfill needed).
- `supabase/functions/register/index.ts`: accept and validate `promoCode`, persist it, return a `sponsor: true` flag for a valid code, and log a failed `email_sends` row when no published template is found.
- `src/components/RegistrationModal.tsx`: new optional field, zod schema entry, review row, and branched success copy.
- Image asset uploaded to the `email-assets` public bucket; `HERO_IMAGE_URL` in `admin-generate-email` and the stored confirmation template HTML both updated.
- `src/components/admin/AutoEmailTab.tsx`: unpublished-template warning banner.
