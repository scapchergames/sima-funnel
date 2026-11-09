// In-memory fallback for environments where Web Storage may throw (some in-app browsers)
const memoryStore = new Map<string, string>();
const isBrowser = typeof window !== "undefined";

export function storageGet(key: string): string | null {
  if (!isBrowser) return null;
  try {
    const v = sessionStorage.getItem(key) ?? localStorage.getItem(key);
    if (v !== null) return v;
  } catch { /* storage blocked */ }
  return memoryStore.get(key) ?? null;
}

export function storageSet(key: string, value: string): void {
  if (!isBrowser) return;
  memoryStore.set(key, value);
  try { sessionStorage.setItem(key, value); } catch { /* storage blocked */ }
  try { localStorage.setItem(key, value); } catch { /* storage blocked */ }
}

export function storageRemove(key: string): void {
  if (!isBrowser) return;
  memoryStore.delete(key);
  try { sessionStorage.removeItem(key); } catch { /* storage blocked */ }
  try { localStorage.removeItem(key); } catch { /* storage blocked */ }
}
