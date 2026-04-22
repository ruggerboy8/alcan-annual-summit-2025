import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Registration,
  RegistrationStats,
  useAdminApi,
} from "@/lib/admin-api";
import RegistrationDetail from "@/components/admin/RegistrationDetail";

interface Props {
  token: string;
}

const PAGE_SIZE = 25;

const STAT_CARDS: Array<{ key: keyof RegistrationStats; label: string }> = [
  { key: "total", label: "Total Registrations" },
  { key: "staff", label: "Alcan Team" },
  { key: "guests", label: "Outside Guests" },
  { key: "checkedIn", label: "Checked In" },
  { key: "emailSent", label: "Email Sent" },
];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function RegistrationsTab({ token }: Props) {
  const api = useAdminApi(token);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<RegistrationStats>({
    total: 0,
    staff: 0,
    guests: 0,
    checkedIn: 0,
    emailSent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "staff" | "guest">("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selected, setSelected] = useState<Registration | null>(null);
  const [exporting, setExporting] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api("/admin-list-registrations", {
        query: {
          type: typeFilter,
          search: debouncedSearch,
          page,
          pageSize: PAGE_SIZE,
        },
      });
      setRegistrations(data.registrations ?? []);
      setStats(data.stats);
      setTotalCount(data.total ?? 0);
    } catch (err: any) {
      setError(err.message ?? "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [api, typeFilter, debouncedSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const updateLocalRegistration = (next: Registration) => {
    setRegistrations((prev) => prev.map((r) => (r.id === next.id ? next : r)));
    if (selected?.id === next.id) setSelected(next);
  };

  const removeLocalRegistration = (id: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    setSelected(null);
    // refresh stats
    load();
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const data = await api("/admin-list-registrations", {
        query: {
          type: typeFilter,
          search: debouncedSearch,
          page: 1,
          pageSize: 10000,
        },
      });
      const rows: Registration[] = data.registrations ?? [];
      const header = [
        "First Name",
        "Last Name",
        "Type",
        "Email",
        "Phone",
        "Practice",
        "Organization",
        "Role",
        "Registered At",
        "Email Sent",
        "Checked In",
      ];
      const lines = [header.join(",")];
      for (const r of rows) {
        lines.push(
          [
            r.first_name,
            r.last_name,
            r.attendee_type === "staff" ? "Team" : "Guest",
            r.email,
            r.phone ?? "",
            r.practice ?? "",
            r.organization ?? "",
            r.role ?? "",
            r.created_at,
            r.confirmation_email_sent_at ?? "",
            r.checked_in_at ?? "",
          ].map(csvEscape).join(","),
        );
      }
      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `summit-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {STAT_CARDS.map((c) => (
          <div
            key={c.key}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {c.label}
            </div>
            <div className="mt-1 text-2xl font-bold text-primary">
              {stats[c.key]}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, practice…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-border bg-card p-0.5">
            {(["all", "staff", "guest"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-sm transition-colors",
                  typeFilter === t
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "all" ? "All" : t === "staff" ? "Team" : "Guests"}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={exporting}>
            {exporting ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-1.5 h-4 w-4" />
            )}
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table / list */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
          </div>
        ) : error ? (
          <div className="p-6 text-destructive">{error}</div>
        ) : registrations.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No registrations found.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Practice / Organization</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Registered</th>
                    <th className="px-4 py-3 text-center">Email</th>
                    <th className="px-4 py-3 text-center">Checked In</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {registrations.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">
                        {r.first_name} {r.last_name}
                      </td>
                      <td className="px-4 py-3">
                        <TypeBadge type={r.attendee_type} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {r.email}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {r.practice ?? r.organization ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {r.phone ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.confirmation_email_sent_at ? "✓" : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.checked_in_at ? "✓" : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelected(r)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {registrations.map((r) => (
                <div key={r.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">
                        {r.first_name} {r.last_name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {r.email}
                      </div>
                      <div className="mt-2">
                        <TypeBadge type={r.attendee_type} />
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {totalCount === 0
            ? "0 results"
            : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, totalCount)} of ${totalCount}`}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <RegistrationDetail
        token={token}
        registration={selected}
        onClose={() => setSelected(null)}
        onUpdated={updateLocalRegistration}
        onDeleted={removeLocalRegistration}
      />
    </div>
  );
}

function TypeBadge({ type }: { type: "staff" | "guest" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent text-xs font-semibold",
        type === "staff"
          ? "bg-primary/10 text-primary"
          : "bg-gold/15 text-gold",
      )}
    >
      {type === "staff" ? "Team" : "Guest"}
    </Badge>
  );
}
