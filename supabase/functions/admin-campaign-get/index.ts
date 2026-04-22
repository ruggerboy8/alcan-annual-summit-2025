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

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "id required" }, 400);

  const { data, error } = await supabase
    .from("email_campaigns")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return json({ error: error.message }, 500);
  if (!data) return json({ error: "Not found" }, 404);
  return json({ campaign: data });
});
