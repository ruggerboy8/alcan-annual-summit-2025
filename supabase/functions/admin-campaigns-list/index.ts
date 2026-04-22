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

  const { data, error } = await supabase
    .from("email_campaigns")
    .select("id, name, subject, status, recipient_filter, recipient_count, sent_at, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return json({ error: error.message }, 500);
  return json({ campaigns: data ?? [] });
});
