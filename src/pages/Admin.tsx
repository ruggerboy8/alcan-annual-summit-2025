import { useState } from "react";
import { LogOut } from "lucide-react";
import PasswordGate from "@/components/admin/PasswordGate";
import RegistrationsTab from "@/components/admin/RegistrationsTab";
import CheckInTab from "@/components/admin/CheckInTab";
import EmailTemplatesTab from "@/components/admin/EmailTemplatesTab";
import SummitLogo from "@/components/SummitLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearStoredToken } from "@/lib/admin-api";

type Tab = "registrations" | "checkin" | "email";

const Admin = () => {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("registrations");

  if (!token) return <PasswordGate onAuthenticated={setToken} />;

  const signOut = () => {
    clearStoredToken();
    setToken(null);
  };

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "registrations", label: "Registrations" },
    { id: "checkin", label: "Check-In" },
    { id: "email", label: "Email Templates" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div style={{ height: 36 }}>
              <SummitLogo className="h-full w-auto" variant="white" animate={false} />
            </div>
            <span className="hidden sm:inline-block font-biondi text-sm uppercase tracking-widest">
              Summit Admin
            </span>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="bg-transparent border-white/30 text-white hover:bg-white hover:text-primary"
          >
            <LogOut className="mr-1.5 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {activeTab === "registrations" && <RegistrationsTab token={token} />}
        {activeTab === "checkin" && <CheckInTab token={token} />}
        {activeTab === "email" && <EmailTemplatesTab token={token} />}
      </main>
    </div>
  );
};

export default Admin;
