import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Registration, useAdminApi } from "@/lib/admin-api";

interface Props {
  token: string;
}

function timeOfDay(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function CheckInTab({ token }: Props) {
  const api = useAdminApi(token);
  const [all, setAll] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const polling = useRef<number | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await api("/admin-list-registrations", {
        query: { type: "all", page: 1, pageSize: 10000 },
      });
      setAll(data.registrations ?? []);
    } catch (err: any) {
      if (!silent) toast.error(err.message ?? "Failed to load");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    load();
    polling.current = window.setInterval(() => load(true), 30000);
    return () => {
      if (polling.current) window.clearInterval(polling.current);
    };
  }, [load]);

  const setOne = (next: Registration) =>
    setAll((prev) => prev.map((r) => (r.id === next.id ? next : r)));

  const checkIn = async (r: Registration) => {
    const now = new Date().toISOString();
    setUpdating((s) => new Set(s).add(r.id));
    setOne({ ...r, checked_in_at: now, checked_in_by: "admin" });
    try {
      const data = await api("/admin-update-registration", {
        method: "POST",
        body: { registrationId: r.id, action: "check-in" },
      });
      setOne(data.registration);
    } catch (err: any) {
      setOne(r);
      toast.error(err.message ?? "Check-in failed");
    } finally {
      setUpdating((s) => {
        const n = new Set(s);
        n.delete(r.id);
        return n;
      });
    }
  };

  const undoCheckIn = async (r: Registration) => {
    setUpdating((s) => new Set(s).add(r.id));
    setOne({ ...r, checked_in_at: null, checked_in_by: null });
    try {
      const data = await api("/admin-update-registration", {
        method: "POST",
        body: { registrationId: r.id, action: "undo-check-in" },
      });
      setOne(data.registration);
    } catch (err: any) {
      setOne(r);
      toast.error(err.message ?? "Undo failed");
    } finally {
      setUpdating((s) => {
        const n = new Set(s);
        n.delete(r.id);
        return n;
      });
    }
  };

  const { notArrived, checkedIn, totalCount, checkedInCount } = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = (r: Registration) =>
      !q ||
      r.first_name.toLowerCase().includes(q) ||
      r.last_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.practice ?? "").toLowerCase().includes(q) ||
      (r.organization ?? "").toLowerCase().includes(q);

    const notArrived = all
      .filter((r) => !r.checked_in_at && matches(r))
      .sort((a, b) => a.last_name.localeCompare(b.last_name));
    const checkedIn = all
      .filter((r) => !!r.checked_in_at)
      .sort((a, b) => (b.checked_in_at ?? "").localeCompare(a.checked_in_at ?? ""));

    return {
      notArrived,
      checkedIn,
      totalCount: all.length,
      checkedInCount: all.filter((r) => !!r.checked_in_at).length,
    };
  }, [all, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading registrations…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-lg font-semibold text-primary">
          {checkedInCount} <span className="text-muted-foreground font-normal">of</span> {totalCount} checked in
        </div>
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Not yet arrived */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-semibold text-foreground">Not Yet Arrived</h3>
            <p className="text-xs text-muted-foreground">{notArrived.length} remaining</p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-border">
            {notArrived.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Everyone matching your search has arrived.
              </div>
            ) : (
              notArrived.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {r.first_name} {r.last_name}
                    </div>
                    <div className="mt-0.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent text-[10px]",
                          r.attendee_type === "staff"
                            ? "bg-primary/10 text-primary"
                            : "bg-gold/15 text-gold",
                        )}
                      >
                        {r.attendee_type === "staff" ? r.practice ?? "Team" : r.organization ?? "Guest"}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => checkIn(r)}
                    disabled={updating.has(r.id)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                  >
                    {updating.has(r.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Check In ✓</>
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Checked in */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-semibold text-foreground">Checked In</h3>
            <p className="text-xs text-muted-foreground">{checkedIn.length} arrivals</p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-border">
            {checkedIn.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No one has checked in yet.
              </div>
            ) : (
              checkedIn.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {r.first_name} {r.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {timeOfDay(r.checked_in_at)} ·{" "}
                      {r.attendee_type === "staff" ? "Team" : "Guest"}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => undoCheckIn(r)}
                    disabled={updating.has(r.id)}
                    className="shrink-0"
                  >
                    {updating.has(r.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Undo2 className="mr-1 h-4 w-4" /> Undo
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
