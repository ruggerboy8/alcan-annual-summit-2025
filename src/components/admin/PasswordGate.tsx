import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SummitLogo from "@/components/SummitLogo";
import {
  getStoredToken,
  isTokenValid,
  storeToken,
} from "@/lib/admin-api";
import { SUPABASE_FUNCTIONS_URL } from "@/lib/event-constants";

interface PasswordGateProps {
  onAuthenticated: (token: string) => void;
}

export default function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = getStoredToken();
    if (isTokenValid(stored)) {
      onAuthenticated(stored as string);
    }
    setChecking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setError("Incorrect password.");
      } else if (!res.ok || !data?.token) {
        setError(data?.error ?? "Sign-in failed. Please try again.");
      } else {
        storeToken(data.token);
        onAuthenticated(data.token);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div style={{ height: 90 }}>
            <SummitLogo className="h-full w-auto" variant="black" animate={false} />
          </div>
        </div>
        <h1 className="font-biondi text-2xl font-bold text-primary text-center mb-1">
          Admin Access
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter the dashboard password to continue.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="admin-password" className="mb-1.5 block text-sm">
              Password
            </Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
