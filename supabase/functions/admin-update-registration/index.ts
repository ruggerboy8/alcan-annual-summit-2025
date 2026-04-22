import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const EDITABLE_FIELDS = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "practice",
  "organization",
  "role",
] as const;

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

  const { registrationId, action, editFields } = body ?? {};
  if (!registrationId || typeof registrationId !== "string") {
    return json({ error: "registrationId required" }, 400);
  }

  if (action === "edit") {
    if (!editFields || typeof editFields !== "object") {
      return json({ error: "editFields required" }, 400);
    }
    const update: Record<string, unknown> = {};
    for (const key of EDITABLE_FIELDS) {
      if (key in editFields) {
        const v = editFields[key];
        update[key] = typeof v === "string" ? v.trim() : v;
      }
    }
    if (Object.keys(update).length === 0) {
      return json({ error: "No editable fields provided" }, 400);
    }
    if (typeof update.email === "string") {
      update.email = (update.email as string).toLowerCase();
    }
    const { data, error } = await supabase
      .from("event_registrations")
      .update(update)
      .eq("id", registrationId)
      .select("*")
      .single();
    if (error) return json({ error: error.message }, 400);
    return json({ success: true, registration: data });
  }

  if (action === "check-in") {
    const { data, error } = await supabase
      .from("event_registrations")
      .update({ checked_in_at: new Date().toISOString(), checked_in_by: "admin" })
      .eq("id", registrationId)
      .select("*")
      .single();
    if (error) return json({ error: error.message }, 400);
    return json({ success: true, registration: data });
  }

  if (action === "undo-check-in") {
    const { data, error } = await supabase
      .from("event_registrations")
      .update({ checked_in_at: null, checked_in_by: null })
      .eq("id", registrationId)
      .select("*")
      .single();
    if (error) return json({ error: error.message }, 400);
    return json({ success: true, registration: data });
  }

  if (action === "delete") {
    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("id", registrationId);
    if (error) return json({ error: error.message }, 400);
    return json({ success: true });
  }

  return json({ error: "Unknown action" }, 400);
});
