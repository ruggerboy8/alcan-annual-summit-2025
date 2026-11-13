import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminApi } from "@/lib/admin-api";
import { PRACTICES } from "@/lib/event-constants";

interface Props { token: string; open: boolean; onClose: () => void; onAdded: () => void }

export default function AddAttendee({ token, open, onClose, onAdded }: Props) {
  const api = useAdminApi(token);
  const [id] = useState(() => crypto.randomUUID());
  const [category, setCategory] = useState("Guest");
  const [practice, setPractice] = useState("");
  const [sendConfirmation, setSendConfirmation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setSaving(true);
    setError(null);
    try {
      const data = await api("/admin-add-registration", { method: "POST", body: { ...fields, id, category, practice } });
      if (sendConfirmation && !data.registration.confirmation_email_sent_at) {
        try {
          await api("/admin-email-resend-confirmation", { method: "POST", body: { registrationId: data.registration.id } });
          toast.success("Attendee added and confirmation email sent");
        } catch {
          toast.warning("Attendee saved, but confirmation email was not sent. Open View to try again.");
        }
      } else {
        toast.success("Attendee added");
      }
      onAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add attendee");
    } finally {
      setSaving(false);
    }
  };

  return <Sheet open={open} onOpenChange={(next) => { if (!next && !saving) onClose(); }}>
    <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
      <SheetHeader>
        <SheetTitle className="font-biondi text-xl text-primary">Add Attendee</SheetTitle>
        <SheetDescription>Manual registration</SheetDescription>
      </SheetHeader>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label htmlFor="add-first">First Name</Label><Input id="add-first" name="first_name" required maxLength={100} /></div>
          <div><Label htmlFor="add-last">Last Name</Label><Input id="add-last" name="last_name" required maxLength={100} /></div>
        </div>
        <div><Label htmlFor="add-email">Email</Label><Input id="add-email" name="email" type="email" required maxLength={254} /></div>
        <div><Label htmlFor="add-category">Attendee Category</Label>
          <Select value={category} onValueChange={setCategory}><SelectTrigger id="add-category"><SelectValue /></SelectTrigger>
            <SelectContent>{["Guest", "Team", "Sponsor", "Alcan CA"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {category === "Team" ? <div><Label htmlFor="add-practice">Practice</Label>
          <Select value={practice} onValueChange={setPractice} required><SelectTrigger id="add-practice"><SelectValue placeholder="Select practice" /></SelectTrigger>
            <SelectContent>{PRACTICES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div> : <div><Label htmlFor="add-organization">Organization</Label><Input id="add-organization" name="organization" maxLength={200} /></div>}
        <div><Label htmlFor="add-role">Role</Label><Input id="add-role" name="role" maxLength={200} /></div>
        <div><Label htmlFor="add-phone">Phone</Label><Input id="add-phone" name="phone" type="tel" maxLength={50} /></div>
        <div><Label htmlFor="add-dietary">Dietary Restrictions or Allergies</Label><Textarea id="add-dietary" name="dietary_restrictions" maxLength={500} /></div>
        <div className="flex items-center gap-2"><Checkbox id="add-confirmation" checked={sendConfirmation} onCheckedChange={(v) => setSendConfirmation(v === true)} /><Label htmlFor="add-confirmation">Send confirmation email</Label></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={saving} className="flex-1">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}Add Attendee</Button>
          <Button type="button" variant="outline" disabled={saving} onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </SheetContent>
  </Sheet>;
}