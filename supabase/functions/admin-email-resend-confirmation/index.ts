import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";
import { renderTemplate, sendEmail } from "../_shared/email.ts";

const EVENT_DATE = "December 10–11, 2026";
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
  const text = tpl.text_fallback ? renderTemplate(tpl.text_fallback, vars) : null;
  const preheader = tpl.preheader ? renderTemplate(tpl.preheader, vars) : null;

  const result = await sendEmail({
    to: reg.email,
    subject,
    html,
    text,
    preheader,
  });

  const recipientName = `${reg.first_name} ${reg.last_name}`;

  if (!result.ok) {
    await supabase.from("email_sends").insert({
      template_key: "confirmation",
      template_version: tpl.version,
      recipient_email: reg.email,
      recipient_name: recipientName,
      registration_id: reg.id,
      send_type: "production",
      status: "failed",
      error_message: result.error,
      sent_by: "admin",
    });
    return json({ error: result.error ?? "Send failed" }, 500);
  }

  await supabase.from("email_sends").insert({
    template_key: "confirmation",
    template_version: tpl.version,
    recipient_email: reg.email,
    recipient_name: recipientName,
    registration_id: reg.id,
    resend_message_id: result.messageId,
    send_type: "production",
    status: "sent",
    sent_by: "admin",
  });
  await supabase.from("event_registrations").update({
    confirmation_email_sent_at: new Date().toISOString(),
    confirmation_email_id: result.messageId,
  }).eq("id", registrationId);

  return json({ success: true });
});
