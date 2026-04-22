// AI broadcast-email composer. Calls the Lovable AI Gateway and returns
// structured { subject, preheader, html, text_fallback }.

import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const SYSTEM_PROMPT = `You write marketing/transactional HTML emails for "The Alcan Summit 2026".

EVENT CONTEXT
- The Alcan Summit 2026 is the annual gathering for Alcan Dental Cooperative — a network of pediatric dental practices.
- Two days: December 11–12, 2026, in Austin, TX.
- Tone: warm, energetic, human, slightly aspirational. Mountain-climbing metaphors are welcome (ascent, summit, base camp, the climb) but used sparingly. Never corporate or stiff.
- Brand colors: navy #124570 (primary), gold #C49A3C (accent). Background should be white or near-white.

EMAIL HTML REQUIREMENTS
- Table-based layout for maximum email client compatibility (use <table>, <tr>, <td>; avoid flex/grid).
- Inline styles only — no <style> blocks, no external CSS.
- Mobile-friendly: a single 600px-wide centered table is fine; rely on inline width and font sizes.
- Include a hidden preheader div immediately after <body> using:
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">PREHEADER TEXT</div>
- Use the brand navy for headings and accent links/buttons; gold for small accents (rules, badges).
- Use system-friendly fonts: Georgia, "Times New Roman", serif for headings is fine; -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif for body.
- Sign off as "The Alcan Summit Team".
- Available merge variables (use them where natural):
  {{first_name}} — recipient first name
  {{event_date}} — "December 11–12, 2026"
  {{event_location}} — "Austin, TX"

OUTPUT
You MUST call the tool "compose_email" exactly once with all four fields populated:
- subject: a punchy, specific subject line (no emojis unless prompt requests them)
- preheader: 60–110 characters, complements the subject, never repeats it verbatim
- html: complete <html><body>…</body></html> document including the hidden preheader div
- text_fallback: plain-text version with paragraph breaks; should mirror the email's content
`;

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

  const prompt = String(body?.prompt ?? "").trim();
  const recipientType = body?.recipientType;
  if (!prompt) return json({ error: "prompt required" }, 400);
  if (!["all", "staff", "guests"].includes(recipientType)) {
    return json({ error: "recipientType must be all|staff|guests" }, 400);
  }

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "LOVABLE_API_KEY not configured" }, 500);

  const audienceLine = recipientType === "staff"
    ? "Audience: internal Alcan team members (staff). Tone can be familiar, insider-y, energetic."
    : recipientType === "guests"
    ? "Audience: outside guests (industry partners, vendors, friends of Alcan). Tone is welcoming and slightly more polished; explain context where useful."
    : "Audience: all registrants (Alcan staff + outside guests). Tone is warm and inclusive; assume mixed familiarity.";

  const userMessage =
    `${audienceLine}\n\nWrite the email based on this brief from the team:\n\n"""${prompt}"""`;

  let res: Response;
  try {
    res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "compose_email",
              description: "Return the composed email parts.",
              parameters: {
                type: "object",
                properties: {
                  subject: { type: "string" },
                  preheader: { type: "string" },
                  html: { type: "string" },
                  text_fallback: { type: "string" },
                },
                required: ["subject", "preheader", "html", "text_fallback"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "compose_email" } },
      }),
    });
  } catch (err) {
    console.error("AI gateway fetch failed:", err);
    return json({ error: "AI service unreachable" }, 502);
  }

  if (res.status === 429) {
    return json({ error: "AI is rate-limited right now. Please try again in a moment." }, 429);
  }
  if (res.status === 402) {
    return json({ error: "AI credits exhausted — add credits in Lovable workspace." }, 402);
  }
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    console.error("AI gateway error:", res.status, t);
    return json({ error: "AI generation failed" }, 500);
  }

  const data = await res.json().catch(() => null);
  const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
  const argsRaw = toolCall?.function?.arguments;

  if (!argsRaw) {
    // Surface raw text so frontend can show something useful
    const fallbackText = data?.choices?.[0]?.message?.content ?? "";
    return json({
      error: "AI did not return a structured response",
      raw: fallbackText,
    }, 502);
  }

  let parsed: { subject?: string; preheader?: string; html?: string; text_fallback?: string };
  try {
    parsed = typeof argsRaw === "string" ? JSON.parse(argsRaw) : argsRaw;
  } catch {
    return json({ error: "Could not parse AI response", raw: argsRaw }, 502);
  }

  if (!parsed.subject || !parsed.html) {
    return json({ error: "AI response missing subject or html", raw: parsed }, 502);
  }

  return json({
    subject: parsed.subject,
    preheader: parsed.preheader ?? "",
    html: parsed.html,
    text_fallback: parsed.text_fallback ?? "",
  });
});
