declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export type FbEventName =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "InitiateCheckout"
  | "Purchase"
  | "CompleteRegistration";

export interface FbEventParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  predicted_ltv?: number;
  num_items?: number;
  status?: string;
}

export function fbEvent(eventName: FbEventName, params?: FbEventParams): void {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;
  window.fbq("track", eventName, params ?? {});
}

export function fbCustomEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;
  window.fbq("trackCustom", eventName, params ?? {});
}
