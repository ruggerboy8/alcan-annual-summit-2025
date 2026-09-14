// Tests for the broadcast batching and claim logic.
//
// Run with:  deno test supabase/tests/
//
// These cover the one property that actually matters: across any sequence of
// batches, interruptions and retries, every address is mailed at most once and
// the campaign is only marked sent when nobody is left.

import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  campaignKey,
  normaliseEmail,
  pendingRecipients,
  planBatch,
  type Recipient,
} from "../functions/_shared/broadcast.ts";

function mk(n: number, emailFn?: (i: number) => string): Recipient[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `id-${i}`,
    first_name: `First${i}`,
    last_name: `Last${i}`,
    email: emailFn ? emailFn(i) : `person${i}@example.com`,
  }));
}

Deno.test("campaignKey is stable and namespaced", () => {
  assertEquals(campaignKey("abc"), "campaign:abc");
});

Deno.test("normaliseEmail trims and lowercases", () => {
  assertEquals(normaliseEmail("  Person@Example.COM "), "person@example.com");
  assertEquals(normaliseEmail(null), "");
  assertEquals(normaliseEmail(undefined), "");
});

Deno.test("pendingRecipients excludes addresses already claimed", () => {
  const all = mk(5);
  const pending = pendingRecipients(all, [
    "person0@example.com",
    "person3@example.com",
  ]);
  assertEquals(pending.map((r) => r.email), [
    "person1@example.com",
    "person2@example.com",
    "person4@example.com",
  ]);
});

Deno.test("claim matching ignores case and surrounding whitespace", () => {
  const all = mk(3);
  const pending = pendingRecipients(all, ["  PERSON1@EXAMPLE.COM "]);
  assertEquals(pending.map((r) => r.email), [
    "person0@example.com",
    "person2@example.com",
  ]);
});

Deno.test("a repeated address inside one list is only sent once", () => {
  const all: Recipient[] = [
    { id: "a", first_name: "A", last_name: "A", email: "dup@example.com" },
    { id: "b", first_name: "B", last_name: "B", email: "DUP@example.com" },
    { id: "c", first_name: "C", last_name: "C", email: "other@example.com" },
  ];
  const pending = pendingRecipients(all, []);
  assertEquals(pending.map((r) => r.id), ["a", "c"]);
});

Deno.test("blank addresses are dropped rather than claimed", () => {
  const all: Recipient[] = [
    { id: "a", first_name: "A", last_name: "A", email: "" },
    { id: "b", first_name: "B", last_name: "B", email: "   " },
    { id: "c", first_name: "C", last_name: "C", email: "ok@example.com" },
  ];
  assertEquals(pendingRecipients(all, []).map((r) => r.id), ["c"]);
});

Deno.test("planBatch reports done only when nothing is left", () => {
  const p = mk(10);
  const first = planBatch(p, 4);
  assertEquals(first.batch.length, 4);
  assertEquals(first.remaining, 6);
  assertEquals(first.done, false);

  const last = planBatch(mk(3), 4);
  assertEquals(last.batch.length, 3);
  assertEquals(last.remaining, 0);
  assertEquals(last.done, true);
});

Deno.test("planBatch handles an exact multiple without an extra empty round", () => {
  const { batch, remaining, done } = planBatch(mk(4), 4);
  assertEquals(batch.length, 4);
  assertEquals(remaining, 0);
  assertEquals(done, true);
});

Deno.test("planBatch on an empty list is immediately done", () => {
  const { batch, remaining, done } = planBatch([], 60);
  assertEquals(batch.length, 0);
  assertEquals(remaining, 0);
  assertEquals(done, true);
});

/**
 * Simulates the real loop against a fake database, including an interruption
 * partway through a batch, which is exactly the timeout that made the old
 * version double-send.
 */
function runCampaign(opts: {
  recipients: Recipient[];
  batchLimit: number;
  /** Throw after this many sends, once, to imitate an isolate dying. */
  interruptAfter?: number;
}) {
  const { recipients, batchLimit } = opts;
  // The database's partial unique index, modelled as a set of claimed keys.
  const claims = new Set<string>();
  const mailed: string[] = [];
  let interruptBudget = opts.interruptAfter ?? Infinity;
  let rounds = 0;
  let done = false;

  while (!done && rounds < 100) {
    rounds++;
    const pending = pendingRecipients(recipients, [...claims]);
    const plan = planBatch(pending, batchLimit);
    try {
      for (const r of plan.batch) {
        const key = normaliseEmail(r.email);
        if (claims.has(key)) continue; // unique index rejects the claim
        claims.add(key); // claim BEFORE sending
        if (interruptBudget-- <= 0) throw new Error("isolate died");
        mailed.push(key);
      }
      done = plan.done;
    } catch {
      // Interruption: the invocation dies. The caller retries, and the claim
      // rows written so far survive. Only fire once.
      interruptBudget = Infinity;
    }
  }
  return { mailed, rounds, done };
}

Deno.test("every recipient is mailed exactly once across many batches", () => {
  const recipients = mk(250);
  const { mailed, done } = runCampaign({ recipients, batchLimit: 60 });
  assertEquals(done, true);
  assertEquals(mailed.length, 250);
  assertEquals(new Set(mailed).size, 250);
});

Deno.test("an interruption mid-send never causes a duplicate", () => {
  const recipients = mk(250);
  const { mailed, done } = runCampaign({
    recipients,
    batchLimit: 60,
    interruptAfter: 137, // die partway through the third batch
  });
  assertEquals(done, true);
  // The address claimed at the moment of death is deliberately not retried,
  // so it may be skipped. What must never happen is a duplicate.
  assertEquals(new Set(mailed).size, mailed.length);
  assertEquals(mailed.length >= 249, true);
});

Deno.test("re-running a completed campaign mails nobody", () => {
  const recipients = mk(40);
  const first = runCampaign({ recipients, batchLimit: 60 });
  assertEquals(first.mailed.length, 40);

  // Second run, with every address already claimed.
  const claimed = recipients.map((r) => r.email);
  const pending = pendingRecipients(recipients, claimed);
  assertEquals(pending.length, 0);
  assertEquals(planBatch(pending, 60).done, true);
});

Deno.test("a recipient added mid-campaign is picked up, not skipped", () => {
  const recipients = mk(10);
  const claimed = recipients.slice(0, 10).map((r) => r.email);
  const late: Recipient = {
    id: "late",
    first_name: "Late",
    last_name: "Comer",
    email: "late@example.com",
  };
  const pending = pendingRecipients([...recipients, late], claimed);
  assertEquals(pending.map((r) => r.id), ["late"]);
});
