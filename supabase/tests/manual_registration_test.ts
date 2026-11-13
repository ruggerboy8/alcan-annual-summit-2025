import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { manualRegistrationSchema, manualRegistrationRow } from "../functions/_shared/manual-registration.ts";

const base = { id: "54d5a1a4-6ff5-4efa-a6c5-7fe866cfc3d2", first_name: "Brenda", last_name: "Hansen", email: "events@sprigusa.com", category: "Sponsor", organization: "Sprig" };

Deno.test("manual sponsor entry uses Sponsor code and Sprig organization", () => {
  const row = manualRegistrationRow(manualRegistrationSchema.parse(base));
  assertEquals(row.promo_code, "AlcanVIP2026");
  assertEquals(row.organization, "Sprig");
  assertEquals(row.attendee_type, "guest");
  assertEquals(row.added_by_admin, true);
});
Deno.test("Brenda and Tim can share the sponsor company email", () => {
  const brenda = manualRegistrationRow(manualRegistrationSchema.parse(base));
  const tim = manualRegistrationRow(manualRegistrationSchema.parse({ ...base, id: "cda939ec-6e5d-4935-a04a-ad7492f666da", first_name: "Tim", last_name: "Johnson" }));
  assertEquals(brenda.email, "events@sprigusa.com");
  assertEquals(tim.email, brenda.email);
  assertEquals(tim.id === brenda.id, false);
});
Deno.test("California entries retain the distinct California category", () => {
  assertEquals(manualRegistrationRow(manualRegistrationSchema.parse({ ...base, category: "Alcan CA" })).promo_code, "AlcanCA2026");
});
Deno.test("manual entry rejects missing names, invalid emails and missing team practice", () => {
  assertEquals(manualRegistrationSchema.safeParse({ ...base, first_name: " " }).success, false);
  assertEquals(manualRegistrationSchema.safeParse({ ...base, email: "invalid" }).success, false);
  assertEquals(manualRegistrationSchema.safeParse({ ...base, category: "Team" }).success, false);
});