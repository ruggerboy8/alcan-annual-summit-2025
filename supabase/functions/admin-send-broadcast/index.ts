// Sends a broadcast campaign to filtered registrants.
//
// Works in bounded batches and claims each recipient in the database BEFORE
// calling Resend, so the send is resumable and cannot duplicate mail.
//
// Why: Supabase caps edge functions at 150s (free) / 400s (paid). Each
// recipient costs roughly 350-600ms (Resend round-trip, a log write, and a
// deliberate throttle), so a single invocation cannot carry a large list. The
// previous version looped every recipient in one call and only marked the
// campaign 'sent' afterwards, so a timeout left some mail delivered, the
// campaign still marked 'draft', and the operator looking at "Send failed" —
// and a retry mailed everyone a second time.
//
// The caller is expected to invoke this repeatedly until `done` is true.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";
import { isValidEmail, renderTemplate, sendEmail } from "../_shared/email.ts";
import {
  campaignKey,
  pendingRecipients,
  planBatch,
  type Recipient,
} from "../_shared/broadcast.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const EVENT_VERSION = "v1-alcan-summit-2026";
const EVENT_DATE = "December 10–11, 2026";
const EVENT_LOCATION = "Austin, TX";

// Recipients handled per invocation. Sized so a batch finishes comfortably
// inside the 150s free-tier wall clock even at the slow end of the range:
// 60 x 800ms is about 48s, leaving generous headroom.
const BATCH_LIMIT = 60;

// Throttle between sends so Resend's rate limit is not tripped.
const SEND_THROTTLE_MS = 100;

// Written into the claim row between claiming a recipient and learning the
// outcome. If the isolate dies in that window the row stays 'failed', which is
// the safe direction: the address is not retried, so nobody is mailed twice.
const IN_FLIGHT = "Send started but not confirmed (interrupted before result)";

