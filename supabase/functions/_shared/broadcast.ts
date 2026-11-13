// Pure helpers for broadcast sending.
//
// Kept out of the function module so they can be unit tested without a
// database, a mail provider, or environment variables. This is the logic that
// decides who gets mailed, so it is the part worth testing directly.

export interface Recipient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  full_name?: string;
}

/** Log rows for a campaign are keyed by this. Also the claim key. */
export function campaignKey(campaignId: string): string {
  return `campaign:${campaignId}`;
}

/** Normalised form used for claim comparisons and the database's lower() index. */
export function normaliseEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

/** One broadcast per inbox, addressed to everyone in the selected audience. */
export function groupRecipients(recipients: Recipient[]): Recipient[] {
  const groups = new Map<string, Recipient[]>();
  for (const recipient of recipients) {
    const email = normaliseEmail(recipient.email);
    if (!email) continue;
    const group = groups.get(email) ?? [];
    if (!group.some((r) => r.id === recipient.id)) group.push(recipient);
    groups.set(email, group);
  }
  const joinNames = (names: string[]) => names.length <= 2
    ? names.join(" and ")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return [...groups.entries()].map(([email, group]) => {
    const first = group[0];
    if (group.length === 1) return { ...first, email };
    return {
      id: first.id,
      email,
      first_name: joinNames(group.map((r) => r.first_name)),
      last_name: "",
      full_name: joinNames(group.map((r) => `${r.first_name} ${r.last_name}`.trim())),
    };
  });
}

/**
 * Recipients not yet claimed for this campaign, in the order given.
 *
 * Two things are deduplicated:
 *  - addresses already claimed by an earlier batch or a concurrent invocation
 *  - addresses repeated inside the incoming list, which would otherwise be
 *    mailed twice within a single batch before either claim landed
 */
export function pendingRecipients(
  recipients: Recipient[],
  claimedEmails: string[],
): Recipient[] {
  const claimed = new Set(claimedEmails.map(normaliseEmail));
  const seen = new Set<string>();
  const out: Recipient[] = [];
  for (const r of recipients) {
    const key = normaliseEmail(r.email);
    if (!key) continue;
    if (claimed.has(key) || seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

/**
 * How a single invocation should slice the pending list.
 *
 * `done` is what tells the caller to stop looping, and what gates marking the
 * campaign sent. It must only be true when nothing is left unclaimed.
 */
export function planBatch(
  pending: Recipient[],
  batchLimit: number,
): { batch: Recipient[]; remaining: number; done: boolean } {
  const batch = pending.slice(0, batchLimit);
  const remaining = Math.max(0, pending.length - batch.length);
  return { batch, remaining, done: remaining === 0 };
}
