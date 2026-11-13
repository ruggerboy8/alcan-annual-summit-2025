import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { verifyAdminToken } from "../_shared/admin-auth.ts";
import { manualRegistrationSchema, manualRegistrationRow } from "../_shared/manual-registration.ts";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (!(await verifyAdminToken(req))) return json({ error: "Unauthorized" }, 401);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const parsed = manualRegistrationSchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.issues.map((i) => i.message).join("; ") }, 400);
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return json({ error: "Registration service unavailable" }, 503);
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from("event_registrations")
      .insert(manualRegistrationRow(parsed.data)).select("*").single();
    if (error?.code === "23505") {
      // A retry of the same form submission returns the existing attendee.
      const { data: existing } = await supabase.from("event_registrations")
        .select("*").eq("id", parsed.data.id).eq("added_by_admin", true).maybeSingle();
      if (existing) return json({ success: true, registration: existing });
    }
    if (error) return json({ error: "Unable to add attendee. Please try again." }, 500);
    return json({ success: true, registration: data });
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
});