import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";

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

  const { templateKey, recipientEmail } = body ?? {};
  if (!templateKey || !recipientEmail) {
    return json({ error: "templateKey and recipientEmail required" }, 400);
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return json({ error: "Resend not configured yet" }, 400);

  const { data: tpl, error: tplErr } = await supabase
    .from("email_templates")
    .select("*")
    .eq("template_key", templateKey)
    .maybeSingle();
  if (tplErr || !tpl) return json({ error: "Template not found" }, 404);

  const vars = {
    first_name: "Test",
    full_name: "Test User",
    event_date: "TBD",
    event_location: "Austin, TX",
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
      to: [recipientEmail],
      subject: `[TEST] ${subject}`,
      html,
      ...(text ? { text } : {}),
    }),
  });
  const result = await res.json();

  if (!res.ok) {
    await supabase.from("email_sends").insert({
      template_key: templateKey,
      template_version: tpl.version,
      recipient_email: recipientEmail,
      recipient_name: "Test User",
      send_type: "test",
      status: "failed",
      error_message: JSON.stringify(result),
      sent_by: "admin",
    });
    return json({ error: "Send failed", details: result }, 500);
  }

  await supabase.from("email_sends").insert({
    template_key: templateKey,
    template_version: tpl.version,
    recipient_email: recipientEmail,
    recipient_name: "Test User",
    resend_message_id: result.id ?? null,
    send_type: "test",
    status: "sent",
    sent_by: "admin",
  });

  return json({ success: true });
});
