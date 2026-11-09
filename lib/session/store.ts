import type { FunnelSession, SessionPatch } from "./types";
import { storageGet, storageSet } from "@/lib/storage";

const SESSION_KEY = "sima_session_id";

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return storageGet(SESSION_KEY);
}

export function setSessionId(id: string): void {
  if (typeof window === "undefined") return;
  storageSet(SESSION_KEY, id);
}

export async function createSession(params: {
  locale: string;
  angle?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
}): Promise<FunnelSession> {
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) throw new Error("Session oluşturulamadı");

  const session = (await res.json()) as FunnelSession;
  setSessionId(session.id);
  return session;
}

export async function patchSession(id: string, patch: SessionPatch): Promise<void> {
  await fetch("/api/session", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...patch }),
  });
}

export async function getOrCreateSession(params: {
  locale: string;
  angle?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
}): Promise<FunnelSession> {
  const existingId = getSessionId();

  if (existingId) {
    const res = await fetch(`/api/session?id=${existingId}`);
    if (res.ok) {
      return res.json() as Promise<FunnelSession>;
    }
  }

  return createSession(params);
}
