import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ImagePlus, Info, Loader2, Save, Send, Sparkles, Trash2, Wand2, FilePlus, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminApi } from "@/lib/admin-api";
import EmailEditor from "./EmailEditor";

interface Props {
  token: string;
}

type Filter = "all" | "staff" | "guests";

interface CampaignRow {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "sent";
  recipient_filter: Filter;
  recipient_count: number | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CampaignFull extends CampaignRow {
  prompt: string | null;
  preheader: string | null;
  html: string;
  text_fallback: string | null;
}

const FILTER_LABEL: Record<Filter, string> = {
  all: "All Registrants",
  staff: "Alcan Team Only",
  guests: "Outside Guests Only",
};

export default function ComposeAndSendTab({ token }: Props) {
  const api = useAdminApi(token);

  // List
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [listLoading, setListLoading] = useState(true);

  // Audience counts (for the selector)
  const [counts, setCounts] = useState<Record<Filter, number | null>>({
    all: null,
    staff: null,
    guests: null,
  });

  // Editor state
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [recipientFilter, setRecipientFilter] = useState<Filter>("all");
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [html, setHtml] = useState("");
  const [textFallback, setTextFallback] = useState("");
  const [composerCollapsed, setComposerCollapsed] = useState(false);
  const [editorResetKey, setEditorResetKey] = useState(0);
  const [hasContent, setHasContent] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [dryRun, setDryRun] = useState<{ count: number; preview: { name: string; email: string }[] } | null>(null);
  const [dryRunLoading, setDryRunLoading] = useState(false);

  const loadList = async () => {
    setListLoading(true);
    try {
      const data = await api("/admin-campaigns-list");
      setCampaigns(data.campaigns ?? []);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to load campaigns");
    } finally {
      setListLoading(false);
    }
  };

  const loadCounts = async () => {
    const filters: Filter[] = ["all", "staff", "guests"];
    await Promise.all(filters.map(async (f) => {
      try {
        const data = await api("/admin-send-broadcast", {
          method: "POST",
          body: { recipientFilter: f, dryRun: true },
        });
        setCounts((prev) => ({ ...prev, [f]: data.count ?? 0 }));
      } catch {
        setCounts((prev) => ({ ...prev, [f]: null }));
      }
    }));
  };

  useEffect(() => {
    loadList();
    loadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  const startNew = () => {
    setCampaignId(null);
    setName("");
    setPrompt("");
    setRecipientFilter("all");
    setSubject("");
    setPreheader("");
    setHtml("");
    setTextFallback("");
    setComposerCollapsed(false);
    setHasContent(false);
  };

  const openCampaign = async (id: string) => {
    try {
      const data = await api("/admin-campaign-get", { query: { id } });
      const c: CampaignFull = data.campaign;
      setCampaignId(c.id);
      setName(c.name);
      setPrompt(c.prompt ?? "");
      setRecipientFilter(c.recipient_filter);
      setSubject(c.subject);
      setPreheader(c.preheader ?? "");
      setHtml(c.html);
      setTextFallback(c.text_fallback ?? "");
      setHasContent(true);
      setComposerCollapsed(true);
      setEditorResetKey((k) => k + 1);
      // Scroll to editor
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to open campaign");
    }
  };

  const generate = async () => {
    if (!prompt.trim()) {
      toast.error("Tell the AI what the email should say first.");
      return;
    }
    setGenerating(true);
    try {
      const data = await api("/admin-generate-email", {
        method: "POST",
        body: { prompt, recipientType: recipientFilter },
      });
      setSubject(data.subject ?? "");
      setPreheader(data.preheader ?? "");
      setHtml(data.html ?? "");
      setTextFallback(data.text_fallback ?? "");
      setHasContent(true);
      setComposerCollapsed(true);
      setEditorResetKey((k) => k + 1);
      toast.success("Email drafted — review and edit below.");
    } catch (err: any) {
      toast.error(err.message ?? "AI generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const saveDraft = async () => {
    if (!subject.trim()) {
      toast.error("Subject is required.");
      return;
    }
    if (!html.trim()) {
      toast.error("Email body is required.");
      return;
    }
    setSaving(true);
    try {
      const data = await api("/admin-campaign-save", {
        method: "POST",
        body: {
          id: campaignId,
          name: name.trim() || "Untitled draft",
          prompt: prompt || null,
          subject,
          preheader: preheader || null,
          html,
          text_fallback: textFallback || null,
          recipient_filter: recipientFilter,
        },
      });
      setCampaignId(data.campaign.id);
      toast.success("Draft saved.");
      loadList();
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const openSendModal = async () => {
    if (!subject.trim() || !html.trim()) {
      toast.error("Subject and body are required.");
      return;
    }
    // Save first if no campaign id
    if (!campaignId) {
      await saveDraft();
    }
    setSendModalOpen(true);
    setDryRun(null);
    setDryRunLoading(true);
    try {
      const data = await api("/admin-send-broadcast", {
        method: "POST",
        body: { recipientFilter, dryRun: true },
      });
      setDryRun({ count: data.count ?? 0, preview: data.preview ?? [] });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to count recipients");
      setSendModalOpen(false);
    } finally {
      setDryRunLoading(false);
    }
  };

  const confirmSend = async () => {
    if (!campaignId) return;
    setSending(true);
    try {
      const data = await api("/admin-send-broadcast", {
        method: "POST",
        body: { campaignId, recipientFilter, dryRun: false },
      });
      toast.success(
        `Email sent to ${data.sent} ${data.sent === 1 ? "person" : "people"}. ${data.failed} ${data.failed === 1 ? "failure" : "failures"}.`,
      );
      setSendModalOpen(false);
      loadList();
      // Reset editor — campaign is now sent and immutable
      startNew();
    } catch (err: any) {
      toast.error(err.message ?? "Send failed");
    } finally {
      setSending(false);
    }
  };

  const audienceCount = counts[recipientFilter];

  return (
    <div className="space-y-6">
      {/* Previous campaigns */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-base">Previous emails</h2>
          <Button onClick={startNew} size="sm" variant="outline">
            <FilePlus className="mr-1.5 h-4 w-4" />
            New Email
          </Button>
        </div>
        {listLoading ? (
          <div className="py-10 text-center text-muted-foreground text-sm">
            <Loader2 className="inline mr-1.5 h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">
            No emails yet. Click "New Email" to compose your first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground bg-muted/40">
                <tr>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Recipients</th>
                  <th className="px-4 py-2 font-medium">Sent / Updated</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="px-4 py-2.5">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-md">{c.subject}</div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {FILTER_LABEL[c.recipient_filter]}
                      {c.recipient_count != null && (
                        <span className="ml-1">({c.recipient_count})</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {c.sent_at
                        ? new Date(c.sent_at).toLocaleString()
                        : new Date(c.updated_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant="outline"
                        className={
                          c.status === "sent"
                            ? "bg-green-100 text-green-700 border-transparent"
                            : "bg-amber-100 text-amber-700 border-transparent"
                        }
                      >
                        {c.status === "sent" ? "Sent" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Button size="sm" variant="ghost" onClick={() => openCampaign(c.id)}>
                        Open
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Composer */}
      <div className="rounded-lg border border-border bg-card shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Composer
          </h2>
          {composerCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setComposerCollapsed(false)}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Regenerate
            </Button>
          )}
        </div>

        {!composerCollapsed && (
          <>
            <div>
              <Label htmlFor="ai-prompt" className="text-base font-medium mb-1.5 block">
                What do you want this email to say?
              </Label>
              <Textarea
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                placeholder="e.g. Remind everyone the event is 3 weeks away, remind them to book their hotel room soon, and get them excited about what's coming."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="sm:w-72">
                <Label htmlFor="audience" className="mb-1.5 block">Send to</Label>
                <Select
                  value={recipientFilter}
                  onValueChange={(v) => setRecipientFilter(v as Filter)}
                >
                  <SelectTrigger id="audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["all", "staff", "guests"] as Filter[]).map((f) => (
                      <SelectItem key={f} value={f}>
                        {FILTER_LABEL[f]}
                        {counts[f] != null && ` (${counts[f]})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generate}
                disabled={generating || !prompt.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground sm:w-auto w-full"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Writing your email…
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    {hasContent ? "Regenerate Email" : "Generate Email"}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Editor */}
      {hasContent && (
        <>
          <div className="rounded-lg border border-border bg-card shadow-sm p-5 space-y-4">
            <div>
              <Label htmlFor="email-subject" className="mb-1.5 block">Subject</Label>
              <Input
                id="email-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email-preheader" className="mb-1.5 block">
                Preview text <span className="text-muted-foreground font-normal">(shown in inbox before the email opens)</span>
              </Label>
              <Input
                id="email-preheader"
                value={preheader}
                onChange={(e) => setPreheader(e.target.value)}
                placeholder="Optional but recommended"
              />
            </div>
          </div>

          <EmailEditor
            html={html}
            text={textFallback}
            onHtmlChange={setHtml}
            onTextChange={setTextFallback}
            initialView="preview"
            resetKey={editorResetKey}
          />

          <div className="rounded-lg border border-border bg-card shadow-sm p-5 space-y-4">
            <div>
              <Label htmlFor="campaign-name" className="mb-1.5 block">
                Campaign name <span className="text-muted-foreground font-normal">(internal only)</span>
              </Label>
              <Input
                id="campaign-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 3-week reminder"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={saveDraft} disabled={saving || sending}>
                {saving ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-1.5 h-4 w-4" />
                )}
                Save Draft
              </Button>
              <Button
                onClick={openSendModal}
                disabled={saving || sending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="mr-1.5 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Send confirmation modal */}
      <Dialog open={sendModalOpen} onOpenChange={setSendModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send broadcast email</DialogTitle>
            <DialogDescription>Review carefully — this cannot be undone.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm space-y-1">
              <div><span className="text-muted-foreground">Subject:</span> <span className="font-medium">{subject}</span></div>
              <div><span className="text-muted-foreground">Audience:</span> {FILTER_LABEL[recipientFilter]}</div>
            </div>

            {dryRunLoading ? (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Counting recipients…
              </div>
            ) : dryRun ? (
              <div className="text-sm">
                <div className="font-medium mb-1">
                  {dryRun.count} {dryRun.count === 1 ? "person" : "people"} will receive this email.
                </div>
                {dryRun.preview.length > 0 && (
                  <div className="text-muted-foreground">
                    {dryRun.preview.slice(0, 5).map((p) => p.name).join(", ")}
                    {dryRun.count > dryRun.preview.length && `, and ${dryRun.count - dryRun.preview.length} others`}
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>This action cannot be undone. Each person will receive one email.</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSendModalOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button
              onClick={confirmSend}
              disabled={sending || dryRunLoading || !dryRun || dryRun.count === 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>Yes, send to {dryRun?.count ?? 0} {dryRun?.count === 1 ? "person" : "people"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
