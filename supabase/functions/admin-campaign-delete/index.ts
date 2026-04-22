// Delete a draft campaign. Sent campaigns are immutable and cannot be deleted.

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
  if (!id) return json({ error: "id required" }, 400);

  const { data: existing, error: fetchErr } = await supabase
    .from("email_campaigns")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr) return json({ error: fetchErr.message }, 500);
  if (!existing) return json({ error: "Not found" }, 404);
  if (existing.status === "sent") {
    return json({ error: "Cannot delete a sent campaign — it's a permanent record." }, 400);
  }

  const { error } = await supabase
    .from("email_campaigns")
    .delete()
    .eq("id", id);

  if (error) return json({ error: error.message }, 500);
  return json({ success: true });
});
