// AI broadcast-email composer. Calls the Lovable AI Gateway and returns
// structured { subject, preheader, html, text_fallback }.

import { corsHeaders, unauthorized, verifyAdminToken } from "../_shared/admin-auth.ts";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const SYSTEM_PROMPT = `You are an email designer writing HTML emails for "The Alcan Summit 2026".

==================================================
EVENT CONTEXT
==================================================
- The Alcan Summit 2026 is the annual gathering for Alcan Dental Cooperative — a network of pediatric dental practices.
- Two days: December 11–12, 2026, in Austin, TX.
- Voice: warm, energetic, human, slightly aspirational. Mountain-climbing/expedition metaphors are part of the brand vocabulary (ascent, summit, base camp, the climb, pitch, ridge, the view) — use them naturally and sparingly. Never corporate or stiff.
- Sign off as "The Alcan Summit Team".

==================================================
DESIGN SYSTEM — "BOLD MOUNTAIN EXPEDITION"
==================================================
This is the most important section. Generic, beige, corporate emails are FAILURE. Every email should feel like an expedition dispatch — confident, image-forward, with strong contrast and a sense of altitude.

COLOR PALETTE (use exactly):
- Navy (primary):           #124570
- Navy deep (hero bg):      #0B2D4A
- Gold (accent):            #C49A3C
- Gold soft (highlights):   #E6C77A
- Off-white (body bg):      #F7F4EE  (warm, paper-like — NEVER pure white)
- Card white:               #FFFFFF
- Ink (body text):          #1A2330
- Muted text:               #5A6573
- Hairline rule:            #E3DCCB

LAYOUT RULES:
- Outer wrapper: full-width <table> with bgcolor="#F7F4EE".
- Inner content: 600px centered <table> (use width="600" and inline style="max-width:600px").
- Use bgcolor attributes AND inline background-color for Outlook compatibility.
- Use cellpadding="0" cellspacing="0" border="0" on every table.
- Single column, generous vertical rhythm. Padding between sections: 32px–48px.

REQUIRED STRUCTURAL ELEMENTS (use as building blocks; mix to fit the brief):

1) HERO BAND (almost always include unless it's a tiny one-liner email)
   - Full 600px-wide <td> with bgcolor="#0B2D4A" (navy deep)
   - Padding: 48px 40px
   - Optional small gold eyebrow label in uppercase tracked-out text:
     <div style="font-family:Georgia,serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C49A3C;margin-bottom:16px;">DISPATCH FROM BASE CAMP</div>
   - Big headline in white serif: font-family:Georgia,"Times New Roman",serif; font-size:34px; line-height:1.15; color:#FFFFFF; font-weight:normal; letter-spacing:-0.5px;
   - Headlines should be evocative — "The ascent begins in 21 days" not "Event reminder"
   - If a hero image URL was provided, place it INSIDE the navy hero as a banner above the headline (width 600, full-bleed, max-height 280px, object-fit cover via height attribute).

2) GOLD RULE DIVIDER (use between major sections):
   <div style="width:48px;height:2px;background-color:#C49A3C;margin:0 auto;"></div>
   Or full-width: <hr style="border:none;border-top:1px solid #E3DCCB;margin:0;">

3) BODY SECTIONS:
   - White card on the off-white page (bgcolor="#FFFFFF", padding 40px)
   - Body text: font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; color:#1A2330;
   - Subheads: serif (Georgia), 22px, color #124570
   - First paragraph can be slightly larger (17–18px) as a lede

4) GOLD CTA BUTTON (when there's an action):
   <table cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;"><tr><td bgcolor="#C49A3C" style="border-radius:2px;">
     <a href="URL" style="display:inline-block;padding:14px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#0B2D4A;text-decoration:none;">BUTTON LABEL</a>
   </td></tr></table>
   Square corners (2px radius max). NEVER use rounded pill buttons.

5) PULL QUOTE / CALLOUT (optional, for emphasis):
   - Left border 3px solid #C49A3C
   - Padding 8px 0 8px 20px
   - Italic Georgia 18px, color #124570

6) FOOTER:
   - bgcolor="#0B2D4A" navy deep, padding 32px 40px, text color #E3DCCB
   - Small uppercase eyebrow: "THE ALCAN SUMMIT — AUSTIN, TX — DEC 11–12, 2026" (color:#C49A3C, font-size:10px, letter-spacing:2px)
   - Sign-off line in white serif italic
   - Tiny print muted text-align center, font-size:11px, color:#8A95A5: "You're receiving this because you registered for The Alcan Summit 2026."
   - Reply-to-unsubscribe line: "To stop receiving these emails, reply with 'unsubscribe' in the subject."

TYPOGRAPHY RULES (strict):
- Headlines & subheads: Georgia, "Times New Roman", serif. Always.
- Body & UI: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif.
- Eyebrow labels & button text: uppercase, letter-spacing 1–3px, sans-serif.
- Never use Comic Sans, Impact, or default browser fonts.

SPACING & RHYTHM:
- Section padding: 40–48px top/bottom inside cards.
- Paragraph spacing: 16px between <p>.
- Headlines: 24px below.
- The email should breathe. Never crowded.

WHAT MAKES IT NOT-STALE (CRITICAL):
- Off-white paper background, NEVER pure white.
- A navy hero band with a gold eyebrow label and a serif headline is the signature opening.
- Gold accent rule (small 48px line) between sections — like a typographic ornament.
- Big confident serif headlines, not bold sans-serif corporate junk.
- Plenty of negative space.
- One clear CTA per email; multiple CTAs only if they are equally important.
- Short paragraphs (2–4 lines max). Punchy sentences.
- One occasional climbing metaphor lands hard; ten is exhausting.

==================================================
EMAIL HTML TECHNICAL REQUIREMENTS
==================================================
- Doctype: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
- <html xmlns="http://www.w3.org/1999/xhtml">
- <head> contains only <meta charset>, <meta viewport>, <title>. NO <style> blocks. NO external CSS.
- <body style="margin:0;padding:0;background-color:#F7F4EE;">
- IMMEDIATELY after <body>, insert hidden preheader:
  <div style="display:none;font-size:1px;color:#F7F4EE;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">PREHEADER TEXT HERE</div>
- All layout via nested <table cellpadding="0" cellspacing="0" border="0">. NO flex, NO grid, NO div-based layouts for structure.
- Inline styles only. Use both bgcolor attribute AND inline background-color for max compatibility.
- Mobile-friendly: 600px max width with width="100%" max-width:600px on the inner table.
- All <img> need width attribute, alt text, and style="display:block;border:0;outline:none;text-decoration:none;"
- Use only the attached image URLs (provided in the user message) for any <img>. Do not invent image URLs or use placeholders like example.com.
- Available merge variables (use {{first_name}} naturally where appropriate):
  {{first_name}} — recipient first name
  {{event_date}} — "December 11–12, 2026"
  {{event_location}} — "Austin, TX"

==================================================
OUTPUT
==================================================
Call the tool "compose_email" exactly once with all four fields populated:
- subject: punchy, specific, evocative. No emojis unless prompt requests them.
- preheader: 60–110 chars, complements subject without repeating it. Often a teaser of the body.
- html: complete <!DOCTYPE>...<html>...<body>...</body></html> document with hidden preheader div.
- text_fallback: plain-text version with paragraph breaks; mirrors the email content.
`;

