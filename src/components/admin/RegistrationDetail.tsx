import { useEffect, useState } from "react";
import { Loader2, Mail, Pencil, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Registration, useAdminApi } from "@/lib/admin-api";
import { PRACTICES } from "@/lib/event-constants";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  registration: Registration | null;
  onClose: () => void;
  onUpdated: (next: Registration) => void;
  onDeleted: (id: string) => void;
}

type EditFields = Partial<Pick<
  Registration,
  | "first_name"
  | "last_name"
  | "email"
  | "phone"
  | "practice"
  | "organization"
  | "role"
>>;

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default function RegistrationDetail({
  token,
  registration,
  onClose,
  onUpdated,
  onDeleted,
}: Props) {
  const api = useAdminApi(token);
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<EditFields>({});
  const [saving, setSaving] = useState(false);
  const [resending, setResending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setEditing(false);
    setFields({});
  }, [registration?.id]);

  const open = registration !== null;
  if (!registration) return null;

  const r = registration;
  const setField = (k: keyof EditFields, v: string) =>
    setFields((p) => ({ ...p, [k]: v }));

  const startEdit = () => {
    setFields({
      first_name: r.first_name,
      last_name: r.last_name,
      email: r.email,
      phone: r.phone ?? "",
      practice: r.practice ?? "",
      organization: r.organization ?? "",
      role: r.role ?? "",
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setFields({});
  };

  const save = async () => {
    setSaving(true);
    try {
      const editFields: EditFields = {};
      const keys: (keyof EditFields)[] = [
        "first_name",
        "last_name",
        "email",
        "phone",
        "practice",
        "organization",
        "role",
      ];
      for (const k of keys) {
        if (fields[k] !== undefined) editFields[k] = fields[k] as any;
      }
      const data = await api("/admin-update-registration", {
        method: "POST",
        body: { registrationId: r.id, action: "edit", editFields },
      });
      onUpdated(data.registration);
      setEditing(false);
      toast.success("Saved");
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const resendEmail = async () => {
    setResending(true);
    try {
      await api("/admin-email-resend-confirmation", {
        method: "POST",
        body: { registrationId: r.id },
      });
      toast.success("Confirmation email sent");
      // Refresh just this row by toggling — let the parent reload via update
      onUpdated({ ...r, confirmation_email_sent_at: new Date().toISOString() });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to send");
    } finally {
      setResending(false);
    }
  };

  const performDelete = async () => {
    setDeleting(true);
    try {
      await api("/admin-update-registration", {
        method: "POST",
        body: { registrationId: r.id, action: "delete" },
      });
      toast.success("Registration deleted");
      onDeleted(r.id);
    } catch (err: any) {
      toast.error(err.message ?? "Delete failed");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const toggleCheckIn = async () => {
    try {
      const action = r.checked_in_at ? "undo-check-in" : "check-in";
      const data = await api("/admin-update-registration", {
        method: "POST",
        body: { registrationId: r.id, action },
      });
      onUpdated(data.registration);
      toast.success(r.checked_in_at ? "Check-in undone" : "Checked in");
    } catch (err: any) {
      toast.error(err.message ?? "Failed");
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-biondi text-xl text-primary">
              {r.first_name} {r.last_name}
            </SheetTitle>
            <SheetDescription className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "border-transparent",
                  r.attendee_type === "staff"
                    ? "bg-primary/10 text-primary"
                    : "bg-gold/15 text-gold",
                )}
              >
                {r.attendee_type === "staff" ? "Team" : "Guest"}
              </Badge>
              {r.checked_in_at && (
                <Badge className="bg-green-100 text-green-700 border-transparent">
                  Checked in
                </Badge>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {!editing && (
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={startEdit}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            )}

            <Field label="First Name">
              {editing ? (
                <Input
                  value={fields.first_name ?? ""}
                  onChange={(e) => setField("first_name", e.target.value)}
                />
              ) : (
                r.first_name
              )}
            </Field>
            <Field label="Last Name">
              {editing ? (
                <Input
                  value={fields.last_name ?? ""}
                  onChange={(e) => setField("last_name", e.target.value)}
                />
              ) : (
                r.last_name
              )}
            </Field>
            <Field label="Email">
              {editing ? (
                <Input
                  type="email"
                  value={fields.email ?? ""}
                  onChange={(e) => setField("email", e.target.value)}
                />
              ) : (
                r.email
              )}
            </Field>
            <Field label="Phone">
              {editing ? (
                <Input
                  value={fields.phone ?? ""}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              ) : (
                r.phone || "—"
              )}
            </Field>

            {r.attendee_type === "staff" ? (
              <Field label="Practice">
                {editing ? (
                  <Select
                    value={fields.practice ?? ""}
                    onValueChange={(v) => setField("practice", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select practice" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRACTICES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  r.practice ?? "—"
                )}
              </Field>
            ) : (
              <>
                <Field label="Organization">
                  {editing ? (
                    <Input
                      value={fields.organization ?? ""}
                      onChange={(e) => setField("organization", e.target.value)}
                    />
                  ) : (
                    r.organization ?? "—"
                  )}
                </Field>
                <Field label="Role">
                  {editing ? (
                    <Input
                      value={fields.role ?? ""}
                      onChange={(e) => setField("role", e.target.value)}
                    />
                  ) : (
                    r.role ?? "—"
                  )}
                </Field>
              </>
            )}

            <Field label="Registered">{formatDate(r.created_at)}</Field>
            <Field label="Confirmation Email">
              {r.confirmation_email_sent_at
                ? `Sent ${formatDate(r.confirmation_email_sent_at)}`
                : "Not sent"}
            </Field>
            <Field label="Check-In">
              {r.checked_in_at
                ? `Checked in ${formatDate(r.checked_in_at)}`
                : "Not checked in"}
            </Field>

            {editing ? (
              <div className="flex gap-2 pt-2">
                <Button onClick={save} disabled={saving} className="flex-1">
                  {saving ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-1.5 h-4 w-4" />
                  )}
                  Save
                </Button>
                <Button onClick={cancelEdit} variant="outline" disabled={saving}>
                  <X className="mr-1.5 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={toggleCheckIn}
                >
                  {r.checked_in_at ? "Undo check-in" : "Mark as checked in"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resendEmail}
                  disabled={resending}
                >
                  {resending ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-1.5 h-4 w-4" />
                  )}
                  {r.confirmation_email_sent_at ? "Resend confirmation email" : "Send confirmation email"}
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setConfirmDelete(true)}
                  disabled={deleting}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete registration
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this registration?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {r.first_name} {r.last_name} from the registration list. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={performDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}
