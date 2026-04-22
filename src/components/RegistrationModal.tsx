import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PRACTICES,
  SUPABASE_ANON_KEY,
  SUPABASE_FUNCTIONS_URL,
} from "@/lib/event-constants";

interface RegistrationModalProps {
  buttonText?: string;
  buttonClassName?: string;
}

type AttendeeType = "staff" | "guest";
type Step = "form" | "review" | "submitted";

const baseFields = {
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  honeypot: z.string().max(0).optional().or(z.literal("")),
};

const staffSchema = z.object({
  ...baseFields,
  practice: z
    .string()
    .min(1, "Please choose your practice")
    .refine((v) => (PRACTICES as readonly string[]).includes(v), {
      message: "Please choose your practice",
    }),
});

const guestSchema = z.object({
  ...baseFields,
  organization: z.string().trim().min(1, "Organization is required").max(200),
  role: z.string().trim().min(1, "Role is required").max(150),
});

type StaffValues = z.infer<typeof staffSchema>;
type GuestValues = z.infer<typeof guestSchema>;
type FormValues = StaffValues & Partial<GuestValues>;

const defaultStaffValues: StaffValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  practice: "",
  honeypot: "",
};

const defaultGuestValues: GuestValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organization: "",
  role: "",
  honeypot: "",
};

