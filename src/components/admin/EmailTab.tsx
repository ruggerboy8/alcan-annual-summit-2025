import { useState } from "react";
import { cn } from "@/lib/utils";
import ComposeAndSendTab from "./ComposeAndSendTab";
import AutoEmailTab from "./AutoEmailTab";

interface Props {
  token: string;
}

type SubTab = "compose" | "auto";

export default function EmailTab({ token }: Props) {
  const [sub, setSub] = useState<SubTab>("compose");

  const subTabs: Array<{ id: SubTab; label: string; hint: string }> = [
    { id: "compose", label: "Compose & Send", hint: "Write and send a broadcast" },
    { id: "auto", label: "Auto Email", hint: "Confirmation sent on registration" },
  ];

  return (
    <div className="space-y-5">
      {/* Sub-tab pills */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {subTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSub(t.id)}
            className={cn(
              "rounded-md px-3.5 py-2 text-sm font-medium transition-colors text-left",
              sub === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <div>{t.label}</div>
            <div className={cn(
              "text-xs font-normal mt-0.5",
              sub === t.id ? "text-primary-foreground/80" : "text-muted-foreground/80",
            )}>
              {t.hint}
            </div>
          </button>
        ))}
      </div>

      {sub === "compose" && <ComposeAndSendTab token={token} />}
      {sub === "auto" && <AutoEmailTab token={token} />}
    </div>
  );
}
