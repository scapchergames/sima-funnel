import { v4 as uuid } from "uuid";
import { getStore } from "@netlify/blobs";
import type { FunnelSession, SessionPatch } from "@/lib/session/types";

function sessionStore() {
  return getStore({ name: "sessions", consistency: "strong" });
}

function now() {
  return new Date().toISOString();
}

export async function createSession(body: Partial<FunnelSession>): Promise<FunnelSession> {
  const session: FunnelSession = {
    id: uuid(),
    locale: body.locale ?? "tr",
    angle: body.angle ?? null,
    utmSource: body.utmSource ?? null,
    utmMedium: body.utmMedium ?? null,
    utmCampaign: body.utmCampaign ?? null,
    utmContent: body.utmContent ?? null,
    fbclid: body.fbclid ?? null,
    fbp: body.fbp ?? null,
    fbc: body.fbc ?? null,
    experimentVariants: {},
    currentStep: "start",
    quizAnswers: {},
    traits: {},
    analysisId: null,
    email: null,
    marketingOptIn: false,
    paid: false,
    createdAt: now(),
    updatedAt: now(),
  };
  await sessionStore().setJSON(session.id, session);
  return session;
}

export async function getSession(id: string): Promise<FunnelSession | null> {
  const session = await sessionStore().get(id, { type: "json" });
  return (session as FunnelSession | null) ?? null;
}

export async function patchSession(id: string, patch: SessionPatch): Promise<FunnelSession | null> {
  const store = sessionStore();
  const existing = await store.get(id, { type: "json" }) as FunnelSession | null;
  if (!existing) return null;
  const updated: FunnelSession = { ...existing, ...patch, id, createdAt: existing.createdAt, updatedAt: now() };
  await store.setJSON(id, updated);
  return updated;
}
