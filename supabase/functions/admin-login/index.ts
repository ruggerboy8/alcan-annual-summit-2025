const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { password } = await req.json();
    const adminPassword = Deno.env.get("ADMIN_DASHBOARD_PASSWORD");
    if (!adminPassword || password !== adminPassword) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
    const payload = JSON.stringify({ role: "admin", exp: expiresAt });
    const payloadB64 = btoa(payload);

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(adminPassword),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payloadB64),
    );
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    const token = `${payloadB64}.${sigB64}`;

    return new Response(JSON.stringify({ token, expiresAt }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