export default function RegistrationModal({
  buttonText = "Register Now",
  buttonClassName = "bg-primary hover:bg-primary/90 text-white px-12 sm:px-16 py-6 text-xl sm:text-2xl rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-biondi font-bold min-w-[280px] sm:min-w-[320px]",
}: RegistrationModalProps) {
  const [open, setOpen] = useState(false);
  const [attendeeType, setAttendeeType] = useState<AttendeeType>("staff");
  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadedAt, setLoadedAt] = useState<number>(() => Date.now());

  const schema = attendeeType === "staff" ? staffSchema : guestSchema;
  const defaults =
    attendeeType === "staff" ? defaultStaffValues : defaultGuestValues;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: defaults as FormValues,
    mode: "onTouched",
  });

  const values = form.watch();

  // Reset everything when modal opens or closes
  useEffect(() => {
    if (open) {
      setLoadedAt(Date.now());
      setStep("form");
      setSubmitError(null);
      setAttendeeType("staff");
      form.reset(defaultStaffValues as FormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const switchType = (next: AttendeeType) => {
    if (next === attendeeType) return;
    setAttendeeType(next);
    form.reset(
      (next === "staff" ? defaultStaffValues : defaultGuestValues) as FormValues,
    );
    setSubmitError(null);
  };

  const onContinue = async () => {
    const valid = await form.trigger();
    if (!valid) return;
    if ((form.getValues("honeypot") ?? "") !== "") {
      // Silently treat as success for bots
      setStep("submitted");
      return;
    }
    setSubmitError(null);
    setStep("review");
  };

  const submitRegistration = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const v = form.getValues();
    const payload: Record<string, unknown> = {
      attendeeType,
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone || undefined,
      honeypot: v.honeypot ?? "",
      submittedAt: loadedAt,
    };

    if (attendeeType === "staff") {
      payload.practice = (v as StaffValues).practice;
    } else {
      payload.organization = (v as GuestValues).organization;
      payload.role = (v as GuestValues).role;
    }

    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        setStep("submitted");
      } else if (res.status === 409) {
        setSubmitError(
          data?.error ?? "This email is already registered for The Summit.",
        );
      } else if (res.status === 400) {
        setSubmitError(
          data?.error ?? "Some fields look off. Please go back and check.",
        );
      } else {
        setSubmitError(
          data?.error ?? "Something went wrong. Please try again in a moment.",
        );
      }
    } catch (err) {
      console.error("Registration submit failed:", err);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reviewRows = useMemo(() => {
    const rows: Array<{ label: string; value: string }> = [
      { label: "Attendee", value: attendeeType === "staff" ? "Alcan Team Member" : "Outside Guest" },
      { label: "First Name", value: values.firstName ?? "" },
      { label: "Last Name", value: values.lastName ?? "" },
      { label: "Email", value: values.email ?? "" },
      { label: "Phone", value: values.phone || "—" },
    ];
    if (attendeeType === "staff") {
      rows.push({ label: "Practice", value: (values as StaffValues).practice ?? "" });
    } else {
      rows.push({ label: "Organization", value: (values as GuestValues).organization ?? "" });
      rows.push({ label: "Role", value: (values as GuestValues).role ?? "" });
    }
    return rows;
  }, [values, attendeeType]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-biondi text-2xl text-primary">
            {step === "submitted" ? "You're registered!" : "Register for The Summit"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-5">
            {/* Attendee type toggle */}
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-1 bg-muted/40">
              <button
                type="button"
                onClick={() => switchType("staff")}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  attendeeType === "staff"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                Alcan Team Member
              </button>
              <button
                type="button"
                onClick={() => switchType("guest")}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  attendeeType === "guest"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                Outside Guest
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onContinue();
              }}
              className="space-y-4"
              noValidate
            >
              {/* Honeypot — visually hidden */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-10000px",
                  top: "auto",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...form.register("honeypot")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldWrap label="First Name" error={form.formState.errors.firstName?.message}>
                  <Input
                    autoComplete="given-name"
                    {...form.register("firstName")}
                  />
                </FieldWrap>
                <FieldWrap label="Last Name" error={form.formState.errors.lastName?.message}>
                  <Input
                    autoComplete="family-name"
                    {...form.register("lastName")}
                  />
                </FieldWrap>
              </div>

              <FieldWrap label="Email Address" error={form.formState.errors.email?.message}>
                <Input
                  type="email"
                  autoComplete="email"
                  {...form.register("email")}
                />
              </FieldWrap>

              <FieldWrap
                label="Phone Number"
                hint="(optional)"
                error={form.formState.errors.phone?.message}
              >
                <Input
                  type="tel"
                  autoComplete="tel"
                  {...form.register("phone")}
                />
              </FieldWrap>

              {attendeeType === "staff" ? (
                <FieldWrap
                  label="Your Practice"
                  error={(form.formState.errors as any).practice?.message}
                >
                  <Select
                    value={(values as StaffValues).practice || ""}
                    onValueChange={(v) =>
                      form.setValue("practice" as any, v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your practice" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRACTICES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    If you work at multiple locations, choose the one you're at the most.
                  </p>
                </FieldWrap>
              ) : (
                <>
                  <FieldWrap
                    label="Organization"
                    error={(form.formState.errors as any).organization?.message}
                  >
                    <Input
                      autoComplete="organization"
                      {...(form.register as any)("organization")}
                    />
                  </FieldWrap>
                  <FieldWrap
                    label="Your Role"
                    error={(form.formState.errors as any).role?.message}
                  >
                    <Input
                      autoComplete="organization-title"
                      {...(form.register as any)("role")}
                    />
                  </FieldWrap>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base"
              >
                Continue
              </Button>
            </form>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} /> Back to edit
            </button>

            <div className="rounded-lg border border-border divide-y divide-border bg-card">
              {reviewRows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3"
                >
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="text-sm font-medium text-foreground break-words text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {submitError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <Button
              type="button"
              onClick={submitRegistration}
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </div>
        )}

        {step === "submitted" && (
          <div className="flex flex-col items-center text-center py-6 space-y-4">
            <CheckCircle2 className="h-14 w-14 text-gold" strokeWidth={1.5} />
            <h3 className="font-biondi text-2xl text-primary">You're registered!</h3>
            <p className="text-muted-foreground max-w-md">
              Thanks{values.firstName ? `, ${values.firstName}` : ""}. We'll see you
              at The Summit. Check your inbox for a confirmation email.
            </p>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FieldWrap({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm">
        {label}
        {hint && <span className="ml-1 text-muted-foreground font-normal">{hint}</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
