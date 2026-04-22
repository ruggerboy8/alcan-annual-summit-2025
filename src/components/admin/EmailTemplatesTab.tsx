import { useEffect, useState } from "react";
import { Loader2, Save, Send, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAdminApi } from "@/lib/admin-api";

interface Props {
  token: string;
}

interface Template {
  template_key: string;
  version: number;
  subject: string;
  html: string;
  text_fallback: string | null;
  is_published: boolean;
}

const TEMPLATE_KEY = "confirmation";

export default function EmailTemplatesTab({ token }: Props) {
  const api = useAdminApi(token);
  const [tpl, setTpl] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [textFallback, setTextFallback] = useState("");

  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

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

  const save = async (publish: boolean) => {
    const setter = publish ? setPublishing : setSavingDraft;
    setter(true);
    try {
      const data = await api("/admin-email-template-save", {
        method: "POST",
        body: {
          templateKey: TEMPLATE_KEY,
          subject,
          html,
          textFallback: textFallback || null,
          publish,
        },
      });
      const next: Template = data.template;
      setTpl(next);
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
    <div className="max-w-4xl space-y-5">
      {/* Reference */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <h3 className="text-sm font-semibold mb-2">Available variables</h3>
        <ul className="text-sm text-muted-foreground space-y-1 font-mono">
          <li><code>{"{{first_name}}"}</code> — registrant's first name</li>
          <li><code>{"{{full_name}}"}</code> — full name</li>
          <li><code>{"{{event_date}}"}</code> — event date</li>
          <li><code>{"{{event_location}}"}</code> — event location</li>
        </ul>
      </div>

      {/* Editor panel */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-3">
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

        <div>
          <Label htmlFor="tpl-subject" className="mb-1.5 block">Subject</Label>
          <Input
            id="tpl-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="tpl-html" className="mb-1.5 block">HTML body</Label>
          <Textarea
            id="tpl-html"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={14}
            className="font-mono text-xs"
          />
        </div>

        <div>
          <Label htmlFor="tpl-text" className="mb-1.5 block">
            Plain-text fallback
          </Label>
          <Textarea
            id="tpl-text"
            value={textFallback}
            onChange={(e) => setTextFallback(e.target.value)}
            rows={6}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => save(false)}
            disabled={savingDraft || publishing}
          >
            {savingDraft ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Save as Draft
          </Button>
          <Button
            onClick={() => save(true)}
            disabled={savingDraft || publishing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {publishing ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-1.5 h-4 w-4" />
            )}
            Save and Publish
          </Button>
        </div>
      </div>

      {/* Test send */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold mb-1">Send Test Email</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Sends a test using placeholder values (Test User, TBD date, Austin TX).
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
            {sendingTest ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-1.5 h-4 w-4" />
            )}
            Send Test
          </Button>
        </div>
      </div>
    </div>
  );
}
