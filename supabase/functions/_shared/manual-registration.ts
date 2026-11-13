import { z } from "npm:zod@3.23.8";

export const manualRegistrationSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  category: z.enum(["Team", "Guest", "Sponsor", "Alcan CA"]),
  phone: z.string().trim().max(50).default(""),
  practice: z.string().trim().max(200).default(""),
  organization: z.string().trim().max(200).default(""),
  role: z.string().trim().max(200).default(""),
  dietary_restrictions: z.string().trim().max(500).default(""),
}).superRefine((value, ctx) => {
  if (value.category === "Team" && !value.practice) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Practice is required", path: ["practice"] });
  }
});

export function manualRegistrationRow(value: z.infer<typeof manualRegistrationSchema>) {
  const { category, ...fields } = value;
  return {
    ...fields,
    attendee_type: category === "Team" ? "staff" : "guest",
    practice: category === "Team" ? fields.practice : null,
    organization: category === "Team" ? null : fields.organization || null,
    phone: fields.phone || null,
    role: fields.role || null,
    dietary_restrictions: fields.dietary_restrictions || null,
    promo_code: category === "Sponsor" ? "AlcanVIP2026" : category === "Alcan CA" ? "AlcanCA2026" : null,
    added_by_admin: true,
    registration_status: "registered",
    event_version: "v1-alcan-summit-2026",
  };
}