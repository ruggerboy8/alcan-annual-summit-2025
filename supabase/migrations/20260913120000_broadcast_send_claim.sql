-- Make broadcast sends idempotent at the database level.
--
-- admin-send-broadcast loops recipients serially inside a single edge function
-- invocation. Supabase caps edge functions at 150s (free) / 400s (paid), and
-- each recipient costs roughly 350-600ms, so a large list runs out of time
-- partway through. The campaign was only marked 'sent' AFTER the loop, so a
-- timeout left it looking unsent while some mail had already gone out, and a
-- retry re-sent to everyone. Two admins clicking Send at once had the same
-- effect. Nothing in the schema prevented it.
--
-- This index turns "has this campaign already been sent to this address" into
-- an atomic claim: the function inserts its log row BEFORE calling Resend, so a
-- duplicate attempt is rejected by Postgres rather than racing in application
-- code. It is deliberately partial and scoped to broadcast rows, so ordinary
-- confirmation and test sends are unaffected -- those legitimately repeat to
-- the same address.
--
-- Safe to apply: at the time of writing there are zero rows with
-- send_type = 'broadcast' (the 2026-08-11 campaign predates 'broadcast' being
-- an allowed send_type, so every one of its log inserts silently violated the
-- old CHECK constraint and was discarded). Nothing can conflict.

CREATE UNIQUE INDEX IF NOT EXISTS email_sends_broadcast_claim_idx
  ON public.email_sends (template_key, lower(recipient_email))
  WHERE send_type = 'broadcast';

COMMENT ON INDEX public.email_sends_broadcast_claim_idx IS
  'One broadcast send per (campaign, email). Lets admin-send-broadcast claim a '
  'recipient atomically before sending, so timeouts and concurrent invocations '
  'resume instead of duplicating mail.';
