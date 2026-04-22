import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";

const EVENT_DATE = "TBD — check back soon";
const EVENT_LOCATION = "Austin, TX";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function renderTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
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

  const { registrationId } = body ?? {};
  if (!registrationId) return json({ error: "registrationId required" }, 400);

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return json({ error: "Resend not configured yet" }, 400);

  const { data: reg, error: regErr } = await supabase
    .from("event_registrations")
    .select("*")
    .eq("id", registrationId)
    .maybeSingle();
  if (regErr || !reg) return json({ error: "Registration not found" }, 404);

  const { data: tpl, error: tplErr } = await supabase
    .from("email_templates")
    .select("*")
    .eq("template_key", "confirmation")
    .eq("is_published", true)
    .maybeSingle();
  if (tplErr || !tpl) return json({ error: "Published template not found" }, 404);

  const vars = {
    first_name: reg.first_name,
    full_name: `${reg.first_name} ${reg.last_name}`,
    event_date: EVENT_DATE,
    event_location: EVENT_LOCATION,
  };

  const subject = renderTemplate(tpl.subject, vars);
  const html = renderTemplate(tpl.html, vars);
  const text = tpl.text_fallback ? renderTemplate(tpl.text_fallback, vars) : undefined;
  const from = Deno.env.get("RESEND_FROM_EMAIL") ??
    "The Alcan Summit <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      reply_to: "info@alcandentalcooperative.com",
      to: [reg.email],
      subject,
      html,
      ...(text ? { text } : {}),
    }),
  });
  const result = await res.json();

  if (!res.ok) {
    await supabase.from("email_sends").insert({
      template_key: "confirmation",
      template_version: tpl.version,
      recipient_email: reg.email,
      recipient_name: `${reg.first_name} ${reg.last_name}`,
      registration_id: reg.id,
      send_type: "production",
      status: "failed",
      error_message: JSON.stringify(result),
      sent_by: "admin",
    });
    return json({ error: "Send failed", details: result }, 500);
  }

  const messageId = result.id ?? null;
  await supabase.from("email_sends").insert({
    template_key: "confirmation",
    template_version: tpl.version,
    recipient_email: reg.email,
    recipient_name: `${reg.first_name} ${reg.last_name}`,
    registration_id: reg.id,
    resend_message_id: messageId,
    send_type: "production",
    status: "sent",
    sent_by: "admin",
  });
  await supabase.from("event_registrations").update({
    confirmation_email_sent_at: new Date().toISOString(),
    confirmation_email_id: messageId,
  }).eq("id", registrationId);

  return json({ success: true });
});
