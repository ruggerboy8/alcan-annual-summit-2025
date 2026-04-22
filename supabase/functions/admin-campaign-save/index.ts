// Create or update a draft campaign. Sent campaigns are immutable.

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

  const id = body?.id ? String(body.id) : null;
  const name = String(body?.name ?? "").trim() || "Untitled draft";
  const prompt = body?.prompt ? String(body.prompt) : null;
  const subject = String(body?.subject ?? "").trim();
  const preheader = body?.preheader ? String(body.preheader) : null;
  const html = String(body?.html ?? "");
  const textFallback = body?.text_fallback ? String(body.text_fallback) : null;
  const recipientFilter = body?.recipient_filter ?? "all";

  if (!subject) return json({ error: "subject required" }, 400);
  if (!html) return json({ error: "html required" }, 400);
  if (!["all", "staff", "guests"].includes(recipientFilter)) {
    return json({ error: "recipient_filter must be all|staff|guests" }, 400);
  }

  if (id) {
    // Update existing draft (block edits to sent campaigns)
    const { data: existing } = await supabase
      .from("email_campaigns")
      .select("status")
      .eq("id", id)
      .maybeSingle();
    if (!existing) return json({ error: "Not found" }, 404);
    if (existing.status === "sent") {
      return json({ error: "Cannot edit a sent campaign" }, 400);
    }
    const { data, error } = await supabase
      .from("email_campaigns")
      .update({
        name,
        prompt,
        subject,
        preheader,
        html,
        text_fallback: textFallback,
        recipient_filter: recipientFilter,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) return json({ error: error.message }, 500);
    return json({ campaign: data });
  }

  const { data, error } = await supabase
    .from("email_campaigns")
    .insert({
      name,
      prompt,
      subject,
      preheader,
      html,
      text_fallback: textFallback,
      recipient_filter: recipientFilter,
      status: "draft",
    })
    .select("*")
    .single();
  if (error) return json({ error: error.message }, 500);
  return json({ campaign: data });
});
