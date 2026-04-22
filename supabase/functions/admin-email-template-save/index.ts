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

  const { templateKey, subject, html, textFallback, publish } = body ?? {};
  if (!templateKey || typeof templateKey !== "string") {
    return json({ error: "templateKey required" }, 400);
  }
  if (!subject || typeof subject !== "string") {
    return json({ error: "subject required" }, 400);
  }
  if (!html || typeof html !== "string") {
    return json({ error: "html required" }, 400);
  }

  const { data: existing } = await supabase
    .from("email_templates")
    .select("version")
    .eq("template_key", templateKey)
    .maybeSingle();

  const nextVersion = existing ? (existing.version ?? 1) + 1 : 1;

  const { data, error } = await supabase
    .from("email_templates")
    .upsert({
      template_key: templateKey,
      version: nextVersion,
      subject,
      html,
      text_fallback: textFallback ?? null,
      is_published: !!publish,
      updated_at: new Date().toISOString(),
    }, { onConflict: "template_key" })
    .select("*")
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ success: true, template: data });
});
