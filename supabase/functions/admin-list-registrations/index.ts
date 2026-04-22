import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";

const EVENT_VERSION = "v1-alcan-summit-2026";

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

const SORT_COLUMNS: Record<string, string> = {
  name: "first_name",
  email: "email",
  type: "attendee_type",
  created_at: "created_at",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!(await verifyAdminToken(req))) return unauthorized();

  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "all";
  const search = url.searchParams.get("search")?.trim() ?? "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    500,
    Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "25", 10) || 25),
  );
  const sortKey = url.searchParams.get("sort") ?? "created_at";
  const sortDir = url.searchParams.get("sortDir") === "asc" ? "asc" : "desc";
  const sortColumn = SORT_COLUMNS[sortKey] ?? "created_at";

  let query = supabase
    .from("event_registrations")
    .select("*", { count: "exact" })
    .eq("event_version", EVENT_VERSION);

  if (type === "staff" || type === "guest") {
    query = query.eq("attendee_type", type);
  }

  if (search) {
    const safe = search.replace(/[%,]/g, "");
    query = query.or(
      `first_name.ilike.%${safe}%,last_name.ilike.%${safe}%,email.ilike.%${safe}%,practice.ilike.%${safe}%,organization.ilike.%${safe}%`,
    );
  }

  query = query.order(sortColumn, { ascending: sortDir === "asc" });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data: registrations, count, error } = await query;
  if (error) {
    console.error("List registrations error:", error);
    return json({ error: "Failed to fetch registrations" }, 500);
  }

  // Stats — separate query, no pagination
  const { data: statRows, error: statErr } = await supabase
    .from("event_registrations")
    .select("attendee_type, registration_status, confirmation_email_sent_at, checked_in_at")
    .eq("event_version", EVENT_VERSION);

  if (statErr) {
    console.error("Stats query error:", statErr);
  }

  const rows = statRows ?? [];
  const stats = {
    total: rows.length,
    staff: rows.filter((r) => r.attendee_type === "staff").length,
    guests: rows.filter((r) => r.attendee_type === "guest").length,
    checkedIn: rows.filter((r) => r.checked_in_at !== null).length,
    emailSent: rows.filter((r) => r.confirmation_email_sent_at !== null).length,
  };

  return json({
    registrations: registrations ?? [],
    total: count ?? 0,
    page,
    pageSize,
    stats,
  });
});
