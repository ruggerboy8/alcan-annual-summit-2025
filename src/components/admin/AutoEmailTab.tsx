import { useEffect, useRef, useState } from "react";
import { ImagePlus, Info, Loader2, Save, Send, Sparkles, Upload, Wand2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAdminApi } from "@/lib/admin-api";
import EmailEditor from "./EmailEditor";

interface Props {
  token: string;
}

interface Template {
  template_key: string;
  version: number;
  subject: string;
  preheader: string | null;
  html: string;
  text_fallback: string | null;
  is_published: boolean;
}

interface Asset { url: string; name: string; size: number; }

const TEMPLATE_KEY = "confirmation";

export default function AutoEmailTab({ token }: Props) {
  const api = useAdminApi(token);
  const [tpl, setTpl] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [html, setHtml] = useState("");
  const [textFallback, setTextFallback] = useState("");

  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  // AI composer
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [editorResetKey, setEditorResetKey] = useState(0);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api("/admin-email-template-get", {
          query: { templateKey: TEMPLATE_KEY },
        });
        if (cancelled) return;
        const t: Template = data.template;
        setTpl(t);
        setSubject(t.subject);
        setPreheader(t.preheader ?? "");
        setHtml(t.html);
        setTextFallback(t.text_fallback ?? "");
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? "Failed to load template");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api]);

  const generate = async () => {
    if (!prompt.trim()) {
      toast.error("Tell the AI what the confirmation email should say.");
      return;
    }
    setGenerating(true);
    try {
      const data = await api("/admin-generate-email", {
        method: "POST",
        body: {
          mode: "confirmation",
          prompt,
          assetUrls: assets.map((a) => a.url),
        },
      });
      setSubject(data.subject ?? "");
      setPreheader(data.preheader ?? "");
      setHtml(data.html ?? "");
      setTextFallback(data.text_fallback ?? "");
      setEditorResetKey((k) => k + 1);
      toast.success("Confirmation email drafted — review, then Save and Publish to make it live.");
    } catch (err: any) {
      toast.error(err.message ?? "AI generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const uploadAsset = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const url = `${(import.meta as any).env.VITE_SUPABASE_URL}/functions/v1/admin-upload-email-asset`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");
      setAssets((prev) => [...prev, { url: data.url, name: data.name, size: data.size }]);
      toast.success(`Uploaded ${data.name}`);
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeAsset = (url: string) => {
    setAssets((prev) => prev.filter((a) => a.url !== url));
  };

  const save = async (publish: boolean) => {
    const setter = publish ? setPublishing : setSavingDraft;
    setter(true);
    try {
      const data = await api("/admin-email-template-save", {
        method: "POST",
        body: {
          templateKey: TEMPLATE_KEY,
          subject,
          preheader: preheader || null,
          html,
          textFallback: textFallback || null,
          publish,
        },
      });
      setTpl(data.template);
      toast.success(publish ? "Published" : "Draft saved");
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setter(false);
    }
  };

  const sendTest = async () => {
    if (!testEmail) {
      toast.error("Enter an email first");
      return;
    }
    setSendingTest(true);
    try {
      await api("/admin-email-send-test", {
        method: "POST",
        body: { templateKey: TEMPLATE_KEY, recipientEmail: testEmail },
      });
      toast.success(`Test email sent to ${testEmail}`);
    } catch (err: any) {
      toast.error(err.message ?? "Send failed");
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading template…
      </div>
    );
  }

  if (error) return <div className="text-destructive">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm">
        <Info className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <div className="text-muted-foreground">
          The confirmation email below is sent <span className="font-medium text-foreground">automatically</span> as soon as someone completes registration. You don't need to send it manually — it goes out on its own. Edit it here and publish when you're ready.
        </div>
      </div>

      {/* Variables reference */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-2">Available variables</h3>
        <ul className="text-sm text-muted-foreground space-y-1 font-mono">
          <li><code>{"{{first_name}}"}</code> — registrant's first name</li>
          <li><code>{"{{full_name}}"}</code> — full name</li>
          <li><code>{"{{event_date}}"}</code> — event date</li>
          <li><code>{"{{event_location}}"}</code> — event location</li>
        </ul>
      </div>

      {/* AI Composer */}
      <div className="rounded-lg border border-border bg-card shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Composer
          </h2>
          <span className="text-xs text-muted-foreground">
            Replaces the current draft below
          </span>
        </div>
        <div>
          <Label htmlFor="conf-prompt" className="text-base font-medium mb-1.5 block">
            What should the confirmation email say?
          </Label>
          <Textarea
            id="conf-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="e.g. Warmly confirm their registration, remind them to book the Fairfield Inn before the block expires, and tease the climbing-themed agenda."
          />
        </div>

        {/* Image uploads */}
        <div className="rounded-md border border-dashed border-border bg-muted/20 p-3 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <Label className="text-sm font-medium">Images for this email</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Optional. The AI will place uploaded images in the email (first one is usually the hero banner).
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadAsset(f);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="mr-1.5 h-4 w-4" />
              )}
              Upload image
            </Button>
          </div>
          {assets.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {assets.map((a, i) => (
                <div key={a.url} className="relative group rounded-md overflow-hidden border border-border bg-background">
                  <img src={a.url} alt={a.name} className="w-full h-24 object-cover" />
                  <div className="absolute top-1 left-1 bg-background/90 text-[10px] font-medium px-1.5 py-0.5 rounded">
                    {i === 0 ? "Hero" : `#${i + 1}`}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAsset(a.url)}
                    className="absolute top-1 right-1 bg-background/90 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                    aria-label={`Remove ${a.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="px-1.5 py-1 text-[10px] truncate text-muted-foreground" title={a.name}>
                    {a.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={generate}
          disabled={generating || !prompt.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
              Generate Confirmation Email
            </>
          )}
        </Button>
      </div>

      {/* Header + version badges */}
      <div className="flex items-center justify-between">
        <h2 className="font-biondi text-xl text-primary">Confirmation Email</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">v{tpl?.version}</Badge>
          <Badge
            variant="outline"
            className={
              tpl?.is_published
                ? "bg-green-100 text-green-700 border-transparent"
                : "bg-amber-100 text-amber-700 border-transparent"
            }
          >
            {tpl?.is_published ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      {/* Subject + preheader */}
      <div className="rounded-lg border border-border bg-card shadow-sm p-5 space-y-4">
        <div>
          <Label htmlFor="auto-subject" className="mb-1.5 block">Subject</Label>
          <Input
            id="auto-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="auto-preheader" className="mb-1.5 block">
            Preview text <span className="text-muted-foreground font-normal">(shown in inbox before the email opens)</span>
          </Label>
          <Input
            id="auto-preheader"
            value={preheader}
            onChange={(e) => setPreheader(e.target.value)}
            placeholder="Optional but recommended"
          />
        </div>
      </div>

      {/* Editor */}
      <EmailEditor
        html={html}
        text={textFallback}
        onHtmlChange={setHtml}
        onTextChange={setTextFallback}
        initialView="preview"
        resetKey={editorResetKey}
      />

      {/* Save buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => save(false)} disabled={savingDraft || publishing}>
          {savingDraft ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          Save as Draft
        </Button>
        <Button
          onClick={() => save(true)}
          disabled={savingDraft || publishing}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {publishing ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" />}
          Save and Publish
        </Button>
      </div>

      {/* Test send */}
      <div className="rounded-lg border border-border bg-card shadow-sm p-5">
        <h3 className="text-base font-semibold mb-1">Send Test to Myself</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Sends a test using placeholder values (Test User, Dec 11–12 2026, Austin TX).
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="you@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="sm:flex-1"
          />
          <Button onClick={sendTest} disabled={sendingTest || !testEmail}>
            {sendingTest ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Send className="mr-1.5 h-4 w-4" />}
            Send Test to Myself
          </Button>
        </div>
      </div>
    </div>
  );
}
