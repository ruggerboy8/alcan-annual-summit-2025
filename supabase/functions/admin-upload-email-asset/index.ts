// Upload an image to the email-assets bucket and return its public URL.
// Accepts multipart/form-data with a `file` field.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]/g, "-").slice(-80);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (!(await verifyAdminToken(req))) return unauthorized();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ error: "Expected multipart/form-data" }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "file field required" }, 400);
  if (!ALLOWED.has(file.type)) {
    return json({ error: `Unsupported type ${file.type}. Use PNG, JPEG, WEBP, or GIF.` }, 400);
  }
  if (file.size > MAX_BYTES) {
    return json({ error: "File too large (max 10 MB)" }, 400);
  }

  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${ts}-${rand}-${safeName(file.name || "image")}`;

  const { error: upErr } = await supabase.storage
    .from("email-assets")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (upErr) {
    console.error("upload failed", upErr);
    return json({ error: upErr.message }, 500);
  }

  const { data: pub } = supabase.storage.from("email-assets").getPublicUrl(path);
  return json({
    url: pub.publicUrl,
    path,
    name: file.name,
    size: file.size,
    type: file.type,
  });
});