// Some models (notably Gemini) occasionally emit invalid JSON escapes like
// \' (apostrophe) or stray control chars in tool-call arguments. JSON.parse
// rejects \' outright. We pre-clean and try again.
function repairJson(raw: string): string {
  return raw
    // Strip BOM and leading/trailing whitespace
    .replace(/^\uFEFF/, "")
    // \' is not a valid JSON escape — replace with a real apostrophe
    .replace(/\\'/g, "'")
    // Lone backslash before a non-escape char (rare) — drop the backslash
    .replace(/\\(?!["\\/bfnrtu])/g, "")
    // Strip raw control characters (except \n and \t which JSON allows escaped, but raw ones break)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

function parseToolArgs(argsRaw: unknown): any | null {
  if (!argsRaw) return null;
  if (typeof argsRaw !== "string") return argsRaw;
  try {
    return JSON.parse(argsRaw);
  } catch {
    try {
      return JSON.parse(repairJson(argsRaw));
    } catch (err) {
      console.error("Could not repair tool-call JSON:", err, argsRaw.slice(0, 400));
      return null;
    }
  }
}

// Even after JSON.parse succeeds, the strings inside may contain a literal
// backslash-apostrophe (because the model wrote `we\'re` and the parser kept
// the backslash). Clean those.
function cleanString(s: string | undefined | null): string {
  if (!s) return "";
  return s.replace(/\\'/g, "'");
}

const BROADCAST_PROMPT_TAIL =
  `\n\nDesign the email to feel like a confident expedition dispatch — not a corporate newsletter. Honor the design system precisely.`;

const CONFIRMATION_SYSTEM_TAIL = `

==================================================
THIS IS A CONFIRMATION EMAIL (sent automatically right after someone registers)
==================================================
- Tone: warm, congratulatory, welcoming. They just signed up — make them feel good about it.
- Subject should clearly confirm their registration (e.g. "You're in — see you at The Alcan Summit"). Avoid generic "Registration confirmed".
- Body MUST include:
  • A confirming opening line that references {{first_name}}.
  • The event date ({{event_date}}) and location ({{event_location}}) clearly displayed (consider a small "Event Details" block with gold rule above and below).
  • A short "What's next" section: book your hotel, watch for updates, etc.
  • A reassurance/sign-off line.
- Available variables (use them — DO NOT use {{full_name}} in headlines, but it's allowed in body if natural):
  {{first_name}}, {{full_name}}, {{event_date}}, {{event_location}}
- Single CTA at most (e.g., "Book your hotel" or "Add to calendar"). Often no CTA is fine.
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
  const mode: "broadcast" | "confirmation" = body?.mode === "confirmation" ? "confirmation" : "broadcast";
  const recipientType = body?.recipientType ?? "all";
  const assetUrls: string[] = Array.isArray(body?.assetUrls)
    ? body.assetUrls.filter((u: unknown) => typeof u === "string" && u.length > 0).slice(0, 8)
    : [];

  if (!prompt) return json({ error: "prompt required" }, 400);
  if (mode === "broadcast" && !["all", "staff", "guests"].includes(recipientType)) {
    return json({ error: "recipientType must be all|staff|guests" }, 400);
  }

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "LOVABLE_API_KEY not configured" }, 500);

  const audienceLine = mode === "confirmation"
    ? "Audience: a person who JUST registered for The Alcan Summit. They're expecting this email — confirm and welcome them."
    : recipientType === "staff"
    ? "Audience: internal Alcan team members (staff). Tone can be familiar, insider-y, energetic — they're part of the cooperative."
    : recipientType === "guests"
    ? "Audience: outside guests (industry partners, vendors, friends of Alcan). Tone is welcoming and slightly more polished; explain context where useful."
    : "Audience: all registrants (Alcan staff + outside guests). Tone is warm and inclusive; assume mixed familiarity.";

  const assetBlock = assetUrls.length
    ? `\n\nUPLOADED IMAGES (use these — do NOT invent other image URLs):\n${assetUrls.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}\n\nThe first image is typically the hero banner (place inside the navy hero band). Others can be placed in body sections as appropriate. Always include alt text describing what's in the image based on context.`
    : "\n\nNo images were uploaded. Build the email with typography, color, and layout only — no <img> tags.";

  const userMessage =
    `${audienceLine}\n\nBrief from the team:\n\n"""${prompt}"""${assetBlock}${BROADCAST_PROMPT_TAIL}`;

  const systemPrompt = mode === "confirmation"
    ? SYSTEM_PROMPT + CONFIRMATION_SYSTEM_TAIL
    : SYSTEM_PROMPT;

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
          { role: "system", content: systemPrompt },
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
  const parsed = parseToolArgs(toolCall?.function?.arguments);

  if (!parsed) {
    const fallbackText = data?.choices?.[0]?.message?.content ?? "";
    return json({
      error: "AI did not return a structured response",
      raw: fallbackText,
    }, 502);
  }

  if (!parsed.subject || !parsed.html) {
    return json({ error: "AI response missing subject or html", raw: parsed }, 502);
  }

  return json({
    subject: cleanString(parsed.subject),
    preheader: cleanString(parsed.preheader),
    html: cleanString(parsed.html),
    text_fallback: cleanString(parsed.text_fallback),
  });
});

