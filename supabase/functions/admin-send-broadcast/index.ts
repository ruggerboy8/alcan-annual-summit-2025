// Sends a broadcast campaign to filtered registrants. Supports dryRun for
// recipient counting / preview before the real send.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";
import { isValidEmail, renderTemplate, sendEmail } from "../_shared/email.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const EVENT_DATE = "December 11–12, 2026";
const EVENT_LOCATION = "Austin, TX";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type Filter = "all" | "staff" | "guests";

async function fetchRecipients(filter: Filter) {
  let query = supabase
    .from("event_registrations")
    .select("id, first_name, last_name, email, attendee_type")
    .eq("registration_status", "registered");
  if (filter === "staff") query = query.eq("attendee_type", "staff");
  if (filter === "guests") query = query.eq("attendee_type", "guest");
  const { data, error } = await query.limit(5000);
  if (error) throw new Error(error.message);
  return data ?? [];
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

  // Fetch campaign
  const { data: campaign, error: campaignErr } = await supabase
    .from("email_campaigns")
    .select("*")
    .eq("id", campaignId)
    .maybeSingle();
  if (campaignErr || !campaign) return json({ error: "Campaign not found" }, 404);
  if (campaign.status === "sent") {
    return json({ error: "Campaign already sent" }, 400);
  }

  // Fetch recipients
  let recipients: Array<{ id: string; first_name: string; last_name: string; email: string }>;
  try {
    recipients = await fetchRecipients(recipientFilter);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Query failed" }, 500);
  }

  let sent = 0;
  let failed = 0;
  const failures: Array<{ email: string; error: string }> = [];

  for (const r of recipients) {
    const vars = {
      first_name: r.first_name,
      full_name: `${r.first_name} ${r.last_name}`,
      event_date: EVENT_DATE,
      event_location: EVENT_LOCATION,
    };

    const recipientName = `${r.first_name} ${r.last_name}`;
    const logBase = {
      template_key: `campaign:${campaign.id}`,
      template_version: 1,
      recipient_email: r.email,
      recipient_name: recipientName,
      registration_id: r.id,
      send_type: "broadcast",
      sent_by: "admin",
    };

    if (!isValidEmail(r.email)) {
      failed++;
      failures.push({ email: r.email, error: "Invalid email address" });
      await supabase.from("email_sends").insert({
        ...logBase,
        status: "failed",
        error_message: "Invalid email address",
      });
      continue;
    }

    const subject = renderTemplate(campaign.subject, vars);
    const html = renderTemplate(campaign.html, vars);
    const text = campaign.text_fallback
      ? renderTemplate(campaign.text_fallback, vars)
      : null;

    const result = await sendEmail({
      to: r.email,
      subject,
      html,
      text,
      preheader: campaign.preheader,
    });

    if (result.ok) {
      sent++;
      await supabase.from("email_sends").insert({
        ...logBase,
        status: "sent",
        resend_message_id: result.messageId,
      });
    } else {
      failed++;
      failures.push({ email: r.email, error: result.error ?? "Unknown error" });
      await supabase.from("email_sends").insert({
        ...logBase,
        status: "failed",
        error_message: result.error ?? "Unknown error",
      });
    }

    // 100ms throttle between sends to avoid Resend rate limits
    await new Promise((r) => setTimeout(r, 100));
  }

  // Mark campaign sent
  await supabase
    .from("email_campaigns")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
      recipient_count: recipients.length,
      sent_by: "admin",
    })
    .eq("id", campaign.id);

  return json({
    sent,
    failed,
    failures: failures.slice(0, 25),
    total: recipients.length,
  });
});
