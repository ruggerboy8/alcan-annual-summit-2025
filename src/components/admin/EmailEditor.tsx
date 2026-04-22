import { useMemo, useState } from "react";
import { Code, Eye, Type } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Props {
  html: string;
  text: string;
  onHtmlChange: (next: string) => void;
  onTextChange: (next: string) => void;
  /** Initial active panel; defaults to "preview". */
  initialView?: "preview" | "html" | "text";
  /** Resets active view when this key changes (e.g. after AI generation). */
  resetKey?: string | number;
}

const MOCK_VARS: Record<string, string> = {
  first_name: "Alex",
  full_name: "Alex Johnson",
  event_date: "December 11–12, 2026",
  event_location: "Austin, TX",
};

function renderPreview(html: string): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_, k) => MOCK_VARS[k] ?? `{{${k}}}`);
}

/**
 * Three-tab email editor used by both Compose & Send and Auto Email.
 * Preview: ~600px iframe with mock variables filled in.
 * HTML: monospace textarea (advanced).
 * Plain Text: textarea fallback.
 */
export default function EmailEditor({
  html,
  text,
  onHtmlChange,
  onTextChange,
  initialView = "preview",
  resetKey,
}: Props) {
  const [view, setView] = useState<"preview" | "html" | "text">(initialView);

  // When resetKey changes, snap back to preview so AI-generated content lands there.
  useMemo(() => {
    if (resetKey !== undefined) setView(initialView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const previewSrcDoc = useMemo(() => renderPreview(html), [html]);

  const tabs = [
    { id: "preview" as const, label: "Preview", icon: Eye },
    { id: "html" as const, label: "HTML", icon: Code },
    { id: "text" as const, label: "Plain Text", icon: Type },
  ];

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border bg-muted/40">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = view === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setView(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                active
                  ? "border-primary text-primary bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Body */}
      {view === "preview" && (
        <div className="bg-muted/30 p-6 flex justify-center">
          <iframe
            title="Email preview"
            sandbox=""
            srcDoc={previewSrcDoc}
            className="bg-white border border-border rounded-md shadow-sm"
            style={{ width: 600, maxWidth: "100%", minHeight: 600, height: "70vh" }}
          />
        </div>
      )}

      {view === "html" && (
        <div className="p-4 space-y-2">
          <Label htmlFor="email-html" className="text-xs text-muted-foreground">
            Advanced — only edit if you know HTML.
          </Label>
          <Textarea
            id="email-html"
            value={html}
            onChange={(e) => onHtmlChange(e.target.value)}
            rows={22}
            className="font-mono text-xs"
          />
        </div>
      )}

      {view === "text" && (
        <div className="p-4 space-y-2">
          <Label htmlFor="email-text" className="text-xs text-muted-foreground">
            Plain-text fallback (used by spam filters and accessibility tools).
          </Label>
          <Textarea
            id="email-text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            rows={20}
          />
        </div>
      )}
    </div>
  );
}
