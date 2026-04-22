// Shared email-sending helpers for Resend.
// Centralizes deliverability hardening: List-Unsubscribe headers, preheader
// injection, text fallback, validated reply_to, recipient regex.

export const REPLY_TO = "info@alcandentalcooperative.com";

export const LIST_UNSUBSCRIBE_HEADERS = {
  "List-Unsubscribe": `<mailto:${REPLY_TO}?subject=unsubscribe>`,
  "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function fromAddress(): string {
  return Deno.env.get("RESEND_FROM_EMAIL") ??
    "The Alcan Summit <onboarding@resend.dev>";
}

/** Render `{{var}}` placeholders. */
export function renderTemplate(
  tpl: string,
  vars: Record<string, string>,
): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

/** Strip HTML to a basic plain-text fallback. */
export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Inject a hidden preheader div immediately after <body…>. If no <body> tag is
 * found (e.g. fragment HTML), prepend it. If preheader is empty, returns html
 * unchanged.
 */
export function injectPreheader(html: string, preheader: string | null | undefined): string {
  if (!preheader || !preheader.trim()) return html;
  const safe = preheader
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const div =
    `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">${safe}</div>`;
  const bodyMatch = html.match(/<body[^>]*>/i);
  if (bodyMatch) {
    const idx = html.indexOf(bodyMatch[0]) + bodyMatch[0].length;
    return html.slice(0, idx) + div + html.slice(idx);
  }
  return div + html;
}

/**
 * Repair a mangled doctype at the top of an email HTML body. The AI generator
 * sometimes drops the leading `<!` (or even `<`), causing the doctype string
 * to render as visible text in email clients. Strip whatever doctype variant
 * is present and prepend a clean XHTML 1.0 Transitional doctype.
 */
export function normalizeDoctype(html: string): string {
  let out = html.trimStart();
  const doctypeRe = /^<?!?doctype\b[^>]*>?/i;
  if (doctypeRe.test(out)) {
    out = out.replace(doctypeRe, "").trimStart();
  }
  if (out.startsWith("html ") || out.startsWith("html>")) {
    out = "<" + out;
  }
  return (
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
    out
  );
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string | null;
  preheader?: string | null;
  testPrefix?: boolean;
}

export interface SendEmailResult {
  ok: boolean;
  status: number;
  messageId: string | null;
  error: string | null;
}

/**
 * Send an email via Resend with all deliverability headers applied.
 * Caller is responsible for logging to email_sends.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    return { ok: false, status: 0, messageId: null, error: "RESEND_API_KEY not configured" };
  }
  if (!isValidEmail(params.to)) {
    return { ok: false, status: 0, messageId: null, error: "Invalid email address" };
  }

  const subject = params.testPrefix ? `[TEST] ${params.subject}` : params.subject;
  const html = injectPreheader(params.html, params.preheader);
  const text = params.text && params.text.trim().length
    ? params.text
    : htmlToText(html);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        reply_to: REPLY_TO,
        to: [params.to],
        subject,
        html,
        text,
        headers: LIST_UNSUBSCRIBE_HEADERS,
      }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        messageId: null,
        error: typeof result === "object" ? JSON.stringify(result) : String(result),
      };
    }
    return { ok: true, status: res.status, messageId: result?.id ?? null, error: null };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      messageId: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
