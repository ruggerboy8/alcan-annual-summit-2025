import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { renderTemplate, sendEmail } from "../_shared/email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EVENT_VERSION = "v1-alcan-summit-2026";
const EVENT_DATE = "December 11–12, 2026";
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

async function sendConfirmationEmail(registration: {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}): Promise<void> {
  const { data: tpl, error: tplErr } = await supabase
    .from("email_templates")
    .select("*")
    .eq("template_key", "confirmation")
    .eq("is_published", true)
    .maybeSingle();

  if (tplErr || !tpl) {
    console.error("No published confirmation template found", tplErr);
    return;
  }

  const vars = {
    first_name: registration.first_name,
    full_name: `${registration.first_name} ${registration.last_name}`,
    event_date: EVENT_DATE,
    event_location: EVENT_LOCATION,
  };

  const subject = renderTemplate(tpl.subject, vars);
  const html = renderTemplate(tpl.html, vars);
  const text = tpl.text_fallback ? renderTemplate(tpl.text_fallback, vars) : null;
  const preheader = tpl.preheader ? renderTemplate(tpl.preheader, vars) : null;

  const result = await sendEmail({
    to: registration.email,
    subject,
    html,
    text,
    preheader,
  });

  const recipientName = `${registration.first_name} ${registration.last_name}`;

  if (!result.ok) {
    console.error("Resend error:", result.error);
    await supabase.from("email_sends").insert({
      template_key: "confirmation",
      template_version: tpl.version,
      recipient_email: registration.email,
      recipient_name: recipientName,
      registration_id: registration.id,
      send_type: "production",
      status: "failed",
      error_message: result.error,
      sent_by: "system",
    });
    return;
  }

  await supabase.from("email_sends").insert({
    template_key: "confirmation",
    template_version: tpl.version,
    recipient_email: registration.email,
    recipient_name: recipientName,
    registration_id: registration.id,
    resend_message_id: result.messageId,
    send_type: "production",
    status: "sent",
    sent_by: "system",
  });
  await supabase.from("event_registrations").update({
    confirmation_email_sent_at: new Date().toISOString(),
    confirmation_email_id: result.messageId,
  }).eq("id", registration.id);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (body.honeypot && String(body.honeypot).trim() !== "") {
    return json({ success: true });
  }

  const submittedAt = Number(body.submittedAt);
  if (!submittedAt || Date.now() - submittedAt < 3000) {
    return json({ error: "Too fast" }, 400);
  }

  const attendeeType = body.attendeeType;
  if (attendeeType !== "staff" && attendeeType !== "guest") {
    return json({ error: "Invalid attendee type" }, 400);
  }

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = body.phone ? String(body.phone).trim() : null;

  if (!firstName) return json({ error: "First name is required" }, 400);
  if (!lastName) return json({ error: "Last name is required" }, 400);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Valid email is required" }, 400);
  }

  let practice: string | null = null;
  let organization: string | null = null;
  let role: string | null = null;

  if (attendeeType === "staff") {
    practice = String(body.practice ?? "").trim();
    role = String(body.role ?? "").trim();
    if (!practice) return json({ error: "Practice is required" }, 400);
    if (!role) return json({ error: "Role is required" }, 400);
  } else {
    organization = String(body.organization ?? "").trim();
    role = String(body.role ?? "").trim();
    if (!organization) return json({ error: "Organization is required" }, 400);
    if (!role) return json({ error: "Role is required" }, 400);
  }

  const { data: existing } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("email", email)
    .eq("event_version", EVENT_VERSION)
    .maybeSingle();

  if (existing) {
    return json({ error: "This email is already registered." }, 409);
  }

  const { data: inserted, error: insertErr } = await supabase
    .from("event_registrations")
    .insert({
      attendee_type: attendeeType,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      practice,
      organization,
      role,
      registration_status: "registered",
      event_version: EVENT_VERSION,
    })
    .select("id, first_name, last_name, email")
    .single();

  if (insertErr || !inserted) {
    console.error("Insert failed:", insertErr);
    return json({ error: "Registration failed. Please try again." }, 500);
  }

  await sendConfirmationEmail(inserted);

  return json({ success: true });
});
