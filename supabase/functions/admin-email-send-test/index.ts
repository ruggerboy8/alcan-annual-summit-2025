import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";
import { renderTemplate, sendEmail } from "../_shared/email.ts";

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

  const { templateKey, recipientEmail } = body ?? {};
  if (!templateKey || !recipientEmail) {
    return json({ error: "templateKey and recipientEmail required" }, 400);
  }

  const { data: tpl, error: tplErr } = await supabase
    .from("email_templates")
    .select("*")
    .eq("template_key", templateKey)
    .maybeSingle();
  if (tplErr || !tpl) return json({ error: "Template not found" }, 404);

  const vars = {
    first_name: "Test",
    full_name: "Test User",
    event_date: "December 11–12, 2026",
    event_location: "Austin, TX",
  };
  const subject = renderTemplate(tpl.subject, vars);
  const html = renderTemplate(tpl.html, vars);
  const text = tpl.text_fallback ? renderTemplate(tpl.text_fallback, vars) : null;
  const preheader = tpl.preheader ? renderTemplate(tpl.preheader, vars) : null;

  const result = await sendEmail({
    to: recipientEmail,
    subject,
    html,
    text,
    preheader,
    testPrefix: true,
  });

  if (!result.ok) {
    await supabase.from("email_sends").insert({
      template_key: templateKey,
      template_version: tpl.version,
      recipient_email: recipientEmail,
      recipient_name: "Test User",
      send_type: "test",
      status: "failed",
      error_message: result.error,
      sent_by: "admin",
    });
    return json({ error: result.error ?? "Send failed" }, 500);
  }

  await supabase.from("email_sends").insert({
    template_key: templateKey,
    template_version: tpl.version,
    recipient_email: recipientEmail,
    recipient_name: "Test User",
    resend_message_id: result.messageId,
    send_type: "test",
    status: "sent",
    sent_by: "admin",
  });

  return json({ success: true });
});
