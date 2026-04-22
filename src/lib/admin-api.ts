import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_TOKEN_STORAGE_KEY,
  SUPABASE_FUNCTIONS_URL,
} from "@/lib/event-constants";

/** Decode the admin HMAC token payload (base64url payload.signature). */
function decodeTokenPayload(token: string): { exp?: number; role?: string } | null {
  try {
    const [payloadB64] = token.split(".");
    if (!payloadB64) return null;
    const json = atob(payloadB64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null): token is string {
  if (!token) return false;
  const payload = decodeTokenPayload(token);
  if (!payload?.exp) return false;
  return Date.now() < payload.exp;
}

export function getStoredToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearStoredToken() {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export function storeToken(token: string) {
  try {
    sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  } catch {
    /* noop */
  }
}

export interface AdminFetchInit extends Omit<RequestInit, "headers" | "body"> {
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
}

/** Hook returning a tokenised fetch helper for admin endpoints. */
export function useAdminApi(token: string) {
  return useMemo(() => {
    return async function adminFetch(path: string, init: AdminFetchInit = {}) {
      const url = new URL(`${SUPABASE_FUNCTIONS_URL}${path}`);
      if (init.query) {
        for (const [k, v] of Object.entries(init.query)) {
          if (v !== undefined && v !== null && v !== "") {
            url.searchParams.set(k, String(v));
          }
        }
      }

      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      };

      const res = await fetch(url.toString(), {
        method: init.method ?? "GET",
        headers,
        body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      });

      const text = await res.text();
      let data: any = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }
      if (!res.ok) {
        const err = new Error(
          (data && typeof data === "object" && "error" in data)
            ? (data as any).error
            : `Request failed (${res.status})`,
        );
        (err as any).status = res.status;
        (err as any).data = data;
        throw err;
      }
      return data;
    };
  }, [token]);
}

/** Hook that auto-validates the token; redirects to login by clearing. */
export function useAdminToken(token: string, onExpired: () => void) {
  useEffect(() => {
    if (!isTokenValid(token)) {
      clearStoredToken();
      onExpired();
    }
  }, [token, onExpired]);
}

export type Registration = {
  id: string;
  attendee_type: "staff" | "guest";
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  practice: string | null;
  organization: string | null;
  role: string | null;
  registration_status: string;
  confirmation_email_sent_at: string | null;
  confirmation_email_id: string | null;
  checked_in_at: string | null;
  checked_in_by: string | null;
  event_version: string;
  created_at: string;
};

export type RegistrationStats = {
  total: number;
  staff: number;
  guests: number;
  checkedIn: number;
  emailSent: number;
};

export function _internal_useState() {
  return useState;
}
