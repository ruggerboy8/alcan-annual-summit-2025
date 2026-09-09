import { useMemo } from "react";
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

/** Server caps pageSize at 500, so anything wanting "everything" must page. */
export const MAX_PAGE_SIZE = 500;

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
      // The admin token lasts 8 hours. When it lapses every endpoint starts
      // returning 401, and without this the UI just showed generic failures with
      // no route back to the login screen. Clear the token and let the shell
      // re-gate. Dispatched as an event so tabs do not each need a callback.
      if (res.status === 401) {
        clearStoredToken();
        window.dispatchEvent(new CustomEvent("admin-unauthorized"));
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
  promo_code: string | null;
  registration_status: string;
  confirmation_email_sent_at: string | null;
  confirmation_email_id: string | null;
  checked_in_at: string | null;
  checked_in_by: string | null;
  event_version: string;
  created_at: string;
};

export const CA_PROMO_CODE = "AlcanCA2026";

/** Promo-code registrants show as "Sponsor" or "Alcan CA". */
export function attendeeLabel(r: {
  attendee_type: "staff" | "guest";
  promo_code?: string | null;
}): "Sponsor" | "Alcan CA" | "Team" | "Guest" {
  if (r.promo_code) {
    return r.promo_code.toLowerCase() === CA_PROMO_CODE.toLowerCase()
      ? "Alcan CA"
      : "Sponsor";
  }
  return r.attendee_type === "staff" ? "Team" : "Guest";
}

export type RegistrationStats = {
  total: number;
  staff: number;
  guests: number;
  checkedIn: number;
  emailSent: number;
};

/**
 * Fetch every registration, paging until the server stops returning full pages.
 *
 * admin-list-registrations clamps pageSize to 500. Callers that wanted the whole
 * list were passing pageSize: 10000 and using the response as if it were
 * complete, so above 500 registrants the check-in desk and the CSV export were
 * both silently short — with no error and a wrong total in the header.
 */
export async function fetchAllRegistrations(
  api: (path: string, init?: AdminFetchInit) => Promise<any>,
  filters: { type?: string; search?: string } = {},
): Promise<{ registrations: Registration[]; total: number }> {
  const out: Registration[] = [];
  let page = 1;
  let total = 0;
  // Bounded so a server that always returns a full page cannot spin forever.
  for (let guard = 0; guard < 100; guard++) {
    const data = await api("/admin-list-registrations", {
      query: {
        type: filters.type ?? "all",
        search: filters.search,
        page,
        pageSize: MAX_PAGE_SIZE,
      },
    });
    const batch: Registration[] = data.registrations ?? [];
    total = data.total ?? total;
    out.push(...batch);
    if (batch.length < MAX_PAGE_SIZE) break;
    if (total && out.length >= total) break;
    page++;
  }
  return { registrations: out, total: total || out.length };
}