// Summit start in Austin, TX (CST, UTC-6). Used to render a live
// "days until" countdown inside campaign emails at send time.
const SUMMIT_START = new Date("2026-12-10T00:00:00-06:00");
function daysUntilSummit(): number {
  const ms = SUMMIT_START.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type Filter = "all" | "staff" | "guests";

async function fetchRecipients(filter: Filter): Promise<Recipient[]> {
  let query = supabase
    .from("event_registrations")
    .select("id, first_name, last_name, email, attendee_type")
    // Without this a future event's broadcast would also mail everyone who
    // registered for a previous one.
    .eq("event_version", EVENT_VERSION)
    .eq("registration_status", "registered");
  if (filter === "staff") query = query.eq("attendee_type", "staff");
  if (filter === "guests") query = query.eq("attendee_type", "guest");
  const { data, error } = await query.limit(5000);
  if (error) throw new Error(error.message);
  return (data ?? []) as Recipient[];
}

/** Every address already claimed for this campaign, whatever its outcome. */
async function fetchClaimedEmails(key: string): Promise<string[]> {
  const out: string[] = [];
  const page = 1000;
  for (let from = 0; ; from += page) {
    const { data, error } = await supabase
      .from("email_sends")
      .select("recipient_email")
      .eq("template_key", key)
      .eq("send_type", "broadcast")
      .range(from, from + page - 1);
    if (error) throw new Error(error.message);
    const batch = data ?? [];
    out.push(...batch.map((r: { recipient_email: string }) => r.recipient_email));
    if (batch.length < page) break;
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (!(await verifyAdminToken(req))) return unauthorized();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const campaignId = String(body?.campaignId ?? "");
  const recipientFilter = body?.recipientFilter as Filter;
  const dryRun = !!body?.dryRun;

  if (!["all", "staff", "guests"].includes(recipientFilter)) {
    return json({ error: "recipientFilter must be all|staff|guests" }, 400);
  }

  // Dry run: count + preview, no campaignId required
  if (dryRun) {
    try {
      const recipients = await fetchRecipients(recipientFilter);
      return json({
        count: recipients.length,
        preview: recipients.slice(0, 5).map((r) => ({
          name: `${r.first_name} ${r.last_name}`,
          email: r.email,
        })),
      });
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : "Query failed" }, 500);
    }
  }

  if (!campaignId) return json({ error: "campaignId required" }, 400);

  const { data: campaign, error: campaignErr } = await supabase
    .from("email_campaigns")
    .select("*")
    .eq("id", campaignId)
    .maybeSingle();
  if (campaignErr || !campaign) return json({ error: "Campaign not found" }, 404);
  if (campaign.status === "sent") {
    return json({ error: "Campaign already sent" }, 400);
  }

  const key = campaignKey(campaign.id);

  let recipients: Recipient[];
  let claimedEmails: string[];
  try {
    recipients = await fetchRecipients(recipientFilter);
    claimedEmails = await fetchClaimedEmails(key);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Query failed" }, 500);
  }

  const pending = pendingRecipients(recipients, claimedEmails);
  const { batch, remaining, done } = planBatch(pending, BATCH_LIMIT);

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  const failures: Array<{ email: string; error: string }> = [];

  for (const r of batch) {
    const recipientName = `${r.first_name} ${r.last_name}`;

    // Claim first. The partial unique index on
    // (template_key, lower(recipient_email)) WHERE send_type='broadcast'
    // makes this atomic, so a concurrent invocation or an earlier interrupted
    // run cannot lead to the same address being mailed twice.
    const { data: claim, error: claimErr } = await supabase
      .from("email_sends")
      .insert({
        template_key: key,
        template_version: 1,
        recipient_email: r.email,
        recipient_name: recipientName,
        registration_id: r.id,
        send_type: "broadcast",
        sent_by: "admin",
        status: "failed",
        error_message: IN_FLIGHT,
      })
      .select("id")
      .maybeSingle();

    if (claimErr || !claim) {
      // Unique violation means somebody else already owns this recipient.
      skipped++;
      continue;
    }

    if (!isValidEmail(r.email)) {
      failed++;
      failures.push({ email: r.email, error: "Invalid email address" });
      await supabase
        .from("email_sends")
        .update({ status: "failed", error_message: "Invalid email address" })
        .eq("id", claim.id);
      continue;
    }

    const vars = {
      first_name: r.first_name,
      full_name: recipientName,
      event_date: EVENT_DATE,
      event_location: EVENT_LOCATION,
      days_until_summit: String(daysUntilSummit()),
    };

    const result = await sendEmail({
      to: r.email,
      subject: renderTemplate(campaign.subject, vars),
      html: renderTemplate(campaign.html, vars),
      text: campaign.text_fallback ? renderTemplate(campaign.text_fallback, vars) : null,
      preheader: campaign.preheader,
    });

    if (result.ok) {
      sent++;
      await supabase
        .from("email_sends")
        .update({
          status: "sent",
          error_message: null,
          resend_message_id: result.messageId,
        })
        .eq("id", claim.id);
    } else {
      failed++;
      failures.push({ email: r.email, error: result.error ?? "Unknown error" });
      await supabase
        .from("email_sends")
        .update({ status: "failed", error_message: result.error ?? "Unknown error" })
        .eq("id", claim.id);
    }

    await new Promise((res) => setTimeout(res, SEND_THROTTLE_MS));
  }

  if (done) {
    // recipient_count reflects mail that actually went out, not the size of the
    // list we started from.
    const { count } = await supabase
      .from("email_sends")
      .select("id", { count: "exact", head: true })
      .eq("template_key", key)
      .eq("send_type", "broadcast")
      .eq("status", "sent");

    await supabase
      .from("email_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        recipient_count: count ?? 0,
        sent_by: "admin",
      })
      .eq("id", campaign.id);
  }

  return json({
    sent,
    failed,
    skipped,
    processed: batch.length,
    remaining,
    done,
    total: recipients.length,
    failures: failures.slice(0, 25),
  });
});
